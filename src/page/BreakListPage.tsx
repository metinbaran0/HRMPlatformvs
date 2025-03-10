import React from 'react';
import BreakList from '../components/molecules/BreakList';

interface BreakListPageProps {
  breaks: { id: number; breakType: string; startTime: string; endTime: string }[];
}

const BreakListPage: React.FC<BreakListPageProps> = ({ breaks }) => {
  return (
    <div>
      <h2>Mola Listesi</h2>
      <BreakList breaks={breaks} />
    </div>
  );
};

export default BreakListPage; 