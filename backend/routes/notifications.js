const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET /api/notifications
router.get('/', (req, res) => {
    const roleKey = req.query.role || 'all';
    
    let sql = `SELECT * FROM notifications ORDER BY id DESC`;
    let params = [];
    
    if (roleKey !== 'all') {
        sql = `SELECT * FROM notifications WHERE role = 'all' OR role = ? ORDER BY id DESC`;
        params = [roleKey];
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Convert integer 'read' back to boolean for frontend compatibility
        const formatted = rows.map(r => ({
            ...r,
            read: r.read === 1
        }));
        
        res.json(formatted);
    });
});

// PUT /api/notifications/:id/read
router.put('/:id/read', (req, res) => {
    const id = req.params.id;
    db.run(`UPDATE notifications SET read = 1 WHERE id = ?`, [id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        
        // Return updated list for convenience, or just success
        res.json({ success: true });
    });
});

module.exports = router;
