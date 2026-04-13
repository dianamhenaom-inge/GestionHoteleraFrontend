import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  icon: Icon,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="hotel-label form-label" htmlFor={props.id}>
          {label}
        </label>
      )}
      <div className="position-relative">
        {Icon && (
          <div
            className="position-absolute top-50 translate-middle-y d-flex align-items-center ps-3"
            style={{ pointerEvents: 'none', zIndex: 1 }}
          >
            <Icon className="text-secondary" size={18} />
          </div>
        )}
        <input
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
          style={Icon ? { paddingLeft: '2.5rem' } : undefined}
          {...props}
        />
        {error && <div className="invalid-feedback">{error}</div>}
        {helperText && !error && (
          <div className="form-text text-muted fst-italic">{helperText}</div>
        )}
      </div>
    </div>
  );
};

export default Input;
