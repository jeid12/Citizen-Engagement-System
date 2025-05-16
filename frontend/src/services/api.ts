import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
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

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    register: (data: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber?: string;
    }) => api.post('/auth/register', data),
    verifyEmail: (token: string) =>
        api.get(`/auth/verify-email/${token}`),
};

export const complaintAPI = {
    create: (data: {
        title: string;
        description: string;
        location?: string;
        categoryId: string;
    }) => api.post('/complaints', data),
    getAll: () => api.get('/complaints'),
    getById: (id: string) => api.get(`/complaints/${id}`),
    update: (id: string, data: {
        status?: string;
        response?: string;
        agencyId?: string;
    }) => api.patch(`/complaints/${id}`, data),
    delete: (id: string) => api.delete(`/complaints/${id}`),
};

export const categoryAPI = {
    getAll: () => api.get('/categories'),
};

export const agencyAPI = {
    getAll: () => api.get('/agencies'),
};

export default api; 