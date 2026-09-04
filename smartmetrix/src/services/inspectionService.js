const API_URL = 'http://localhost:5000/api';

export const inspectionService = {
  getInspections: async () => {
    try {
      const response = await fetch(`${API_URL}/inspections`);
      if (!response.ok) throw new Error('Failed to fetch inspections');
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getInspectionById: async (id) => {
    try {
      const response = await fetch(`${API_URL}/inspections/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error('Failed to fetch inspection');
      }
      return await response.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  },

  createInspection: async (inspectionPayload) => {
    try {
      const response = await fetch(`${API_URL}/inspections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inspectionPayload)
      });
      if (!response.ok) throw new Error('Failed to create inspection');
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  reviewInspection: async (id, reviewData) => {
    try {
      const response = await fetch(`${API_URL}/inspections/${id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      });
      if (!response.ok) throw new Error('Failed to review inspection');
      return await response.json();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  getNotifications: async (roleKey = 'all') => {
    try {
      const response = await fetch(`${API_URL}/notifications?role=${roleKey}`);
      if (!response.ok) throw new Error('Failed to fetch notifications');
      return await response.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  markNotificationRead: async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Failed to mark notification read');
      
      // Return updated notifications for the UI context
      return inspectionService.getNotifications();
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  analyzeImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`${API_URL}/analyze-image`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to analyze image');
      return await response.json();
    } catch (e) {
      console.error('OCR Error:', e);
      throw e;
    }
  },

  uploadImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('Failed to upload images');
      return await response.json();
    } catch (e) {
      console.error('Upload Error:', e);
      throw e;
    }
  }
};
