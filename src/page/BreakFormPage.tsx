import React from 'react';
import BreakForm from '../components/organisms/BreakForm';
import { BreakRequestDto } from '../store/feature/breakSlice';

interface BreakFormPageProps {
  onSubmit: (breakData: BreakRequestDto) => void;
}

const BreakFormPage: React.FC<BreakFormPageProps> = ({ onSubmit }) => {
  return (
    <div>
      <h2>Mola Formu</h2>
      <BreakForm onSubmit={onSubmit} />
    </div>
  );
};

export default BreakFormPage; 