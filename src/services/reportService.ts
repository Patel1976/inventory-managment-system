import api from '../lib/api';

export const getAdjustments = () => api.get('/adjustments');
export const getAdjustment = (id: number) => api.get(`/view-adjustments/${id}`);
export const createAdjustment = (data: object) => api.post('/create-adjustment', data);
export const updateAdjustment = (id: number, data: object) => api.put(`/update-adjustment/${id}`, data);
export const deleteAdjustment = (id: number) => api.delete(`/delete-adjustment/${id}`);

export const getSalesReport = (params?: object) => api.get('/reports/sales', { params });
export const getPurchaseReport = (params?: object) => api.get('/reports/purchases', { params });
export const getInventoryReport = (params?: object) => api.get('/reports/inventory', { params });
export const getCustomerReport = (params?: object) => api.get('/reports/customers', { params });
export const getSupplierReport = (params?: object) => api.get('/reports/suppliers', { params });
