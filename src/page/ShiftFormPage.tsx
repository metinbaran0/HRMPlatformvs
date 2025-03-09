import React from 'react';
import ShiftForm from '../components/molecules/ShiftForm';

interface ShiftFormPageProps {
  onSubmit: (newShift: { name: string; startTime: string; endTime: string }) => void;
}

const ShiftFormPage: React.FC<ShiftFormPageProps> = ({ onSubmit }) => {
  return (
    <div>
      <h2>Vardiya Formu</h2>
      <ShiftForm onSubmit={onSubmit} />
    </div>
  );
};

export default ShiftFormPage; 