import React from 'react';
import './ShiftList.css'
import { EmployeeShift } from '../../types/shift';

interface ShiftListProps {
  shifts: EmployeeShift[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  return (
    <div>
      <ul>
        {shifts.map(shift => (
          <li key={shift.id}>
            <strong>{shift.shiftName}</strong> - {shift.startTime} - {shift.endTime} (Çalışan Sayısı: {shift.employeeCount})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftList;
