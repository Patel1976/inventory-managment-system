import api from '../lib/api';

export const getBrands = () => api.get('/brands');
export const createBrand = (data: FormData) => api.post('/create-brand', data);
export const updateBrand = (id: number, data: FormData) => api.post(`/update-brand/${id}`, data);
export const deleteBrand = (id: number) => api.delete(`/delete-brand/${id}`);
