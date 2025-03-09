import React, { useState } from 'react';
import './AssignShift.css';
import { Shift, ShiftAssignment } from '../../types/shift';

interface Employee {
  id: number;
  name: string;
}

interface AssignShiftProps {
  employees: { id: number; name: string }[];
  shifts: Shift[];
  onAssign: (assignment: ShiftAssignment) => void;
}

const AssignShift = ({ employees, shifts, onAssign }: AssignShiftProps) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleAssign = () => {
    if (selectedEmployee && selectedShift !== null) {
      onAssign({ 
        employeeId: selectedEmployee, 
        shiftId: selectedShift,
        date: selectedDate 
      });
    }
  };

  return (
    <div className="assign-shift">
      <div className="form-header">Vardiya Ata</div>
      <div>
        <label>
          Çalışan Seçin:
          <select onChange={(e) => setSelectedEmployee(Number(e.target.value))} value={selectedEmployee ?? ''}>
            <option value="">Çalışan Seçin</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Vardiya Seçin:
          <select onChange={(e) => setSelectedShift(Number(e.target.value))} value={selectedShift ?? ''}>
            <option value="">Vardiya Seçin</option>
            {shifts.map((shift) => (
              <option key={shift.id} value={shift.id}>
                {shift.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Tarih:
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleAssign} disabled={!selectedEmployee || !selectedShift || !selectedDate}>
        Vardiya Ata
      </button>
    </div>
  );
};

export default AssignShift;
