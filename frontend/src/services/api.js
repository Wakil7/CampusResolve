const API_BASE = '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }
  return data;
};

const safeFetch = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (err) {
    if (
      err.message?.toLowerCase().includes('failed to fetch') ||
      err.message?.toLowerCase().includes('networkerror') ||
      err.name === 'TypeError'
    ) {
      throw new Error('Unable to connect to local server. Please ensure backend is running at http://localhost:5000');
    }
    throw err;
  }
};

export const api = {
  // Auth
  login: async (credentials) => {
    return safeFetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData) => {
    return safeFetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
  },

  getMe: async () => {
    return safeFetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
  },

  updateProfile: async (profileData) => {
    return safeFetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
  },

  // Complaints
  getComplaints: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/complaints?${queryString}`, {
      headers: getHeaders(),
    });
  },

  getPublicFeed: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/complaints/public?${queryString}`, {
      headers: getHeaders(),
    });
  },

  getComplaintById: async (id) => {
    return safeFetch(`${API_BASE}/complaints/${id}`, {
      headers: getHeaders(),
    });
  },

  createComplaint: async (formData) => {
    return safeFetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
  },

  updateStatus: async (id, statusData) => {
    return safeFetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(statusData),
    });
  },

  assignComplaint: async (id, assignData) => {
    return safeFetch(`${API_BASE}/complaints/${id}/assign`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(assignData),
    });
  },

  addComment: async (id, commentData) => {
    return safeFetch(`${API_BASE}/complaints/${id}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(commentData),
    });
  },

  submitFeedback: async (id, feedbackData) => {
    return safeFetch(`${API_BASE}/complaints/${id}/feedback`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(feedbackData),
    });
  },

  toggleUpvote: async (id) => {
    return safeFetch(`${API_BASE}/complaints/${id}/upvote`, {
      method: 'POST',
      headers: getHeaders(),
    });
  },

  deleteComplaint: async (id) => {
    return safeFetch(`${API_BASE}/complaints/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },

  // Analytics
  getAnalytics: async () => {
    return safeFetch(`${API_BASE}/analytics`, {
      headers: getHeaders(),
    });
  },

  // Users
  getStaffList: async () => {
    return safeFetch(`${API_BASE}/users/staff`, {
      headers: getHeaders(),
    });
  },

  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/users?${queryString}`, {
      headers: getHeaders(),
    });
  },

  updateUserRole: async (id, roleData) => {
    return safeFetch(`${API_BASE}/users/${id}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(roleData),
    });
  },

  // Notifications
  getNotifications: async () => {
    return safeFetch(`${API_BASE}/notifications`, {
      headers: getHeaders(),
    });
  },

  markNotificationRead: async (id) => {
    return safeFetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },

  markAllNotificationsRead: async () => {
    return safeFetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(),
    });
  },
};
