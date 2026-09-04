const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Helper to parse JSON fields safely
const parseJson = (val, fallback = []) => {
    try {
        return JSON.parse(val);
    } catch {
        return fallback;
    }
};

// GET /api/inspections
router.get('/', (req, res) => {
    db.all(`SELECT * FROM inspections ORDER BY id DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const parsedRows = rows.map(r => ({
            ...r,
            images: parseJson(r.images),
            declarations: parseJson(r.declarations),
            violations: parseJson(r.violations),
            auditTimeline: parseJson(r.auditTimeline)
        }));
        res.json(parsedRows);
    });
});

// GET /api/inspections/:id
router.get('/:id', (req, res) => {
    db.get(`SELECT * FROM inspections WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) return res.status(404).json({ error: 'Not found' });
        
        row.images = parseJson(row.images);
        row.declarations = parseJson(row.declarations);
        row.violations = parseJson(row.violations);
        row.auditTimeline = parseJson(row.auditTimeline);
        
        res.json(row);
    });
});

// POST /api/inspections
router.post('/', (req, res) => {
    db.get(`SELECT COUNT(*) as count FROM inspections`, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const count = (row.count || 0) + 125;
        const newId = `INS-2026-${String(count).padStart(5, '0')}`;
        
        const body = req.body;
        const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const record = {
            id: newId,
            productName: body.productName || "Demo Packaged Commodity",
            brand: body.brand || "Sample Brand",
            category: body.category || "Food Grain",
            manufacturer: body.manufacturer || "Demo Manufacturing Works Pvt. Ltd.",
            manufacturerAddress: body.manufacturerAddress || "123 Industrial Estate, Phase 1, New Delhi - 110020",
            netQuantity: body.netQuantity || "1 kg",
            mrp: body.mrp || "₹199.00",
            dateOfPacking: body.dateOfPacking || "01-09-2026",
            consumerCare: body.consumerCare || "Email: care@demomanufacturer.demo | Tel: 1800-111-2222",
            countryOfOrigin: body.countryOfOrigin || "India",
            fssaiLicense: body.fssaiLicense || "10020000001111",
            submittedBy: body.submittedBy || "Rahul Mehta",
            submittedByBadge: "EO-8842-DL",
            submittedAt: timestamp,
            status: "under_review",
            score: 82,
            priority: body.priority || "Normal",
            verifiedBy: null,
            verifiedAt: null,
            images: JSON.stringify(body.images || [{
                id: "img-user-1",
                label: "Front Packaging Label",
                url: body.previewUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
                quality: "Good",
                resolution: "1920x1080",
                size: "2.1 MB",
                boundingBoxes: [
                    { id: "b-new-1", label: "Product Name", status: "valid", x: 15, y: 15, width: 70, height: 20 },
                    { id: "b-new-2", label: "Net Quantity", status: "valid", x: 60, y: 70, width: 30, height: 18 }
                ]
            }]),
            declarations: JSON.stringify([
                { key: "productName", label: "Product Name / Generic Identity", value: body.productName || "Demo Commodity", status: "valid", rule: "LM-001" },
                { key: "manufacturer", label: "Manufacturer Details", value: body.manufacturer || "Demo Mfg Pvt Ltd", status: "valid", rule: "LM-002" },
                { key: "netQuantity", label: "Net Quantity Statement", value: body.netQuantity || "1 kg", status: "valid", rule: "LM-003" },
                { key: "mrp", label: "MRP Declaration", value: body.mrp || "₹199.00", status: "valid", rule: "LM-004" },
                { key: "dateOfPacking", label: "Manufacturing / Packing Date", value: body.dateOfPacking || "01-09-2026", status: "valid", rule: "LM-005" },
                { key: "consumerCare", label: "Consumer Care Details", value: body.consumerCare || "1800-111-2222", status: "needs_review", rule: "LM-006" },
                { key: "countryOfOrigin", label: "Country of Origin", value: body.countryOfOrigin || "India", status: "valid", rule: "LM-007" }
            ]),
            violations: JSON.stringify([
                {
                    id: `VIO-${newId}-1`,
                    ruleId: "LM-006",
                    title: "Consumer Helpline font size compliance requires review",
                    severity: "Medium",
                    evidenceImage: "Front Packaging Label",
                    status: "Pending Review",
                    remarks: "Verification officer to verify telephone font height meets minimum 1.5mm threshold."
                }
            ]),
            adminRemarks: "",
            auditTimeline: JSON.stringify([
                { title: "Inspection Submitted", date: timestamp, actor: `${body.submittedBy || "Rahul Mehta"} (Enforcement Officer)` },
                { title: "Image Quality & Region Detection Checked", date: timestamp, actor: "SmartMetriX Automated Engine" }
            ])
        };

        const sql = `INSERT INTO inspections (
            id, productName, brand, category, manufacturer, manufacturerAddress, netQuantity, mrp, 
            dateOfPacking, consumerCare, countryOfOrigin, fssaiLicense, submittedBy, submittedByBadge, 
            submittedAt, status, score, priority, verifiedBy, verifiedAt, images, declarations, 
            violations, adminRemarks, auditTimeline
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const params = [
            record.id, record.productName, record.brand, record.category, record.manufacturer, record.manufacturerAddress, record.netQuantity, record.mrp,
            record.dateOfPacking, record.consumerCare, record.countryOfOrigin, record.fssaiLicense, record.submittedBy, record.submittedByBadge,
            record.submittedAt, record.status, record.score, record.priority, record.verifiedBy, record.verifiedAt, record.images, record.declarations,
            record.violations, record.adminRemarks, record.auditTimeline
        ];

        db.run(sql, params, function(err) {
            if (err) return res.status(500).json({ error: err.message });
            
            // Send back parsed objects so frontend matches
            record.images = parseJson(record.images);
            record.declarations = parseJson(record.declarations);
            record.violations = parseJson(record.violations);
            record.auditTimeline = parseJson(record.auditTimeline);
            
            // Also notify admin
            const notifId = `NOTIF-${Date.now()}`;
            db.run(`INSERT INTO notifications (id, title, message, timestamp, read, type, role, inspectionId) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [notifId, `New Inspection ${record.id} Submitted`, `Product '${record.productName}' uploaded by ${record.submittedBy} is awaiting review.`, 'Just now', 0, 'info', 'admin', record.id]);

            res.json(record);
        });
    });
});

// PUT /api/inspections/:id/review
router.put('/:id/review', (req, res) => {
    const id = req.params.id;
    const reviewData = req.body;
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    db.get(`SELECT * FROM inspections WHERE id = ?`, [id], (err, row) => {
        if (err || !row) return res.status(404).json({ error: 'Not found' });
        
        let declarations = reviewData.declarations ? reviewData.declarations : parseJson(row.declarations);
        const validCount = declarations.filter((d) => d.status === "valid").length;
        const totalCount = declarations.length;
        const computedScore = Math.round((validCount / totalCount) * 100);
        
        const status = reviewData.status || row.status;
        const adminRemarks = reviewData.adminRemarks ?? row.adminRemarks;
        const verifiedBy = reviewData.verifiedBy || "Priya Sharma (Verification Officer)";
        const violations = reviewData.violations ? JSON.stringify(reviewData.violations) : row.violations;
        
        let auditTimeline = parseJson(row.auditTimeline);
        auditTimeline.push({
            title: `Inspection Marked: ${status.toUpperCase().replace('_', ' ')}`,
            date: timestamp,
            actor: verifiedBy
        });
        
        const sql = `UPDATE inspections SET 
            status = ?, score = ?, declarations = ?, violations = ?, 
            adminRemarks = ?, verifiedBy = ?, verifiedAt = ?, auditTimeline = ? 
            WHERE id = ?`;
            
        const params = [
            status, computedScore, JSON.stringify(declarations), violations,
            adminRemarks, verifiedBy, timestamp, JSON.stringify(auditTimeline), id
        ];
        
        db.run(sql, params, function(err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            
            // Notify user
            const notifId = `NOTIF-${Date.now()}`;
            const type = status === "compliant" ? "success" : status === "non_compliant" ? "error" : "warning";
            db.run(`INSERT INTO notifications (id, title, message, timestamp, read, type, role, inspectionId) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
                    [notifId, `Inspection ${id} Review Completed`, `Officer ${verifiedBy} set status to ${status.toUpperCase().replace('_', ' ')} with score ${computedScore}%.`, 'Just now', 0, type, 'user', id]);
            
            row.status = status;
            row.score = computedScore;
            row.declarations = declarations;
            row.violations = parseJson(violations);
            row.adminRemarks = adminRemarks;
            row.verifiedBy = verifiedBy;
            row.verifiedAt = timestamp;
            row.auditTimeline = auditTimeline;
            row.images = parseJson(row.images);
            
            res.json(row);
        });
    });
});

module.exports = router;
