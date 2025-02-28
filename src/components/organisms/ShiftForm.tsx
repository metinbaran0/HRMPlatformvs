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
  onSubmit: () => void;  // onSubmit prop'unu tanımlıyoruz
}

const ShiftForm: React.FC<ShiftFormProps> = ({ onSubmit }) => {
  const [shifts, setShifts] = useState<Shift[]>([]);  // Vardiya bilgilerini tutacak array
  const [selectedDay, setSelectedDay] = useState<string | null>(null);  // Tıklanan gün

  // Vardiya verilerini fetch etme
  useEffect(() => {
    setShifts([
      {
        employeeName: 'Ali Yılmaz',
        shiftTime: '08:00 - 16:00',
        isHoliday: false,
        isAnnualLeave: false,
        annualLeaveDays: [],
      },
      {
        employeeName: 'Ayşe Demir',
        shiftTime: '09:00 - 17:00',
        isHoliday: true,
        isAnnualLeave: false,
        annualLeaveDays: [],
      },
      {
        employeeName: 'Mehmet Can',
        shiftTime: '',
        isHoliday: false,
        isAnnualLeave: true,
        annualLeaveDays: ['Çarşamba', 'Cuma'],
      },
    ]);
  }, []);

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  // Tıklanan gün için vardiya bilgilerini göster
  const handleDayClick = (day: string) => {
    setSelectedDay(day);
  };

  // Seçilen gün için tüm personelin vardiya bilgilerini göstermek
  const renderShiftForDay = (day: string) => {
    return shifts.map((shift, index) => {
      const isHoliday = shift.isHoliday ? 'İzinli' : shift.isAnnualLeave && shift.annualLeaveDays.includes(day) ? 'Yıllık İzin' : shift.shiftTime;
      const backgroundColor = shift.isHoliday || (shift.isAnnualLeave && shift.annualLeaveDays.includes(day)) ? '#e8f9e8' : 'transparent'; // Yalnızca izinli günler için açık yeşil

      return (
        <div key={index} style={{ backgroundColor }}>
          <strong>{shift.employeeName}</strong>: {isHoliday}
        </div>
      );
    });
  };

  return (
    <div className="shift-container">
      {/* Vardiya butonuna tıklandığında açılacak alan */}
      <button className="shift-button" onClick={() => setSelectedDay(null)}>Vardiya Bilgilerini Göster</button>

      {/* Haftanın günlerini yatay şekilde sıralayalım */}
      <div className="shift-days">
        {daysOfWeek.map((day, index) => (
          <div
            key={index}
            className="day"
            onClick={() => handleDayClick(day)}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Seçilen gün için vardiya bilgileri */}
      {selectedDay && (
        <div className="shift-details">
          <h3>{selectedDay} için vardiya detayları:</h3>
          {renderShiftForDay(selectedDay)}
        </div>
      )}

      {/* Vardiya verisi eklemesi için form */}
      <div className="shift-grid">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="shift-day">
            <h4>{day}</h4>
            {shifts.map((shift, idx) => {
              const isHoliday = shift.isHoliday || (shift.isAnnualLeave && shift.annualLeaveDays.includes(day));
              const backgroundColor = isHoliday ? '#e8f9e8' : 'transparent'; // Yalnızca izinli günler için açık yeşil

              return (
                <div key={idx} style={{ backgroundColor }}>
                  <strong>{shift.employeeName}</strong>: {isHoliday ? (shift.isHoliday ? 'İzinli' : 'Yıllık İzin') : shift.shiftTime}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Form bölümü */}
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <button type="submit">Gönder</button>
      </form>
    </div>
  );
};

export default ShiftForm;
