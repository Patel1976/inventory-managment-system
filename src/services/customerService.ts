import api from '../lib/api';

export const getCustomers = () => api.get('/customers');
export const getCustomer = (id: number) => api.get(`/view-customers/${id}`);
export const createCustomer = (data: object) => api.post('/create-customer', data);
export const updateCustomer = (id: number, data: object) => api.put(`/update-customer/${id}`, data);
export const deleteCustomer = (id: number) => api.delete(`/delete-customer/${id}`);
