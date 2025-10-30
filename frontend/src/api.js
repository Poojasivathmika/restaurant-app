import axios from 'axios';

// Get the backend URL from environment variables (important for local vs. deployed)
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: VITE_BACKEND_URL, // Use the correct base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// ** INTERCEPTOR: This is the code that fixes the persistence problem **
api.interceptors.request.use(
    (config) => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        // If the token exists and the request is not for login/registration, attach it
        if (token) {
            // Set the Authorization header with the Bearer token scheme
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;