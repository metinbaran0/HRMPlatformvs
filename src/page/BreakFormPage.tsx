import React from 'react';
import BreakForm from '../components/organisms/BreakForm';

interface BreakFormPageProps {
  onSubmit: (newBreak: { breakType: string; startTime: string; endTime: string }) => void;
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