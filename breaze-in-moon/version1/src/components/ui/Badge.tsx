import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'available' | 'confirmed' | 'occupied' | 'cancelled' | 'maintenance' | 'pending';
  className?: string;
}

// Uses Materialize CSS `.chip` base class + custom SCSS variant modifiers
const Badge: React.FC<BadgeProps> = ({ children, variant, className = '' }) => {
  return (
    <span className={`chip chip-${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
