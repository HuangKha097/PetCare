import API from '../api/axios';

/**
 * Auth Service
 * Handles all API calls related to authentication and user profile.
 */

export const login = (credentials) => {
  return API.post('/auth/login', credentials);
};

export const register = (userData) => {
  return API.post('/auth/register', userData);
};

export const googleLogin = (idToken) => {
  return API.post('/auth/google-login', { idToken });
};

export const getMe = () => {
  return API.get('/auth/me');
};

export const updateProfile = (profileData) => {
  return API.patch('/auth/profile', profileData);
};

export const refreshToken = (refreshToken) => {
  return API.post('/auth/refresh-token', { refreshToken });
};

export const logoutAPI = (refreshToken) => {
  return API.post('/auth/logout', { refreshToken });
};
