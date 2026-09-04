const db = require('./db/database');

const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-2026-001",
    title: "New Inspection INS-2026-00124 Submitted",
    message: "Product 'India Gate Feast Rozzana Basmati Rice' uploaded by Rahul Mehta is awaiting review.",
    timestamp: "02 Sep 2026 — 10:15 AM",
    read: 0,
    type: "info",
    role: "admin",
    inspectionId: "INS-2026-00124"
  },
  {
    id: "NOTIF-2026-002",
    title: "Inspection INS-2026-00123 Rejected",
    message: "Officer Priya Sharma marked product 'Aashirvaad Whole Wheat Atta' as non_compliant.",
    timestamp: "31 Aug 2026 — 03:45 PM",
    read: 1,
    type: "error",
    role: "user",
    inspectionId: "INS-2026-00123"
  }
];

setTimeout(() => {
    db.serialize(() => {
        db.get(`SELECT COUNT(*) as count FROM notifications`, [], (err, row) => {
            if (row && row.count === 0) {
                console.log('Seeding initial notifications...');
                const stmt = db.prepare(`INSERT INTO notifications (id, title, message, timestamp, read, type, role, inspectionId) VALUES (?,?,?,?,?,?,?,?)`);
                for (const n of INITIAL_NOTIFICATIONS) {
                    stmt.run(n.id, n.title, n.message, n.timestamp, n.read, n.type, n.role, n.inspectionId);
                }
                stmt.finalize();
            } else {
                console.log('Database already has data.');
            }
        });
    });
}, 1000);
