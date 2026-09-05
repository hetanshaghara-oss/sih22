export const INITIAL_NOTIFICATIONS = [
  {
    id: "NOTIF-001",
    title: "Inspection INS-2026-00124 Submitted",
    message: "Inspection for 'Sunrise Premium Basmati Rice' has been submitted to Legal Metrology Cell.",
    timestamp: "2026-09-02 10:15 AM",
    read: false,
    type: "info",
    role: "all",
    inspectionId: "INS-2026-00124"
  },
  {
    id: "NOTIF-002",
    title: "Review Required",
    message: "New high-priority inspection INS-2026-00124 requires administrative review.",
    timestamp: "2026-09-02 10:16 AM",
    read: false,
    type: "warning",
    role: "admin",
    inspectionId: "INS-2026-00124"
  },
  {
    id: "NOTIF-003",
    title: "Inspection INS-2026-00120 Approved",
    message: "PureCare Bath Soap was marked COMPLIANT with 96% score.",
    timestamp: "2026-09-01 04:30 PM",
    read: true,
    type: "success",
    role: "user",
    inspectionId: "INS-2026-00120"
  },
  {
    id: "NOTIF-004",
    title: "Correction Requested",
    message: "Admin requested clearer rear label for FreshDrop Refined Sunflower Oil.",
    timestamp: "2026-09-01 02:15 PM",
    read: true,
    type: "error",
    role: "user",
    inspectionId: "INS-2026-00122"
  }
];
