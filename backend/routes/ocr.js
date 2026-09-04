const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration with sanitized names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `ocr-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  }
});

// Strict MIME filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and WebP product label images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

// Helper to extract fields from raw OCR text
const extractFields = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const result = {
    productName: '',
    brand: '',
    manufacturer: '',
    mrp: '',
    netQuantity: '',
    dateOfPacking: '',
    consumerCare: ''
  };

  if (lines.length > 0) {
    result.productName = lines[0];
    result.brand = lines[0].split(' ')[0];
  }

  for (let line of lines) {
    let lower = line.toLowerCase();

    // Match Manufacturer
    if (lower.includes('ltd') || lower.includes('pvt') || lower.includes('limited') || lower.includes('company') || lower.includes('mfd')) {
      if (!result.manufacturer) result.manufacturer = line;
    }

    // Match MRP
    if (lower.includes('mrp') || lower.includes('rs') || line.includes('₹')) {
      if (!result.mrp) result.mrp = line;
    }

    // Match Net Quantity
    if (lower.match(/\b\d+\s*(kg|g|ml|l|litre|liter)s?\b/)) {
      if (!result.netQuantity) result.netQuantity = line;
    }

    // Match Date
    if (lower.includes('mfg') || lower.includes('pkd') || lower.includes('date') || lower.match(/\b\d{2}[/-]\d{2}[/-]\d{2,4}\b/)) {
      if (!result.dateOfPacking) result.dateOfPacking = line;
    }

    // Match Consumer Care
    if (lower.includes('email') || lower.includes('care') || lower.includes('helpline') || lower.includes('toll') || lower.match(/\d{4}-\d{3}-\d{4}/)) {
      if (!result.consumerCare) result.consumerCare = line;
    }
  }

  return result;
};

// POST /api/analyze-image
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No product label image provided' });
  }

  try {
    const imagePath = req.file.path;

    // Run Tesseract OCR engine
    const { data } = await Tesseract.recognize(
      imagePath,
      'eng',
      { logger: () => {} }
    );

    const extractedText = data.text;
    const parsedFields = extractFields(extractedText);

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({
      rawText: extractedText,
      parsed: parsedFields,
      fileUrl: fileUrl
    });
  } catch (err) {
    console.error('OCR Error:', err);
    res.status(500).json({ error: 'OCR processing failed' });
  }
});

module.exports = router;
