export const COMMON_VIOLATIONS = [
  {
    id: "VIO-101",
    ruleId: "LM-005",
    title: "Manufacturing date declaration unreadable or missing",
    description: "The month and year of packaging could not be verified from the submitted back label image due to low contrast or missing stamp.",
    severity: "High",
    defaultStatus: "Pending Review",
    recommendedAction: "Request clear close-up image of the batch code / packing date stamp from manufacturer or submitter."
  },
  {
    id: "VIO-102",
    ruleId: "LM-006",
    title: "Consumer care details incomplete or blurry",
    description: "Customer helpline phone number or email address is partially cut off at the package seam.",
    severity: "Medium",
    defaultStatus: "Pending Review",
    recommendedAction: "Verify if complaint address is complete on secondary outer box label."
  },
  {
    id: "VIO-103",
    ruleId: "LM-004",
    title: "MRP format non-compliant with Indian Rupee symbol",
    description: "MRP listed without mandatory 'Incl. of all taxes' suffix or standard ₹ currency symbol.",
    severity: "High",
    defaultStatus: "Confirmed",
    recommendedAction: "Issue non-compliance warning notice to registered packer."
  },
  {
    id: "VIO-104",
    ruleId: "LM-008",
    title: "Unit Sale Price declaration omitted",
    description: "Multi-pack commodity lacks mandatory Unit Sale Price declaration (e.g. ₹/100g).",
    severity: "Low",
    defaultStatus: "Confirmed",
    recommendedAction: "Flag for correction on next packaging iteration."
  }
];
