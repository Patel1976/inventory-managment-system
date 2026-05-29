import api from '../lib/api';

export const getSuppliers = () => api.get('/suppliers');
export const getStores = () => api.get('/stores');
export const getCustomers = () => api.get('/customers');
