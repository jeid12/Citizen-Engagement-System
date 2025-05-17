import api from '../axios';

interface CategoryData {
    name: string;
    description?: string;
    isActive: boolean;
}

const categoryAPI = {
    getCategories: () => api.get('/categories'),
    getActiveCategories: () => api.get('/categories/active'),
    getCategory: (id: string) => api.get(`/categories/${id}`),
    createCategory: (data: CategoryData) => api.post('/categories', data),
    updateCategory: (id: string, data: CategoryData) => api.put(`/categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/categories/${id}`),
    toggleStatus: (id: string) => api.patch(`/categories/${id}/toggle-status`)
};

export default categoryAPI; 