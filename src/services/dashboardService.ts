import api from '../lib/api';

export const getDashboardData = () => api.get('/dashboard');
