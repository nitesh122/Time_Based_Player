import axios from 'axios';
import config from '../config/env';

const API_BASE_URL = config.API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Time Block API
export const timeBlockAPI = {
  getCurrent: () => api.get('/time-blocks/current'),
  getAll: () => api.get('/time-blocks'),
  getById: (id) => api.get(`/time-blocks/${id}`),
};

// Playlist API
export const playlistAPI = {
  getById: (id) => api.get(`/playlists/${id}`),
  getAll: () => api.get('/playlists'),
};

// Song API
export const songAPI = {
  getById: (id) => api.get(`/songs/${id}`),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
