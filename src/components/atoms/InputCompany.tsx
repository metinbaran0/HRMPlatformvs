// src/components/atoms/Input.tsx
import React from "react";

interface InputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputCompany: React.FC<InputProps> = ({ placeholder, value, onChange, className }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`border rounded-md px-4 py-2 ${className}`}
    />
  );
};

export default InputCompany;