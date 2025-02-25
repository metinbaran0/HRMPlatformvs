// components/atoms/Button.tsx
import React from "react";

type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

const ButtonCompany: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default ButtonCompany;