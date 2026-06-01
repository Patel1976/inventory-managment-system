import api from '../lib/api';

export const getProducts = () => api.get('/products');
export const getProduct = (id: number) => api.get(`/view-products/${id}`);
export const createProduct = (data: FormData) => api.post('/create-product', data);
export const updateProduct = (id: number, data: FormData) => api.post(`/update-product/${id}`, data);
export const deleteProduct = (id: number) => api.delete(`/delete-product/${id}`);
