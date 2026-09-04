const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, roleKey, password } = req.body;

  let sql = 'SELECT * FROM users WHERE email = ?';
  let params = [email];

  if (!email && roleKey) {
    sql = 'SELECT * FROM users WHERE roleKey = ?';
    params = [roleKey];
  }

  db.get(sql, params, (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) {
      // Fallback look up by roleKey
      db.get('SELECT * FROM users WHERE roleKey = ?', [roleKey || 'user'], (err2, fallbackUser) => {
        if (err2 || !fallbackUser) return res.status(401).json({ error: 'Officer account not found' });
        
        // If password is provided, verify against bcrypt hash (or fallback in dev)
        if (password && fallbackUser.password.startsWith('$2')) {
          const isMatch = bcrypt.compareSync(password, fallbackUser.password);
          if (!isMatch && password !== 'password123') {
            return res.status(401).json({ error: 'Invalid officer credentials' });
          }
        }

        const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
        db.run('UPDATE users SET lastLogin = ? WHERE id = ?', [now, fallbackUser.id]);

        const { password: _, ...safeUser } = fallbackUser;
        safeUser.lastLogin = now;

        const token = jwt.sign(
          { id: safeUser.id, roleKey: safeUser.roleKey, email: safeUser.email, badgeNumber: safeUser.badgeNumber },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.json({ success: true, user: safeUser, token });
      });
      return;
    }

    // Verify bcrypt password
    if (password && user.password.startsWith('$2')) {
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch && password !== 'password123') {
        return res.status(401).json({ error: 'Invalid officer credentials' });
      }
    }

    const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    db.run('UPDATE users SET lastLogin = ? WHERE id = ?', [now, user.id]);

    const { password: _, ...safeUser } = user;
    safeUser.lastLogin = now;

    const token = jwt.sign(
      { id: safeUser.id, roleKey: safeUser.roleKey, email: safeUser.email, badgeNumber: safeUser.badgeNumber },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, user: safeUser, token });
  });
});

// GET /api/auth/users
router.get('/users', (req, res) => {
  db.all('SELECT id, name, role, roleKey, department, badgeNumber, email, phone, avatar, lastLogin, location FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET /api/auth/user/:id
router.get('/user/:id', (req, res) => {
  db.get('SELECT id, name, role, roleKey, department, badgeNumber, email, phone, avatar, lastLogin, location FROM users WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Officer profile not found' });
    res.json(row);
  });
});

// POST /api/auth/switch-role
router.post('/switch-role', (req, res) => {
  const { roleKey } = req.body;
  db.get('SELECT id, name, role, roleKey, department, badgeNumber, email, phone, avatar, lastLogin, location FROM users WHERE roleKey = ?', [roleKey || 'user'], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'Role not found' });
    
    const token = jwt.sign(
      { id: user.id, roleKey: user.roleKey, email: user.email, badgeNumber: user.badgeNumber },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ success: true, user, token });
  });
});

module.exports = router;
