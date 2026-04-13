import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Bootstrap backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* Bootstrap modal */}
      <div
        className="modal d-block"
        tabIndex={-1}
        style={{ zIndex: 1050 }}
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* Header */}
            <div className="modal-header border-bottom">
              <h5 className="modal-title fw-bold">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Cerrar"
              />
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="modal-footer border-top d-flex justify-content-end gap-2">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
