const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const CURRENT_USER_KEY = 'smartmetrix_current_user';
const TOKEN_KEY = 'smartmetrix_auth_token';

export const authService = {
  // Login with backend API
  login: async (roleKey = 'user', rememberMe = true, email = '', password = '') => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey, email, password })
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
      console.error('authService.login error:', e);
      const existing = authService.getCurrentUser();
      return { success: !!existing, user: existing };
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

  // Fetch all registered enforcement officers from real DB
  getUsers: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/users`);
      if (!res.ok) throw new Error('Failed to fetch users');
      return await res.json();
    } catch (e) {
      console.error('authService.getUsers error:', e);
      return [];
    }
  },

  // Switch officer role via backend
  switchRole: async (roleKey, rememberMe = true) => {
    try {
      const res = await fetch(`${API_URL}/auth/switch-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleKey })
      });

      if (!res.ok) throw new Error('Failed to switch role');
      const data = await res.json();

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
      return data.user;
    } catch (e) {
      console.error('authService.switchRole error:', e);
      return null;
    }
  }
};
