const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const rulesService = {
  // Fetch all statutory rules from SQLite
  getRules: async () => {
    try {
      const res = await fetch(`${API_URL}/rules`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Failed to fetch rules');
      return await res.json();
    } catch (e) {
      console.error('rulesService.getRules error:', e);
      return [];
    }
  },

  // Fetch single rule from SQLite
  getRuleById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/rules/${id}`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Failed to fetch rule');
      return await res.json();
    } catch (e) {
      console.error('rulesService.getRuleById error:', e);
      return null;
    }
  }
};
