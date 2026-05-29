import api from '../lib/api';

export const getPurchases = () => api.get('/purchases');
export const createPurchase = (data: object) => api.post('/create-purchase', data);
export const updatePurchase = (id: number, data: object) => api.put(`/update-purchase/${id}`, data);
export const deletePurchase = (id: number) => api.delete(`/delete-purchase/${id}`);
