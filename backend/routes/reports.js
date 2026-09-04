const express = require('express');
const router = express.Router();
const db = require('../db/database');

const parseJson = (val, fallback = []) => {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

// GET /api/reports/:id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM inspections WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Inspection record not found' });

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const report = {
      reportId: `REP-LM-${row.id.replace('INS-', '')}`,
      inspectionId: row.id,
      generatedAt: formattedDate,
      generatedTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      productName: row.productName,
      brand: row.brand,
      category: row.category,
      manufacturer: row.manufacturer,
      manufacturerAddress: row.manufacturerAddress,
      status: row.status,
      score: row.score,
      verifiedBy: row.verifiedBy || 'Central Verification Directorate',
      verifiedAt: row.verifiedAt || row.submittedAt,
      declarations: parseJson(row.declarations),
      violations: parseJson(row.violations),
      adminRemarks: row.adminRemarks,
      auditTimeline: parseJson(row.auditTimeline),
      qrToken: `SM-AUTH-VERIFY-${row.id}-${Date.now()}`
    };

    res.json(report);
  });
});

module.exports = router;
