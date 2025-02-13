import React from 'react';

interface ButtonProps {
  type?: 'button' | 'submit';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  type = 'button', 
  className = '', 
  onClick, 
  children 
}) => {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button; 