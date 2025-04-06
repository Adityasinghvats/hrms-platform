import api from './api.js';

const AuthService = {
  // Login user and return user data with tokens
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
      localStorage.setItem('accessToken', response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
    }
    
    return response.data.data;
  },
  
  logout: async () => {
    try {
      await api.post('/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/users/refresh-token', { refreshToken });
    if (response.data.data.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
      if (response.data.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
    }
    
    return response.data.data;
  },
  
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
 
  isAdmin: () => {
    const user = AuthService.getCurrentUser();
    return user?.role === 'admin';
  }
};

export default AuthService;