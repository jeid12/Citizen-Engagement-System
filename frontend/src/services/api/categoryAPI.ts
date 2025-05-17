import axios from '../axios';

interface CategoryData {
    name: string;
    description?: string;
    isActive: boolean;
}

const categoryAPI = {
    getCategories: () => axios.get('/api/categories'),
    getCategory: (id: string) => axios.get(`/api/categories/${id}`),
    createCategory: (data: CategoryData) => axios.post('/api/categories', data),
    updateCategory: (id: string, data: CategoryData) => axios.put(`/api/categories/${id}`, data),
    deleteCategory: (id: string) => axios.delete(`/api/categories/${id}`)
};

export default categoryAPI; 