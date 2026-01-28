/**
 * API Service - Gọi backend endpoints
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', { status: response.status, data });
      throw new Error(data.message || `Error ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

// ============== AUTH ENDPOINTS ==============
export const authAPI = {
  login: (email, password) => {
    console.log('🔐 Logging in:', email);
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: (userData) =>
    apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ============== TOURS ENDPOINTS ==============
export const toursAPI = {
  getAll: () =>
    apiCall('/tours', {
      method: 'GET',
    }),

  getById: (id) =>
    apiCall(`/tours/${id}`, {
      method: 'GET',
    }),
};

// ============== BOOKINGS ENDPOINTS ==============
export const bookingsAPI = {
  getAll: () =>
    apiCall('/bookings', {
      method: 'GET',
    }),

  create: (bookingData) =>
    apiCall('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    }),
};

export default apiCall;
