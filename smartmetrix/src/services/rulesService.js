import { LEGAL_METROLOGY_RULES } from '../data/rules';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const rulesService = {
  // Fetch all statutory rules from SQLite (with local fallback)
  getRules: async () => {
    try {
      const res = await fetch(`${API_URL}/rules`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch rules');
      return await res.json();
    } catch (e) {
      console.warn('Backend rules offline. Returning statutory rules registry:', e);
      return LEGAL_METROLOGY_RULES;
    }
  },

  // Fetch single rule from SQLite
  getRuleById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/rules/${id}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch rule');
      return await res.json();
    } catch (e) {
      console.warn(`Backend rule ${id} offline. Searching statutory registry:`, e);
      return LEGAL_METROLOGY_RULES.find(r => r.id === id || r.ruleNumber === id) || null;
    }
  }
};
