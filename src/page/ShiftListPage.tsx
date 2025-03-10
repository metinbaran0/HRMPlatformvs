import React from 'react';
import ShiftList from '../components/molecules/ShiftList';
import { Shift, ShiftListItem } from '../types/shift';

interface ShiftListPageProps {
  shifts: Shift[];
}

const ShiftListPage: React.FC<ShiftListPageProps> = ({ shifts }) => {
  return (
    <div>
      <h2>Vardiya Listesi</h2>
      <ShiftList
        shifts={shifts.map(shift => ({
          id: shift.id,
          shiftName: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          employeeCount: shift.employeeCount
        } as ShiftListItem))}
      />
    </div>
  );
};

export default ShiftListPage; 