import api from '../lib/api';

export const getStores = () => api.get('/stores');
export const getStore = (id: number) => api.get(`/view-stores/${id}`);
export const createStore = (data: object) => api.post('/create-store', data);
export const updateStore = (id: number, data: object) => api.put(`/update-store/${id}`, data);
export const deleteStore = (id: number) => api.delete(`/delete-store/${id}`);
