import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = false }) => {
  return (
    <div className={`card border-0 shadow-sm ${hover ? 'card-hover' : ''} ${className}`}>
      <div className="card-body p-4">
        {children}
      </div>
    </div>
  );
};

export default Card;
