const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// POST /api/upload
// Accepts an array of files under the field name 'images'
router.post('/', upload.array('images', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images provided' });
    }

    try {
        const fileUrls = req.files.map(file => {
            return `http://localhost:5000/uploads/${file.filename}`;
        });
        
        res.json({
            success: true,
            urls: fileUrls
        });
    } catch (err) {
        console.error('Upload Error:', err);
        res.status(500).json({ error: 'Image upload failed' });
    }
});

module.exports = router;
