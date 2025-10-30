import axios from 'axios';

// Set the base URL for the backend API. Use Vite env var in production/deploy.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Use an interceptor to automatically add the token to requests
// This is crucial for owner-only routes (POST, PUT, DELETE /food)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
