import api from '../lib/api';

export const getSettings = () => api.get('/settings');
export const updateSettings = (data: Record<string, unknown>) => api.put('/settings', data);
export const testEmailConnection = (data: Record<string, string>) => api.post('/settings/test-email', data);
