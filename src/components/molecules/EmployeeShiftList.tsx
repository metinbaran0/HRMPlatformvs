import React from 'react';
import { EmployeeShift } from '../../types/shift';
import './EmployeeShiftList.css';

interface EmployeeShiftListProps {
  employeeShifts: EmployeeShift[];
}

const EmployeeShiftList: React.FC<EmployeeShiftListProps> = ({ employeeShifts }) => {
  return (
    <div className="employee-shift-list">
      <ul>
        {employeeShifts.map(shift => (
          <li key={shift.id}>
            <strong>{shift.employeeName}</strong> - {shift.shiftName} - {shift.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeShiftList;
