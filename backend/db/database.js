const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'smartmetrix.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to SQLite database: smartmetrix.db');
        
        // 1. Create Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            roleKey TEXT NOT NULL,
            department TEXT NOT NULL,
            badgeNumber TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            phone TEXT NOT NULL,
            avatar TEXT NOT NULL,
            password TEXT NOT NULL,
            lastLogin TEXT NOT NULL,
            location TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating users table', err.message);
        });

        // 2. Create Inspections Table
        db.run(`CREATE TABLE IF NOT EXISTS inspections (
            id TEXT PRIMARY KEY,
            productName TEXT NOT NULL,
            brand TEXT,
            category TEXT NOT NULL,
            manufacturer TEXT NOT NULL,
            manufacturerAddress TEXT,
            netQuantity TEXT,
            mrp TEXT,
            dateOfPacking TEXT,
            consumerCare TEXT,
            countryOfOrigin TEXT,
            fssaiLicense TEXT,
            submittedBy TEXT NOT NULL,
            submittedByBadge TEXT,
            submittedAt TEXT NOT NULL,
            status TEXT NOT NULL,
            score INTEGER NOT NULL,
            priority TEXT DEFAULT 'Normal',
            verifiedBy TEXT,
            verifiedAt TEXT,
            images TEXT NOT NULL,
            declarations TEXT NOT NULL,
            violations TEXT NOT NULL,
            adminRemarks TEXT,
            auditTimeline TEXT NOT NULL
        )`, (err) => {
            if (err) console.error('Error creating inspections table', err.message);
        });

        // 3. Create Notifications Table
        db.run(`CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            read INTEGER DEFAULT 0,
            type TEXT NOT NULL,
            role TEXT NOT NULL,
            inspectionId TEXT
        )`, (err) => {
            if (err) console.error('Error creating notifications table', err.message);
        });

        // 4. Create Rules Table
        db.run(`CREATE TABLE IF NOT EXISTS rules (
            id TEXT PRIMARY KEY,
            ruleNumber TEXT NOT NULL,
            declaration TEXT NOT NULL,
            legalReference TEXT NOT NULL,
            description TEXT NOT NULL,
            severity TEXT NOT NULL,
            status TEXT DEFAULT 'Active'
        )`, (err) => {
            if (err) console.error('Error creating rules table', err.message);
        });
    }
});

module.exports = db;
