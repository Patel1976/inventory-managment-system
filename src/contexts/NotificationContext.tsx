import { createContext, useState, useEffect, ReactNode } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notificationService';

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'danger' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refresh: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'notif_read_ids';

const getLocalReadIds = (): Set<string> => {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')); }
  catch { return new Set(); }
};

const saveLocalReadIds = (ids: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setIsLoading(true);
    getNotifications()
      .then(res => {
        // DB is source of truth — use read value directly from API
        setNotifications(res.data.data || []);
        // Sync localStorage to match DB state
        const readIds = new Set<string>(
          (res.data.data || []).filter((n: Notification) => n.read).map((n: Notification) => n.id)
        );
        saveLocalReadIds(readIds);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // Optimistic update
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    // Persist to localStorage as fallback
    const localIds = getLocalReadIds();
    localIds.add(id);
    saveLocalReadIds(localIds);
    // Persist to DB
    markNotificationRead(id).catch(() => {});
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    // Optimistic update
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    // Persist to localStorage
    const localIds = getLocalReadIds();
    unreadIds.forEach(id => localIds.add(id));
    saveLocalReadIds(localIds);
    // Persist to DB
    markAllNotificationsRead(unreadIds).catch(() => {});
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isLoading,
      markAsRead,
      markAllAsRead,
      refresh: fetchNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
