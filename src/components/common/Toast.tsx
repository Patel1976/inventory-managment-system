import { useEffect, useState, createContext, useContext, useCallback, ReactNode } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<ToastMessage, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  hideToast: (id: string) => void;
}

const ToastContainer = ({ toasts, hideToast }: ToastContainerProps) => {
  return (
    <div 
      className="toast-container position-fixed top-0 end-0 p-3" 
      style={{ zIndex: 1070 }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem = ({ toast, onClose }: ToastItemProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case 'success':
        return { bgColor: '#198754', icon: <FiCheck size={20} /> };
      case 'error':
        return { bgColor: '#dc3545', icon: <FiX size={20} /> };
      case 'warning':
        return { bgColor: '#ffc107', icon: <FiAlertCircle size={20} /> };
      case 'info':
        return { bgColor: '#0dcaf0', icon: <FiInfo size={20} /> };
      default:
        return { bgColor: '#198754', icon: <FiCheck size={20} /> };
    }
  };

  const styles = getToastStyles();

  return (
    <div 
      className="toast show mb-2"
      role="alert"
      style={{
        backgroundColor: styles.bgColor,
        color: 'white',
        minWidth: '300px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        animation: 'slideIn 0.3s ease'
      }}
    >
      <div className="toast-header" style={{ 
        backgroundColor: 'transparent', 
        color: 'white',
        borderBottom: 'none'
      }}>
        <span className="me-2">{styles.icon}</span>
        <strong className="me-auto">{toast.title}</strong>
        <button 
          type="button" 
          className="btn-close btn-close-white" 
          onClick={onClose}
        ></button>
      </div>
      {toast.message && (
        <div className="toast-body" style={{ paddingTop: 0 }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

// Add keyframe animation to index.css or admin.css
export const toastStyles = `
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
`;

export default ToastProvider;
