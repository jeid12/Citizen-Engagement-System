import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to add the auth token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Handle specific error codes
            switch (error.response.status) {
                case 401:
                    // Clear token and redirect to login if not already there
                    localStorage.removeItem('token');
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    break;
                case 403:
                    // Handle forbidden errors
                    console.error('Access forbidden:', error.response.data.message);
                    break;
                case 400:
                    // Handle validation errors
                    console.error('Validation error:', error.response.data.message);
                    break;
                case 404:
                    // Handle not found errors
                    console.error('Resource not found:', error.response.data.message);
                    break;
                case 500:
                    // Handle server errors
                    console.error('Server error:', error.response.data.message);
                    break;
                default:
                    console.error('API error:', error.response.data.message);
            }
        } else if (error.request) {
            // Handle network errors
            console.error('Network error:', error.message);
        } else {
            // Handle other errors
            console.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance; 