import api from '../lib/api';

export const getUsers = () => api.get('/users');
export const createUser = (data: object) => api.post('/create-user', data);
export const updateUser = (id: number, data: object) => api.put(`/update-user/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/delete-user/${id}`);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (_id: number, data: FormData | Record<string, unknown>) =>
  api.post('/update-profile', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
export const changePassword = (_id: number, data: { password: string }) =>
  api.post('/update-profile', data);

// Activity Logs
export const getActivityLogs = (params?: object) => api.get('/activity-logs', { params });
export const clearActivityLogs = () => api.delete('/activity-logs/clear');
