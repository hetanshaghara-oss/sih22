import { DEMO_USERS } from '../data/users';

const CURRENT_USER_KEY = 'smartmetrix_current_user';

export const authService = {
  // FUTURE API:
  // Replace mock login with POST /api/auth/login returning JWT token & user payload
  login: async (roleKey = 'user') => {
    const user = DEMO_USERS[roleKey] || DEMO_USERS.user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  },

  // FUTURE API:
  // Replace mock logout with POST /api/auth/logout clearing authorization cookies
  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  },

  // Get logged-in user from localStorage, defaulting to User (Rahul Mehta)
  getCurrentUser: () => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    // Default to User role
    return DEMO_USERS.user;
  },

  // Switch role explicitly
  switchRole: (roleKey) => {
    const user = DEMO_USERS[roleKey] || DEMO_USERS.user;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
};
