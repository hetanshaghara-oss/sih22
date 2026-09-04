import { inspectionService } from './inspectionService';

export const dashboardService = {
  // FUTURE API:
  // Replace with GET /api/dashboard/stats
  getDashboardStats: async () => {
    const inspections = await inspectionService.getInspections();

    const total = inspections.length;
    const compliant = inspections.filter((i) => i.status === 'compliant').length;
    const underReview = inspections.filter((i) => i.status === 'under_review').length;
    const nonCompliant = inspections.filter((i) => i.status === 'non_compliant').length;
    const partiallyCompliant = inspections.filter((i) => i.status === 'partially_compliant').length;
    const needsCorrection = inspections.filter((i) => i.status === 'needs_correction').length;

    // Charts Data
    const complianceDistribution = [
      { name: 'Compliant', value: compliant, color: '#2c6837' },
      { name: 'Partially Compliant', value: partiallyCompliant, color: '#855c18' },
      { name: 'Under Review', value: underReview, color: '#14705c' },
      { name: 'Non-Compliant', value: nonCompliant, color: '#833225' },
      { name: 'Needs Correction', value: needsCorrection, color: '#573471' }
    ];

    const violationsByCategory = [
      { category: 'Manufacturing Date (Rule 6d)', count: 4, severity: 'High' },
      { category: 'Consumer Care Helpline (Rule 6-2)', count: 3, severity: 'Medium' },
      { category: 'MRP Rupee Symbol (Rule 6e)', count: 2, severity: 'High' },
      { category: 'Unit Sale Price (Rule 6h)', count: 2, severity: 'Low' },
      { category: 'Net Quantity Format (Rule 6c)', count: 1, severity: 'High' }
    ];

    const monthlyTrends = [
      { month: 'Apr', Total: 180, Verified: 140, Violations: 40 },
      { month: 'May', Total: 210, Verified: 175, Violations: 35 },
      { month: 'Jun', Total: 260, Verified: 210, Violations: 50 },
      { month: 'Jul', Total: 290, Verified: 235, Violations: 55 },
      { month: 'Aug', Total: 310, Verified: 250, Violations: 60 },
      { month: 'Sep', Total: total + 1240, Verified: 812, Violations: 231 }
    ];

    const categoryBreakdown = [
      { category: 'Food Grain', count: 420 },
      { category: 'Edible Oil', count: 290 },
      { category: 'Packaged Snacks', count: 230 },
      { category: 'Personal Care', count: 180 },
      { category: 'Beverages', count: 128 }
    ];

    return {
      userStats: {
        total: total,
        approved: compliant,
        underReview: underReview + partiallyCompliant,
        rejected: nonCompliant + needsCorrection
      },
      adminStats: {
        total: 1248 + total,
        pendingReview: 86 + underReview,
        verified: 812 + compliant,
        rejected: 231 + nonCompliant,
        needsCorrection: 119 + needsCorrection
      },
      charts: {
        complianceDistribution,
        violationsByCategory,
        monthlyTrends,
        categoryBreakdown
      }
    };
  }
};
