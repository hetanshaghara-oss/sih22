const db = require('./db/database');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 12;

const RAW_USERS = [
  {
    id: "USR-101",
    name: "Rahul Mehta",
    role: "Inspection Officer",
    roleKey: "user",
    department: "Department of Consumer Affairs — Enforcement Cell",
    badgeNumber: "IO-8842-DL",
    email: "rahul.mehta@consumeraffairs.gov.in",
    phone: "+91 98765 43210",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    rawPassword: "password123",
    lastLogin: "2026-09-04 09:45 AM",
    location: "New Delhi Inspection Zone 4"
  },
  {
    id: "ADM-502",
    name: "Priya Sharma",
    role: "Verification Officer",
    roleKey: "admin",
    department: "Legal Metrology Central Directorate — Verification Wing",
    badgeNumber: "LM-VO-1029",
    email: "priya.sharma@legalmetrology.gov.in",
    phone: "+91 98112 34567",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250",
    rawPassword: "password123",
    lastLogin: "2026-09-04 10:15 AM",
    location: "Central Directorate HQ, New Delhi"
  }
];

const SEED_RULES = [
  {
    id: "RULE-001",
    ruleNumber: "Rule 6(1)(a)",
    declaration: "Name and Address of Manufacturer / Packer / Importer",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(a)",
    description: "Every package shall bear the name and complete address of the manufacturer or where the manufacturer is not the packer, the name and address of the manufacturer and packer.",
    severity: "High",
    status: "Active"
  },
  {
    id: "RULE-002",
    ruleNumber: "Rule 6(1)(b)",
    declaration: "Generic or Common Name of Commodity",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(b)",
    description: "The generic or common name of the commodity contained in the package must be prominently stated on the principal display panel.",
    severity: "High",
    status: "Active"
  },
  {
    id: "RULE-003",
    ruleNumber: "Rule 6(1)(c)",
    declaration: "Net Quantity in Standard Metric Units",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(c) & Rule 11",
    description: "The net quantity in terms of standard unit of weight or measure (g, kg, ml, l) must be declared with minimum specified numeral height based on pack area.",
    severity: "High",
    status: "Active"
  },
  {
    id: "RULE-004",
    ruleNumber: "Rule 6(1)(d)",
    declaration: "Month and Year of Manufacture / Packing / Import",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(d)",
    description: "The month and year in which the commodity is manufactured or pre-packed or imported must be clearly legible and indelible.",
    severity: "High",
    status: "Active"
  },
  {
    id: "RULE-005",
    ruleNumber: "Rule 6(1)(e)",
    declaration: "Maximum Retail Price (MRP) in ₹ Format",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(1)(e)",
    description: "Maximum Retail Price inclusive of all taxes in format '₹ xx.xx (incl. of all taxes)' or 'MRP Rs. xx.xx (incl. of all taxes)'.",
    severity: "High",
    status: "Active"
  },
  {
    id: "RULE-006",
    ruleNumber: "Rule 6(1)(g)",
    declaration: "Country of Origin for Imported Products",
    legalReference: "Legal Metrology (Packaged Commodities) Amendment Rules, 2017",
    description: "Name of the country of origin or manufacture or assembly in case of imported products must be declared on the label.",
    severity: "Medium",
    status: "Active"
  },
  {
    id: "RULE-007",
    ruleNumber: "Rule 6(2)",
    declaration: "Consumer Care Contact Details (Phone & Email)",
    legalReference: "Legal Metrology (Packaged Commodities) Rules, 2011 - Rule 6(2)",
    description: "Name, address, telephone number, and e-mail address of the person who can be contacted by the consumer in case of complaints.",
    severity: "Medium",
    status: "Active"
  },
  {
    id: "RULE-008",
    ruleNumber: "Rule 6(1)(h)",
    declaration: "Unit Sale Price Declaration",
    legalReference: "Legal Metrology (Packaged Commodities) Amendment Rules, 2021",
    description: "Declaration of Unit Sale Price in terms of per gram / per kilogram / per millilitre / per litre / per piece.",
    severity: "Medium",
    status: "Active"
  }
];

const SEED_INSPECTIONS = [
  {
    id: "INS-2026-00124",
    productName: "India Gate Feast Rozzana Basmati Rice",
    brand: "India Gate",
    category: "Food Grain",
    manufacturer: "KRBL Limited",
    manufacturerAddress: "5190, Lahori Gate, Delhi - 110006",
    netQuantity: "5 kg",
    mrp: "₹590.00",
    dateOfPacking: "12-08-2026",
    consumerCare: "Helpline: 011-23968328 | Email: customercare@krblindia.com",
    countryOfOrigin: "India",
    fssaiLicense: "10012011000145",
    submittedBy: "Rahul Mehta",
    submittedByBadge: "EO-8842-DL",
    submittedAt: "02 Sep 2026 — 10:15 AM",
    status: "under_review",
    score: 78,
    priority: "Normal",
    verifiedBy: "Priya Sharma",
    verifiedAt: null,
    images: JSON.stringify([
      {
        id: "img-1",
        label: "Front Packaging Label",
        url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
        quality: "Good",
        resolution: "1920x1080",
        size: "2.4 MB",
        boundingBoxes: [
          { id: "b1", label: "Product Name", status: "valid", x: 15, y: 12, width: 70, height: 18, comment: "Rule 6(1)(a) Mandatory Identity" },
          { id: "b2", label: "Net Quantity Statement", status: "valid", x: 65, y: 75, width: 28, height: 15, comment: "Rule 6(1)(c) Standard Metric Unit" },
          { id: "b3", label: "FSSAI License", status: "valid", x: 10, y: 80, width: 30, height: 14, comment: "14-digit FSSAI Number" }
        ]
      },
      {
        id: "img-2",
        label: "Rear Declaration Panel",
        url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&q=80&w=800",
        quality: "Needs Review",
        resolution: "1280x720",
        size: "1.8 MB",
        boundingBoxes: [
          { id: "b4", label: "MRP Declaration", status: "valid", x: 20, y: 25, width: 45, height: 16, comment: "Rupee symbol ₹ format" },
          { id: "b5", label: "Date of Packaging", status: "invalid", x: 20, y: 48, width: 40, height: 14, comment: "Packing month unreadable due to ink smear" },
          { id: "b6", label: "Consumer Helpline", status: "needs_review", x: 15, y: 68, width: 60, height: 20, comment: "Phone number legible, email text small" }
        ]
      }
    ]),
    declarations: JSON.stringify([
      { key: "productName", label: "Product Name / Generic Identity", value: "India Gate Feast Rozzana Basmati Rice", status: "valid", rule: "LM-001" },
      { key: "manufacturer", label: "Manufacturer Details", value: "KRBL Limited, Delhi - 110006", status: "valid", rule: "LM-002" },
      { key: "netQuantity", label: "Net Quantity Statement", value: "5 kg", status: "valid", rule: "LM-003" },
      { key: "mrp", label: "MRP Declaration", value: "₹590.00 (Incl. of all taxes)", status: "valid", rule: "LM-004" },
      { key: "dateOfPacking", label: "Manufacturing / Packing Date", value: "12-08-2026 (Ink Smear)", status: "invalid", rule: "LM-005" },
      { key: "consumerCare", label: "Consumer Care Details", value: "011-23968328", status: "needs_review", rule: "LM-006" },
      { key: "countryOfOrigin", label: "Country of Origin", value: "India", status: "valid", rule: "LM-007" }
    ]),
    violations: JSON.stringify([
      {
        id: "VIO-124-1",
        ruleId: "LM-005",
        title: "Month and year of packaging stamp unreadable",
        severity: "High",
        evidenceImage: "Rear Declaration Panel",
        status: "Pending Review",
        remarks: "Packing date stamp on rear panel displays low contrast and ink smudging under Rule 6(1)(d)."
      },
      {
        id: "VIO-124-2",
        ruleId: "LM-006",
        title: "Consumer redressal email font height below minimum threshold",
        severity: "Medium",
        evidenceImage: "Rear Declaration Panel",
        status: "Pending Review",
        remarks: "Customer care email printed near lower seal seam."
      }
    ]),
    adminRemarks: "Manufacturing date declaration could not be verified from the submitted images. Please provide a clearer image of the rear label.",
    auditTimeline: JSON.stringify([
      { title: "Inspection Submitted", date: "02 Sep 2026 — 10:15 AM", actor: "Rahul Mehta (Enforcement Officer)" },
      { title: "Quality & OCR Extracted", date: "02 Sep 2026 — 10:16 AM", actor: "SmartMetriX System Engine" },
      { title: "Assigned for Officer Review", date: "02 Sep 2026 — 10:16 AM", actor: "Priya Sharma (Verification Officer)" }
    ])
  },
  {
    id: "INS-2026-00120",
    productName: "Amul Pasteurised Butter",
    brand: "Amul",
    category: "Dairy Products",
    manufacturer: "GCMMF Ltd., Anand, Gujarat",
    manufacturerAddress: "Amul Dairy Road, Anand, Gujarat - 388001",
    netQuantity: "500 g",
    mrp: "₹275.00",
    dateOfPacking: "10-08-2026",
    consumerCare: "Toll Free: 1800-258-3333 | Email: customercare@amul.coop",
    countryOfOrigin: "India",
    fssaiLicense: "10012021000071",
    submittedBy: "Rahul Mehta",
    submittedByBadge: "EO-8842-DL",
    submittedAt: "01 Sep 2026 — 03:20 PM",
    status: "compliant",
    score: 96,
    priority: "Normal",
    verifiedBy: "Priya Sharma",
    verifiedAt: "01 Sep 2026 — 04:30 PM",
    images: JSON.stringify([
      {
        id: "img-butter-1",
        label: "Outer Pack Wrapper",
        url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&q=80&w=800",
        quality: "Good",
        resolution: "2048x1536",
        size: "3.1 MB",
        boundingBoxes: [
          { id: "sb1", label: "Product Name", status: "valid", x: 20, y: 15, width: 60, height: 20 },
          { id: "sb2", label: "MRP & Date", status: "valid", x: 20, y: 65, width: 50, height: 20 }
        ]
      }
    ]),
    declarations: JSON.stringify([
      { key: "productName", label: "Product Name", value: "Amul Pasteurised Butter", status: "valid", rule: "LM-001" },
      { key: "manufacturer", label: "Manufacturer Details", value: "GCMMF Ltd.", status: "valid", rule: "LM-002" },
      { key: "netQuantity", label: "Net Quantity", value: "500 g", status: "valid", rule: "LM-003" },
      { key: "mrp", label: "MRP Declaration", value: "₹275.00", status: "valid", rule: "LM-004" },
      { key: "dateOfPacking", label: "Date of Packing", value: "10-08-2026", status: "valid", rule: "LM-005" },
      { key: "consumerCare", label: "Consumer Care", value: "1800-258-3333", status: "valid", rule: "LM-006" }
    ]),
    violations: JSON.stringify([]),
    adminRemarks: "All mandatory Legal Metrology 2011 declarations verified as fully compliant.",
    auditTimeline: JSON.stringify([
      { title: "Inspection Submitted", date: "01 Sep 2026 — 03:20 PM", actor: "Rahul Mehta" },
      { title: "Review Completed", date: "01 Sep 2026 — 04:30 PM", actor: "Priya Sharma" },
      { title: "Compliance Certificate Issued", date: "01 Sep 2026 — 04:31 PM", actor: "System" }
    ])
  },
  {
    id: "INS-2026-00122",
    productName: "Fortune Sunlite Refined Sunflower Oil",
    brand: "Fortune",
    category: "Edible Oil",
    manufacturer: "Adani Wilmar Limited",
    manufacturerAddress: "Ahmedabad, Gujarat - 380009",
    netQuantity: "1 Litre",
    mrp: "₹175.00",
    dateOfPacking: "22-08-2026",
    consumerCare: "Email: customercare@adaniwilmar.in",
    countryOfOrigin: "India",
    fssaiLicense: "10013021000890",
    submittedBy: "Rahul Mehta",
    submittedByBadge: "EO-8842-DL",
    submittedAt: "01 Sep 2026 — 01:10 PM",
    status: "needs_correction",
    score: 64,
    priority: "High",
    verifiedBy: "Priya Sharma",
    verifiedAt: "01 Sep 2026 — 02:15 PM",
    images: JSON.stringify([
      {
        id: "img-oil-1",
        label: "Pouch Front",
        url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800",
        quality: "Needs Review",
        resolution: "1024x768",
        size: "1.2 MB",
        boundingBoxes: []
      }
    ]),
    declarations: JSON.stringify([
      { key: "productName", label: "Product Name", value: "Fortune Refined Sunflower Oil", status: "valid", rule: "LM-001" },
      { key: "netQuantity", label: "Net Quantity", value: "1 Litre", status: "valid", rule: "LM-003" },
      { key: "mrp", label: "MRP Declaration", value: "₹175.00", status: "valid", rule: "LM-004" },
      { key: "consumerCare", label: "Consumer Care", value: "Helpline telephone missing", status: "invalid", rule: "LM-006" }
    ]),
    violations: JSON.stringify([
      {
        id: "VIO-122-1",
        ruleId: "LM-006",
        title: "Consumer Helpline Phone Number missing from pouch label",
        severity: "High",
        evidenceImage: "Pouch Front",
        status: "Confirmed",
        remarks: "Rule 6(2) requires both telephone number and email address for consumer complaints."
      }
    ]),
    adminRemarks: "Please upload the secondary carton label showing complete consumer helpline telephone number.",
    auditTimeline: JSON.stringify([
      { title: "Inspection Submitted", date: "01 Sep 2026 — 01:10 PM", actor: "Rahul Mehta" },
      { title: "Correction Requested", date: "01 Sep 2026 — 02:15 PM", actor: "Priya Sharma" }
    ])
  },
  {
    id: "INS-2026-00123",
    productName: "Aashirvaad Whole Wheat Atta",
    brand: "Aashirvaad",
    category: "Food Grain",
    manufacturer: "ITC Limited",
    manufacturerAddress: "37, J.L. Nehru Road, Kolkata - 700071",
    netQuantity: "10 kg",
    mrp: "₹465.00",
    dateOfPacking: "18-08-2026",
    consumerCare: "1800-425-4444",
    countryOfOrigin: "India",
    fssaiLicense: "10012031000012",
    submittedBy: "Rahul Mehta",
    submittedByBadge: "EO-8842-DL",
    submittedAt: "31 Aug 2026 — 11:00 AM",
    status: "non_compliant",
    score: 48,
    priority: "High",
    verifiedBy: "Priya Sharma",
    verifiedAt: "31 Aug 2026 — 03:45 PM",
    images: JSON.stringify([
      {
        id: "img-atta-1",
        label: "Bag Rear Seal",
        url: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800",
        quality: "Good",
        resolution: "1920x1080",
        size: "2.2 MB",
        boundingBoxes: []
      }
    ]),
    declarations: JSON.stringify([
      { key: "productName", label: "Product Name", value: "Aashirvaad Whole Wheat Atta", status: "valid", rule: "LM-001" },
      { key: "mrp", label: "MRP Declaration", value: "465.00 (Missing ₹ & Taxes suffix)", status: "invalid", rule: "LM-004" },
      { key: "dateOfPacking", label: "Date of Packaging", value: "Missing", status: "missing", rule: "LM-005" },
      { key: "unitSalePrice", label: "Unit Sale Price", value: "Missing", status: "missing", rule: "LM-008" }
    ]),
    violations: JSON.stringify([
      {
        id: "VIO-123-1",
        ruleId: "LM-004",
        title: "MRP format non-compliant",
        severity: "High",
        evidenceImage: "Bag Rear Seal",
        status: "Confirmed",
        remarks: "MRP listed as plain number without ₹ symbol and 'Incl. of all taxes'."
      },
      {
        id: "VIO-123-2",
        ruleId: "LM-005",
        title: "Date of Packaging missing",
        severity: "High",
        evidenceImage: "Bag Rear Seal",
        status: "Confirmed",
        remarks: "No manufacturing date declared on outer bag."
      }
    ]),
    adminRemarks: "Package rejected due to multiple mandatory declaration omissions under LM Rule 6(1). Notice issued.",
    auditTimeline: JSON.stringify([
      { title: "Inspection Submitted", date: "31 Aug 2026 — 11:00 AM", actor: "Rahul Mehta" },
      { title: "Rejected by Officer", date: "31 Aug 2026 — 03:45 PM", actor: "Priya Sharma" }
    ])
  }
];

const SEED_NOTIFICATIONS = [
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
  },
  {
    id: "NOTIF-2026-003",
    title: "Inspection INS-2026-00120 Approved",
    message: "Product 'Amul Pasteurised Butter' was marked COMPLIANT with 96% score.",
    timestamp: "01 Sep 2026 — 04:30 PM",
    read: 1,
    type: "success",
    role: "user",
    inspectionId: "INS-2026-00120"
  },
  {
    id: "NOTIF-2026-004",
    title: "Correction Requested for INS-2026-00122",
    message: "Admin requested clearer rear label for Fortune Sunlite Refined Sunflower Oil.",
    timestamp: "01 Sep 2026 — 02:15 PM",
    read: 0,
    type: "warning",
    role: "user",
    inspectionId: "INS-2026-00122"
  }
];

async function seedDatabase() {
  db.serialize(async () => {
    // 1. Seed Users with bcrypt hashed passwords
    db.get("SELECT COUNT(*) as count FROM users", [], async (err, row) => {
      if (!err && (row.count === 0 || !row)) {
        console.log("Seeding Users with bcrypt hashed passwords...");
        const stmt = db.prepare(`INSERT INTO users (id, name, role, roleKey, department, badgeNumber, email, phone, avatar, password, lastLogin, location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`);
        for (const u of RAW_USERS) {
          const hashedPassword = bcrypt.hashSync(u.rawPassword, SALT_ROUNDS);
          stmt.run(u.id, u.name, u.role, u.roleKey, u.department, u.badgeNumber, u.email, u.phone, u.avatar, hashedPassword, u.lastLogin, u.location);
        }
        stmt.finalize();
      } else {
        // Upgrade existing plaintext passwords to bcrypt
        db.all("SELECT id, password FROM users", [], (err2, rows) => {
          if (!err2 && rows) {
            for (const r of rows) {
              if (!r.password.startsWith('$2a$') && !r.password.startsWith('$2b$')) {
                const hashed = bcrypt.hashSync(r.password, SALT_ROUNDS);
                db.run("UPDATE users SET password = ? WHERE id = ?", [hashed, r.id]);
              }
            }
          }
        });
      }
    });

    // 2. Seed Rules
    db.get("SELECT COUNT(*) as count FROM rules", [], (err, row) => {
      if (!err && (row.count === 0 || !row)) {
        console.log("Seeding Legal Metrology Rules...");
        const stmt = db.prepare(`INSERT INTO rules (id, ruleNumber, declaration, legalReference, description, severity, status) VALUES (?,?,?,?,?,?,?)`);
        for (const r of SEED_RULES) {
          stmt.run(r.id, r.ruleNumber, r.declaration, r.legalReference, r.description, r.severity, r.status);
        }
        stmt.finalize();
      }
    });

    // 3. Seed Inspections
    db.get("SELECT COUNT(*) as count FROM inspections", [], (err, row) => {
      if (!err && (row.count === 0 || !row)) {
        console.log("Seeding Inspections...");
        const stmt = db.prepare(`INSERT INTO inspections (
          id, productName, brand, category, manufacturer, manufacturerAddress, netQuantity, mrp,
          dateOfPacking, consumerCare, countryOfOrigin, fssaiLicense, submittedBy, submittedByBadge,
          submittedAt, status, score, priority, verifiedBy, verifiedAt, images, declarations,
          violations, adminRemarks, auditTimeline
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);

        for (const i of SEED_INSPECTIONS) {
          stmt.run(
            i.id, i.productName, i.brand, i.category, i.manufacturer, i.manufacturerAddress, i.netQuantity, i.mrp,
            i.dateOfPacking, i.consumerCare, i.countryOfOrigin, i.fssaiLicense, i.submittedBy, i.submittedByBadge,
            i.submittedAt, i.status, i.score, i.priority, i.verifiedBy, i.verifiedAt, i.images, i.declarations,
            i.violations, i.adminRemarks, i.auditTimeline
          );
        }
        stmt.finalize();
      }
    });

    // 4. Seed Notifications
    db.get("SELECT COUNT(*) as count FROM notifications", [], (err, row) => {
      if (!err && (row.count === 0 || !row)) {
        console.log("Seeding Notifications...");
        const stmt = db.prepare(`INSERT INTO notifications (id, title, message, timestamp, read, type, role, inspectionId) VALUES (?,?,?,?,?,?,?,?)`);
        for (const n of SEED_NOTIFICATIONS) {
          stmt.run(n.id, n.title, n.message, n.timestamp, n.read, n.type, n.role, n.inspectionId);
        }
        stmt.finalize();
      }
    });
  });
}

seedDatabase();
module.exports = { seedDatabase };
