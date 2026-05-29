import api from '../lib/api';

export const getCategories = () => api.get('/categories');
export const createCategory = (data: object) => api.post('/create-category', data);
export const updateCategory = (id: number, data: object) => api.put(`/update-category/${id}`, data);
export const deleteCategory = (id: number) => api.delete(`/delete-category/${id}`);
