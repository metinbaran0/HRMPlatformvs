import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  type = "button", 
  className = "", 
  disabled = false 
}) => {
  return (
    <button 
      type={type} 
      className={`btn ${className}`} 
      onClick={onClick} 
      disabled={disabled} 
    >
      {children}
    </button>
  );
};

export default Button;
