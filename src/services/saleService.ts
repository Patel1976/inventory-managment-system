import api from '../lib/api';

export const getSales = () => api.get('/sales');
export const createSale = (data: object) => api.post('/create-sale', data);
export const updateSale = (id: number, data: object) => api.put(`/update-sale/${id}`, data);
export const deleteSale = (id: number) => api.delete(`/delete-sale/${id}`);
