const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const dashboardService = {
  // Fetch real-time dynamic dashboard statistics from SQLite backend
  getDashboardStats: async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard/stats`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Failed to fetch dashboard stats');
      return await res.json();
    } catch (e) {
      console.error('dashboardService.getDashboardStats error:', e);
      return {
        userStats: { total: 0, approved: 0, underReview: 0, rejected: 0 },
        adminStats: { total: 0, pendingReview: 0, verified: 0, rejected: 0, needsCorrection: 0 },
        charts: {
          complianceDistribution: [],
          violationsByCategory: [],
          monthlyTrends: [],
          categoryBreakdown: []
        }
      };
    }
  }
};
