import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost/projects/inventory-management/public/api/admin',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
