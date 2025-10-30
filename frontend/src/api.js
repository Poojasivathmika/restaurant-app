import axios from 'axios';

// NOTE: VITE automatically exposes environment variables prefixed with VITE_
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: VITE_BACKEND_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// ** CRITICAL FIX: AXIOS INTERCEPTOR **
// This code runs before every API request to check and attach the token.
api.interceptors.request.use(
    (config) => {
        // Use the key 'token' (which is set in OwnerLogin.jsx)
        const token = localStorage.getItem('token');
        
        if (token) {
            // Set the Authorization header for all protected endpoints
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
