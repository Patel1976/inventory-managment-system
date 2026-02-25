import { ReactNode, FormEvent } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

interface FormModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (e: FormEvent) => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

const FormModal = ({
  isOpen,
  title,
  onClose,
  onSubmit,
  children,
  size = 'lg',
  isLoading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel'
}: FormModalProps) => {
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
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={isLoading}
            ></button>
          </div>
          <div className="modal-body">
            <form id="formModal" onSubmit={onSubmit}>
              {children}
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary d-flex align-items-center"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              form="formModal"
              className="btn btn-primary-custom d-flex align-items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  Processing...
                </>
              ) : (
                <>
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormModal;
