import React, { useState, useEffect } from 'react';
import './ShiftForm.css';

interface Shift {
  employeeName: string;
  shiftTime: string;
  isHoliday: boolean;
  isAnnualLeave: boolean;
  annualLeaveDays: string[];
}

interface ShiftFormProps {
  onSubmit: () => void;
}

const ShiftForm: React.FC<ShiftFormProps> = ({ onSubmit }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);  
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    setShifts([
      { employeeName: 'Ali Yılmaz', shiftTime: '08:00 - 16:00', isHoliday: false, isAnnualLeave: false, annualLeaveDays: [] },
      { employeeName: 'Ayşe Demir', shiftTime: '09:00 - 17:00', isHoliday: true, isAnnualLeave: false, annualLeaveDays: [] },
      { employeeName: 'Mehmet Can', shiftTime: '', isHoliday: false, isAnnualLeave: true, annualLeaveDays: ['Çarşamba', 'Cuma'] }
    ]);
  }, []);

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
  };

  const renderShiftForDay = (day: string) => {
    return shifts.map((shift, index) => {
      const isHoliday = shift.isHoliday ? 'İzinli' : shift.isAnnualLeave && shift.annualLeaveDays.includes(day) ? 'Yıllık İzin' : shift.shiftTime;
      const backgroundColor = shift.isHoliday || (shift.isAnnualLeave && shift.annualLeaveDays.includes(day)) ? '#e8f9e8' : 'transparent';

      return (
        <div key={index} style={{ backgroundColor }} className="shift-day">
          <strong>{shift.employeeName}</strong>: {isHoliday}
        </div>
      );
    });
  };

  return (
    <div className="shift-container">
      <button className="shift-button" onClick={() => setSelectedDay(null)}>Vardiya Bilgilerini Göster</button>

      <div className="shift-days">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="day" onClick={() => handleDayClick(day)}>
            {day}
          </div>
        ))}
      </div>

      {selectedDay && (
        <div className="shift-details">
          <h3>{selectedDay} için vardiya detayları:</h3>
          {renderShiftForDay(selectedDay)}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ShiftForm;
