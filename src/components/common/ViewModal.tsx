import { ReactNode } from 'react';
import { FiX } from 'react-icons/fi';

interface ViewModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const ViewModal = ({
  isOpen,
  title,
  onClose,
  children,
  size = 'lg',
  footer
}: ViewModalProps) => {
  if (!isOpen) return null;

  const sizeClass = {
    sm: 'modal-sm',
    md: '',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }[size];

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}>
      <div className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${sizeClass}`}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
          {footer && (
            <div className="modal-footer">
              {footer}
            </div>
          )}
          {!footer && (
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                <FiX className="me-1" /> Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
