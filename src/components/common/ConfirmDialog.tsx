import { FiAlertTriangle, FiX } from 'react-icons/fi';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
  variant = 'danger'
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return { iconColor: '#dc3545', btnClass: 'btn-danger' };
      case 'warning':
        return { iconColor: '#ffc107', btnClass: 'btn-warning' };
      case 'info':
        return { iconColor: '#0dcaf0', btnClass: 'btn-info' };
      default:
        return { iconColor: '#dc3545', btnClass: 'btn-danger' };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-sm">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <button 
              type="button" 
              className="btn-close" 
              onClick={onCancel}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body text-center pt-0">
            <div className="mb-3 d-flex justify-content-center">
              <FiAlertTriangle size={48} color={styles.iconColor} />
            </div>
            <h5 className="mb-2">{title}</h5>
            <p className="text-muted mb-0">{message}</p>
          </div>
          <div className="modal-footer border-0 justify-content-center gap-2">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button 
              type="button" 
              className={`btn ${styles.btnClass}`}
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  Processing...
                </>
              ) : (
                confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
