import { INITIAL_INSPECTIONS } from '../data/inspections';
import { INITIAL_NOTIFICATIONS } from '../data/notifications';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const LOCAL_INSPECTIONS_KEY = 'smartmetrix_local_inspections';
const LOCAL_NOTIFS_KEY = 'smartmetrix_local_notifications';

const getStoredInspections = () => {
  try {
    const saved = localStorage.getItem(LOCAL_INSPECTIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading local inspections:', e);
  }
  return INITIAL_INSPECTIONS;
};

const saveStoredInspections = (list) => {
  try {
    localStorage.setItem(LOCAL_INSPECTIONS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Error saving local inspections:', e);
  }
};

const getStoredNotifs = () => {
  try {
    const saved = localStorage.getItem(LOCAL_NOTIFS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error reading local notifs:', e);
  }
  return INITIAL_NOTIFICATIONS;
};

export const inspectionService = {
  // GET /api/inspections
  getInspections: async () => {
    try {
      const res = await fetch(`${API_URL}/inspections`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) throw new Error('Failed to fetch inspections');
      const data = await res.json();
      saveStoredInspections(data);
      return data;
    } catch (e) {
      console.warn('Backend inspections unreachable. Returning local inspection ledger:', e);
      return getStoredInspections();
    }
  },

  // GET /api/inspections/:id
  getInspectionById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/inspections/${id}`, { signal: AbortSignal.timeout(3000) });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch inspection');
      }
      return await res.json();
    } catch (e) {
      console.warn(`Backend inspection ${id} unreachable. Searching local inspection store:`, e);
      const list = getStoredInspections();
      return list.find((item) => item.id === id) || null;
    }
  },

  // POST /api/inspections
  createInspection: async (payload) => {
    try {
      const res = await fetch(`${API_URL}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error('Failed to create inspection');
      return await res.json();
    } catch (e) {
      console.warn('Backend inspection creation offline. Saving to local ledger:', e);
      const list = getStoredInspections();
      const newId = payload.id || `INS-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newInspection = {
        ...payload,
        id: newId,
        score: payload.score || 85,
        status: payload.status || 'under_review',
        submittedAt: payload.submittedAt || new Date().toLocaleString(),
        images: payload.images || []
      };
      const updated = [newInspection, ...list];
      saveStoredInspections(updated);
      return { success: true, id: newId, inspection: newInspection };
    }
  },

  // PUT /api/inspections/:id/review
  reviewInspection: async (id, reviewData) => {
    try {
      const res = await fetch(`${API_URL}/inspections/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) throw new Error('Failed to review inspection');
      return await res.json();
    } catch (e) {
      console.warn(`Backend review ${id} offline. Updating local inspection:`, e);
      const list = getStoredInspections();
      const updated = list.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: reviewData.status || item.status,
            score: reviewData.score !== undefined ? reviewData.score : item.score,
            adminRemarks: reviewData.adminRemarks || item.adminRemarks,
            verifiedBy: reviewData.verifiedBy || 'Priya Sharma',
            verifiedAt: new Date().toLocaleString()
          };
        }
        return item;
      });
      saveStoredInspections(updated);
      return { success: true, id };
    }
  },

  // GET /api/notifications?role=...
  getNotifications: async (roleKey = 'all') => {
    try {
      const res = await fetch(`${API_URL}/notifications?role=${roleKey}`, {
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    } catch (e) {
      console.warn('Backend notifications offline. Returning local alerts:', e);
      const list = getStoredNotifs();
      if (roleKey === 'all') return list;
      return list.filter((n) => n.role === 'all' || n.role === roleKey);
    }
  },

  // PUT /api/notifications/:id/read
  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) throw new Error('Failed to mark notification read');
      return await res.json();
    } catch (e) {
      const list = getStoredNotifs();
      const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));
      try {
        localStorage.setItem(LOCAL_NOTIFS_KEY, JSON.stringify(updated));
      } catch (err) {}
      return updated;
    }
  },

  // POST /api/analyze-image
  analyzeImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_URL}/analyze-image`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error('Failed to analyze image with OCR');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.analyzeImage OCR error:', e);
      throw e;
    }
  },

  // POST /api/upload
  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) throw new Error('Failed to upload image files');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.uploadImages error:', e);
      throw e;
    }
  },
};
