export const STATUS_CONFIG = {
  compliant: {
    label: "COMPLIANT",
    bgClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    badgeColor: "emerald",
    icon: "CheckCircle2"
  },
  partially_compliant: {
    label: "PARTIALLY COMPLIANT",
    bgClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    badgeColor: "amber",
    icon: "AlertTriangle"
  },
  non_compliant: {
    label: "NON-COMPLIANT",
    bgClass: "bg-rose-50 text-rose-700 border-rose-200",
    dotClass: "bg-rose-500",
    badgeColor: "rose",
    icon: "XCircle"
  },
  under_review: {
    label: "UNDER REVIEW",
    bgClass: "bg-blue-50 text-blue-700 border-blue-200",
    dotClass: "bg-blue-500",
    badgeColor: "blue",
    icon: "Clock"
  },
  needs_correction: {
    label: "NEEDS CORRECTION",
    bgClass: "bg-purple-50 text-purple-700 border-purple-200",
    dotClass: "bg-purple-500",
    badgeColor: "purple",
    icon: "RefreshCw"
  }
};

export const getStatusConfig = (statusKey) => {
  const normalized = String(statusKey || 'under_review').toLowerCase();
  return STATUS_CONFIG[normalized] || STATUS_CONFIG.under_review;
};

export const getScoreCategory = (score) => {
  if (score >= 90) return { label: "COMPLIANT", color: "emerald" };
  if (score >= 60) return { label: "PARTIALLY COMPLIANT", color: "amber" };
  return { label: "NON-COMPLIANT", color: "rose" };
};
