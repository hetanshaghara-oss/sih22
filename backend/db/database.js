const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'smartmetrix.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create Inspections table
        db.run(`CREATE TABLE IF NOT EXISTS inspections (
            id TEXT PRIMARY KEY,
            productName TEXT,
            brand TEXT,
            category TEXT,
            manufacturer TEXT,
            manufacturerAddress TEXT,
            netQuantity TEXT,
            mrp TEXT,
            dateOfPacking TEXT,
            consumerCare TEXT,
            countryOfOrigin TEXT,
            fssaiLicense TEXT,
            submittedBy TEXT,
            submittedByBadge TEXT,
            submittedAt TEXT,
            status TEXT,
            score INTEGER,
            priority TEXT,
            verifiedBy TEXT,
            verifiedAt TEXT,
            images TEXT,
            declarations TEXT,
            violations TEXT,
            adminRemarks TEXT,
            auditTimeline TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating inspections table', err.message);
            }
        });

        // Create Notifications table
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            title TEXT,
            message TEXT,
            timestamp TEXT,
            read INTEGER,
            type TEXT,
            role TEXT,
            inspectionId TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating notifications table', err.message);
            }
        });
    }
});

module.exports = db;
