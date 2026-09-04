const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'smartmetrix_production_secret_key_2026_sih_legal_metrology';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.roleKey !== requiredRole) {
      return res.status(403).json({ error: 'Unauthorized officer role for this action' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
  JWT_SECRET
};
