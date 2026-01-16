import { createContext, useContext, useState, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'danger' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
}

// Mock notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'Dell Monitor 27" stock is below threshold (5 units left)',
    time: '5 minutes ago',
    read: false
  },
  {
    id: '2',
    type: 'success',
    title: 'New Sale',
    message: 'New sale #INV-001 worth $250.00 from John Doe',
    time: '15 minutes ago',
    read: false
  },
  {
    id: '3',
    type: 'warning',
    title: 'Low Stock Alert',
    message: 'USB-C Hub stock is critical (3 units left)',
    time: '30 minutes ago',
    read: false
  },
  {
    id: '4',
    type: 'success',
    title: 'New Sale',
    message: 'New sale #INV-002 worth $180.00 from Jane Smith',
    time: '1 hour ago',
    read: true
  },
  {
    id: '5',
    type: 'info',
    title: 'Purchase Received',
    message: 'Purchase order #PO-045 has been received',
    time: '2 hours ago',
    read: true
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead,
        addNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
