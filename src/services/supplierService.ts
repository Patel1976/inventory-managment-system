import api from '../lib/api';

export const getSuppliers = () => api.get('/suppliers');
export const getSupplier = (id: number) => api.get(`/view-suppliers/${id}`);
export const createSupplier = (data: object) => api.post('/create-supplier', data);
export const updateSupplier = (id: number, data: object) => api.put(`/update-supplier/${id}`, data);
export const deleteSupplier = (id: number) => api.delete(`/delete-supplier/${id}`);
