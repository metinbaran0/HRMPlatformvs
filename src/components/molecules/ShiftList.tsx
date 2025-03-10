import React from 'react';
import { ShiftListItem } from '../../types/shift';
import './ShiftList.css';

interface ShiftListProps {
  shifts: ShiftListItem[];
}

const ShiftList: React.FC<ShiftListProps> = ({ shifts }) => {
  return (
    <div className="shift-list">
      <h2>Vardiya Listesi</h2>
      <ul>
        {shifts.map(shift => (
          <li key={shift.id}>
            <div className="shift-info">
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
