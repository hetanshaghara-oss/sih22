import { INITIAL_INSPECTIONS } from '../data/inspections';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';
import { LEGAL_METROLOGY_RULES } from '../data/rules';

const STORAGE_KEY = 'smartmetrix_inspections_db';
const NOTIF_KEY = 'smartmetrix_notifications_db';

// Helper to seed localStorage
const getStoredInspections = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse inspections storage:', e);
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INSPECTIONS));
  return INITIAL_INSPECTIONS;
};

const saveStoredInspections = (inspections) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inspections));
};

const getStoredNotifications = () => {
  const data = localStorage.getItem(NOTIF_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse notifications storage:', e);
    }
  }
  localStorage.setItem(NOTIF_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
  return INITIAL_NOTIFICATIONS;
};

const saveStoredNotifications = (notifications) => {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifications));
};

export const inspectionService = {
  // FUTURE API:
  // Replace with GET /api/inspections?page=1&limit=20&status=...
  getInspections: async () => {
    return getStoredInspections();
  },

  // FUTURE API:
  // Replace with GET /api/inspections/:id
  getInspectionById: async (id) => {
    const inspections = getStoredInspections();
    return inspections.find((item) => item.id === id) || null;
  },

  // FUTURE API:
  // Replace with POST /api/inspections (Multipart Form Data with uploaded packaging images)
  // FUTURE OCR & AI:
  // Extracted declarations and bounding boxes will be returned by backend AI model pipeline
  createInspection: async (inspectionPayload) => {
    const inspections = getStoredInspections();
    const count = inspections.length + 125;
    const newId = `INS-2026-${String(count).padStart(5, '0')}`;

    const declarations = [
      { key: "productName", label: "Product Name / Generic Identity", value: inspectionPayload.productName || "Demo Commodity", status: inspectionPayload.productName ? "valid" : "needs_review", rule: "LM-001" },
      { key: "manufacturer", label: "Manufacturer Details", value: inspectionPayload.manufacturer || "Demo Mfg Pvt Ltd", status: inspectionPayload.manufacturer ? "valid" : "needs_review", rule: "LM-002" },
      { key: "netQuantity", label: "Net Quantity Statement", value: inspectionPayload.netQuantity || "1 kg", status: inspectionPayload.netQuantity ? "valid" : "invalid", rule: "LM-003" },
      { key: "mrp", label: "MRP Declaration", value: inspectionPayload.mrp || "₹199.00", status: inspectionPayload.mrp ? "valid" : "invalid", rule: "LM-004" },
      { key: "dateOfPacking", label: "Manufacturing / Packing Date", value: inspectionPayload.dateOfPacking || "01-09-2026", status: inspectionPayload.dateOfPacking ? "valid" : "invalid", rule: "LM-005" },
      { key: "consumerCare", label: "Consumer Care Details", value: inspectionPayload.consumerCare || "1800-111-2222", status: inspectionPayload.consumerCare ? "valid" : "needs_review", rule: "LM-006" },
      { key: "countryOfOrigin", label: "Country of Origin", value: inspectionPayload.countryOfOrigin || "India", status: inspectionPayload.countryOfOrigin ? "valid" : "valid", rule: "LM-007" }
    ];

    const validCount = declarations.filter((d) => d.status === "valid").length;
    const computedScore = Math.round((validCount / declarations.length) * 100);

    const violations = [];
    if (!inspectionPayload.consumerCare || inspectionPayload.consumerCare.includes("Helpline: 1800-111-2222")) {
      violations.push({
        id: `VIO-${newId}-1`,
        ruleId: "LM-006",
        title: "Consumer Helpline font size compliance requires review",
        severity: "Medium",
        evidenceImage: "Front Packaging Label",
        status: "Pending Review",
        remarks: "Verification officer to verify telephone font height meets minimum 1.5mm threshold."
      });
    }

    const processedImages = (inspectionPayload.images && inspectionPayload.images.length > 0)
      ? inspectionPayload.images.map((img, idx) => ({
          id: `img-user-${idx + 1}`,
          label: img.label || (idx === 0 ? "Front Packaging Label" : "Rear Declaration Panel"),
          url: img.url || inspectionPayload.previewUrl,
          quality: img.quality || "Good",
          resolution: img.resolution || "1920x1080",
          size: img.size || "2.1 MB",
          boundingBoxes: img.boundingBoxes || [
            { id: `b-${idx}-1`, label: "Product Name", status: "valid", x: 12, y: 12, width: 76, height: 18 },
            { id: `b-${idx}-2`, label: "Net Quantity", status: "valid", x: 20, y: 35, width: 60, height: 14 },
            { id: `b-${idx}-3`, label: "MRP Declaration", status: "valid", x: 25, y: 52, width: 50, height: 14 },
            { id: `b-${idx}-4`, label: "Manufacturing Date", status: "valid", x: 20, y: 68, width: 60, height: 14 }
          ]
        }))
      : [
          {
            id: "img-user-1",
            label: "Front Packaging Label",
            url: inspectionPayload.previewUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
            quality: "Good",
            resolution: "1920x1080",
            size: "2.1 MB",
            boundingBoxes: [
              { id: "b-new-1", label: "Product Name", status: "valid", x: 12, y: 12, width: 76, height: 18 },
              { id: "b-new-2", label: "Net Quantity", status: "valid", x: 20, y: 35, width: 60, height: 14 },
              { id: "b-new-3", label: "MRP Declaration", status: "valid", x: 25, y: 52, width: 50, height: 14 }
            ]
          }
        ];

    const newRecord = {
      id: newId,
      productName: inspectionPayload.productName || "Scanned Packaged Commodity",
      brand: inspectionPayload.brand || "Sample Brand",
      category: inspectionPayload.category || "Food Grain",
      manufacturer: inspectionPayload.manufacturer || "Demo Manufacturing Works Pvt. Ltd.",
      manufacturerAddress: inspectionPayload.manufacturerAddress || "123 Industrial Estate, Phase 1, New Delhi - 110020",
      netQuantity: inspectionPayload.netQuantity || "1 kg",
      mrp: inspectionPayload.mrp || "₹199.00",
      dateOfPacking: inspectionPayload.dateOfPacking || "01-09-2026",
      consumerCare: inspectionPayload.consumerCare || "Email: care@demomanufacturer.demo | Tel: 1800-111-2222",
      countryOfOrigin: inspectionPayload.countryOfOrigin || "India",
      fssaiLicense: inspectionPayload.fssaiLicense || "10020000001111",
      submittedBy: inspectionPayload.submittedBy || "Rahul Mehta",
      submittedByBadge: "EO-8842-DL",
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "under_review",
      score: computedScore,
      priority: inspectionPayload.priority || "Normal",
      verifiedBy: null,
      verifiedAt: null,
      images: processedImages,
      declarations: declarations,
      violations: violations,
      adminRemarks: "",
      auditTimeline: [
        {
          title: "Inspection Submitted",
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          actor: `${inspectionPayload.submittedBy || "Rahul Mehta"} (Enforcement Officer)`
        },
        {
          title: "Image Quality & Region Detection Checked",
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          actor: "SmartMetriX Automated Engine"
        }
      ]
    };

    inspections.unshift(newRecord);
    saveStoredInspections(inspections);

    // Notify Admin
    const notifications = getStoredNotifications();
    notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: `New Inspection ${newId} Submitted`,
      message: `Product '${newRecord.productName}' uploaded by ${newRecord.submittedBy} is awaiting review.`,
      timestamp: "Just now",
      read: false,
      type: "info",
      role: "admin",
      inspectionId: newId
    });
    saveStoredNotifications(notifications);

    return newRecord;
  },

  // FUTURE API:
  // Replace with POST /api/inspections/:id/review
  reviewInspection: async (id, reviewData) => {
    const inspections = getStoredInspections();
    const index = inspections.findIndex((item) => item.id === id);
    if (index === -1) throw new Error("Inspection not found");

    const target = inspections[index];
    const timestamp = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' — ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    // Calculate score based on updated declarations
    const declarations = reviewData.declarations || target.declarations;
    const validCount = declarations.filter((d) => d.status === "valid").length;
    const totalCount = declarations.length;
    const computedScore = Math.round((validCount / totalCount) * 100);

    const updated = {
      ...target,
      status: reviewData.status || target.status,
      score: computedScore,
      declarations: declarations,
      violations: reviewData.violations || target.violations,
      adminRemarks: reviewData.adminRemarks ?? target.adminRemarks,
      verifiedBy: reviewData.verifiedBy || "Priya Sharma (Verification Officer)",
      verifiedAt: timestamp,
      auditTimeline: [
        ...target.auditTimeline,
        {
          title: `Inspection Marked: ${reviewData.status.toUpperCase().replace('_', ' ')}`,
          date: timestamp,
          actor: reviewData.verifiedBy || "Priya Sharma (Verification Officer)"
        }
      ]
    };

    inspections[index] = updated;
    saveStoredInspections(inspections);

    // Notify User
    const notifications = getStoredNotifications();
    notifications.unshift({
      id: `NOTIF-${Date.now()}`,
      title: `Inspection ${id} Review Completed`,
      message: `Officer ${updated.verifiedBy} set status to ${updated.status.toUpperCase().replace('_', ' ')} with score ${computedScore}%.`,
      timestamp: "Just now",
      read: false,
      type: updated.status === "compliant" ? "success" : updated.status === "non_compliant" ? "error" : "warning",
      role: "user",
      inspectionId: id
    });
    saveStoredNotifications(notifications);

    return updated;
  },

  getNotifications: async (roleKey = 'all') => {
    const notifs = getStoredNotifications();
    if (roleKey === 'all') return notifs;
    return notifs.filter((n) => n.role === 'all' || n.role === roleKey);
  },

  markNotificationRead: async (id) => {
    const notifs = getStoredNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    saveStoredNotifications(updated);
    return updated;
  }
};
