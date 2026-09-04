const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const inspectionService = {
  // GET /api/inspections
  getInspections: async () => {
    try {
      const res = await fetch(`${API_URL}/inspections`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) throw new Error('Failed to fetch inspections');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.getInspections error:', e);
      return [];
    }
  },

  // GET /api/inspections/:id
  getInspectionById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/inspections/${id}`, { signal: AbortSignal.timeout(6000) });
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch inspection');
      }
      return await res.json();
    } catch (e) {
      console.error('inspectionService.getInspectionById error:', e);
      return null;
    }
  },

  // POST /api/inspections
  createInspection: async (payload) => {
    try {
      const res = await fetch(`${API_URL}/inspections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error('Failed to create inspection');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.createInspection error:', e);
      throw e;
    }
  },

  // PUT /api/inspections/:id/review
  reviewInspection: async (id, reviewData) => {
    try {
      const res = await fetch(`${API_URL}/inspections/${id}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error('Failed to review inspection');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.reviewInspection error:', e);
      throw e;
    }
  },

  // GET /api/notifications?role=...
  getNotifications: async (roleKey = 'all') => {
    try {
      const res = await fetch(`${API_URL}/notifications?role=${roleKey}`, {
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return await res.json();
    } catch (e) {
      console.error('inspectionService.getNotifications error:', e);
      return [];
    }
  },

  // PUT /api/notifications/:id/read
  markNotificationRead: async (id) => {
    try {
      const res = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        signal: AbortSignal.timeout(6000),
      });
      if (!res.ok) throw new Error('Failed to mark notification read');
      return inspectionService.getNotifications();
    } catch (e) {
      console.error('inspectionService.markNotificationRead error:', e);
      return [];
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
