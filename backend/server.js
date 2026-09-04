require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers with Helmet
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(','),
  credentials: true
}));

// Rate Limiting: 200 requests per 15 mins for general API
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

// Strict Rate Limiting for Login: 20 attempts per 15 mins
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Please try again after 15 minutes.' }
});

app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);

// Body parsers
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Initialize DB & auto-seed
require('./db/database');
require('./seed');

// Register API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/rules', require('./routes/rules'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analyze-image', require('./routes/ocr'));
app.use('/api/upload', require('./routes/upload'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    database: 'SQLite (smartmetrix.db)',
    timestamp: new Date().toISOString(),
    security: {
      helmet: 'active',
      rateLimiter: 'active',
      bcryptRounds: 12,
      jwtAuth: 'active'
    },
    message: 'SmartMetriX Production Backend Server is active.'
  });
});

app.listen(PORT, () => {
  console.log(`[SmartMetriX] Production Backend running on port ${PORT}`);
});
