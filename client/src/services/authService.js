import api from './api';

const authService = {
  login: async (credentials) => {
    return await api.post('/user-api/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/user-api/register', userData);
  },

  getProfile: async () => {
    return await api.get('/user-api/profile');
  },

  updateProfile: async (profileData) => {
    return await api.put('/user-api/profile', profileData);
  }
};

export default authService;