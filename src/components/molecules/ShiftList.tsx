import React from 'react';
import { EmployeeShift } from '../../types/shift';
import './ShiftList.css';

interface ShiftListProps {
  shifts: EmployeeShift[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  return (
    <div className="shift-list">
      <h2>Vardiya Listesi</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift.id}>
            <div>
              <strong>{shift.shiftName}</strong>
              <div className="shift-time">
                {shift.startTime} - {shift.endTime}
              </div>
            </div>
            <div className="employee-count">
              Çalışan Sayısı: <span>{shift.employeeCount}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ShiftList;
