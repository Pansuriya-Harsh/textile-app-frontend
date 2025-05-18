import api from '../utils/api';

const TOKEN_KEY = 'token';

// Save token to localStorage
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Login
export const login = async (credentials) => {
  const res = await api.post('/auth/login', credentials);
  saveToken(res.data.token);
  return res.data;
};

// Register
export const register = async (details) => {
  const res = await api.post('/auth/register', details);
  return res.data;
};
