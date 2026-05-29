import api from '../lib/api';

export const getSaleReturns = () => api.get('/sale-returns');
export const createSaleReturn = (data: object) => api.post('/create-sale-return', data);
export const updateSaleReturn = (id: number, data: object) => api.put(`/update-sale-return/${id}`, data);
export const deleteSaleReturn = (id: number) => api.delete(`/delete-sale-return/${id}`);
