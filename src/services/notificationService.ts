import api from '../lib/api';

export const getNotifications = () => api.get('/notifications');
export const markNotificationRead = (notification_key: string) =>
  api.post('/notifications/mark-read', { notification_key });
export const markAllNotificationsRead = (keys: string[]) =>
  api.post('/notifications/mark-all-read', { keys });
