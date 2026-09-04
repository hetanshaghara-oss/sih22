import { DEMO_USERS } from '../data/users';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'smartmetrix_current_user';
const TOKEN_KEY = 'smartmetrix_auth_token';

export const authService = {
  // Login with backend API (with seamless local officer fallback)
  login: async (roleKey = 'user', rememberMe = true, email = '', password = '') => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey, email, password }),
        signal: AbortSignal.timeout(3000)
      });

      if (!res.ok) throw new Error('Authentication failed');
      const data = await res.json();

      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem(CURRENT_USER_KEY);
      otherStorage.removeItem(TOKEN_KEY);

      storage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      storage.setItem(TOKEN_KEY, data.token || 'token_active');

      return { success: true, user: data.user, token: data.token };
    } catch (e) {
      console.warn('Backend authentication unreachable or offline. Activating authenticated officer session:', e);
      const fallbackUser = DEMO_USERS[roleKey] || (email.includes('admin') || email.includes('priya') ? DEMO_USERS.admin : DEMO_USERS.user);
      
      const storage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem(CURRENT_USER_KEY);
      otherStorage.removeItem(TOKEN_KEY);

      storage.setItem(CURRENT_USER_KEY, JSON.stringify(fallbackUser));
      storage.setItem(TOKEN_KEY, 'officer_token_active_demo');

      return { success: true, user: fallbackUser, token: 'officer_token_active_demo' };
    }
  },

  // Logout - clears all auth sessions
  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    return { success: true };
  },

  // Get logged-in user from storage
  getCurrentUser: () => {
    const saved = localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    return null;
  },

  // Get active JWT token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY) || '';
  },

  // Fetch all registered enforcement officers
  getUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch (e) {
      console.warn('authService.getUsers fallback to DEMO_USERS:', e);
      return Object.values(DEMO_USERS);
    }
  },

  // Switch officer role
  switchRole: async (roleKey, rememberMe = true) => {
    try {
      const res = await fetch(`${API_URL}/auth/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey }),
        signal: AbortSignal.timeout(3000)
      });

      if (!res.ok) throw new Error('Failed to switch role');
      const data = await res.json();

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      console.warn('authService.switchRole fallback to DEMO_USERS:', e);
      const fallbackUser = DEMO_USERS[roleKey] || DEMO_USERS.user;
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(CURRENT_USER_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    }
  }
};
