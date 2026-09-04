const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/rules
router.get('/', (req, res) => {
  db.all('SELECT * FROM rules ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/rules/:id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM rules WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Rule not found' });
    res.json(row);
  });
});

module.exports = router;
