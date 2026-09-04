const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Init DB
require('./db/database');

// Routes
app.use('/api/inspections', require('./routes/inspections'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analyze-image', require('./routes/ocr'));
app.use('/api/upload', require('./routes/upload'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
