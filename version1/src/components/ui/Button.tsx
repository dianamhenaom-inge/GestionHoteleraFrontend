import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantClasses = {
    primary: 'btn btn-primary moon-gradient border-0 text-white fw-bold',
    secondary: 'btn btn-outline-secondary fw-medium',
    tertiary: 'btn btn-link text-success text-decoration-none fw-medium px-0',
    danger: 'btn btn-danger fw-medium',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      className={`${variantClasses[variant]} ${sizeClasses[size]} d-inline-flex align-items-center gap-2 ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span
          className="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
      ) : icon ? (
        icon
      ) : null}
      <span>{children}</span>
      {variant === 'primary' && !loading && <ArrowRight size={17} />}
    </button>
  );
};

export default Button;
