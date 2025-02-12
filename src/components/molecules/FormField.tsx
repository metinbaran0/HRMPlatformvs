import React from 'react';
import Input from '../atoms/Input';

interface FormFieldProps {
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ className = '', ...props }) => {
  return (
    <div className={`form-field ${className}`}>
      <Input {...props} />
    </div>
  );
};

export default FormField; 