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
            // Clear token and user data
            localStorage.removeItem('token');
            // Don't redirect if we're already on the login page
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
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
    verifyOTP: (data: { email: string; otp: string }) =>
        api.post('/auth/verify-otp', data),
    resendOTP: (data: { email: string }) =>
        api.post('/auth/resend-otp', data),
};

export const userAPI = {
    getAll: () => api.get('/users'),
    updateRole: (userId: string, role: string) => api.patch(`/users/${userId}/role`, { role }),
    getStats: () => api.get('/users/stats'),
    verifyUser: (userId: string) => api.post(`/users/${userId}/verify`),
    deleteUser: (userId: string) => api.delete(`/users/${userId}`),
};

export const complaintAPI = {
    getCategories: () => api.get('/complaints/categories'),
    getAgencies: () => api.get('/complaints/agencies'),
    create: (data: {
        title: string;
        description: string;
        location?: string;
        categoryId: string;
        agencyId: string;
    }) => api.post('/complaints', data),
    getAll: () => api.get('/complaints/my-complaints'),
    getAllAdmin: () => api.get('/complaints/all'),
    getAgencyComplaints: () => api.get('/complaints/agency'),
    getById: (id: string) => api.get(`/complaints/${id}`),
    update: (id: string, data: {
        status?: string;
        response?: string;
        agencyId?: string;
    }) => api.patch(`/complaints/${id}`, data),
    delete: (id: string) => api.delete(`/complaints/${id}`),
    respond: (id: string, data: { response: string; status: string }) => 
        api.post(`/complaints/${id}/respond`, data),
};

export const categoryAPI = {
    getAll: () => api.get('/categories'),
};

export const agencyAPI = {
    getAll: () => api.get('/agencies'),
    getById: (id: string) => api.get(`/agencies/${id}`),
    create: (data: {
        name: string;
        description: string;
        contactEmail?: string;
        contactPhone?: string;
        address?: string;
        website?: string;
        jurisdiction?: string;
        operatingHours?: string;
    }) => api.post('/agencies', data),
    update: (id: string, data: {
        name?: string;
        description?: string;
        contactEmail?: string;
        contactPhone?: string;
        address?: string;
        website?: string;
        jurisdiction?: string;
        operatingHours?: string;
    }) => api.patch(`/agencies/${id}`, data),
    delete: (id: string) => api.delete(`/agencies/${id}`),
    getStaff: (id: string) => api.get(`/agencies/${id}/staff`),
    assignUser: (agencyId: string, userId: string) => 
        api.post(`/agencies/${agencyId}/assign/${userId}`),
    removeUser: (agencyId: string, userId: string) => 
        api.delete(`/agencies/${agencyId}/remove/${userId}`),
};

export const profileAPI = {
    getProfile: () => api.get('/profile'),
    updateProfile: (data: {
        firstName?: string;
        lastName?: string;
        phoneNumber?: string;
        bio?: string;
        address?: string;
        city?: string;
        country?: string;
    }) => api.patch('/profile', data),
    uploadPhoto: (photo: File) => {
        const formData = new FormData();
        formData.append('photo', photo);
        return api.post('/profile/photo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api; 