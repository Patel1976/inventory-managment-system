import api from '../lib/api';

export const getPurchaseReturns = () => api.get('/purchase-returns');
export const createPurchaseReturn = (data: object) => api.post('/create-purchase-return', data);
export const updatePurchaseReturn = (id: number, data: object) => api.put(`/update-purchase-return/${id}`, data);
export const deletePurchaseReturn = (id: number) => api.delete(`/delete-purchase-return/${id}`);
