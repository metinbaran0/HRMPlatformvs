import React, { useState } from 'react';
import './AssignShift.css';

interface Employee {
  id: number;
  name: string;
}

interface Shift {
  id: number;
  name: string;
}

interface ShiftAssignment {
  employeeId: number;
  shiftId: number;
}

const AssignShift = ({ employees, shifts, onAssign }: { employees: Employee[]; shifts: Shift[]; onAssign: (assignment: ShiftAssignment) => void }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<number | null>(null);

  const handleAssign = () => {
    if (selectedEmployee && selectedShift !== null) {
      onAssign({ employeeId: selectedEmployee, shiftId: selectedShift });
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
      <button onClick={handleAssign} disabled={!selectedEmployee || !selectedShift}>
        Vardiya Ata
      </button>
    </div>
  );
};

export default AssignShift;
