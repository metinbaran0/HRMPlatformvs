import React, { useState } from 'react';
import './BreakForm.css';

interface BreakFormProps {
  onSubmit: (breakData: { breakType: string; startTime: string; endTime: string }) => void;
}

const BreakForm: React.FC<BreakFormProps> = ({ onSubmit }) => {
  const [breakType, setBreakType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (breakType && startTime && endTime) {
      onSubmit({ breakType, startTime, endTime });
      // Form alanlarını temizle
      setBreakType('');
      setStartTime('');
      setEndTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="break-form">
      <div className="form-group">
        <label htmlFor="breakType">Mola Tipi</label>
        <input
          type="text"
          id="breakType"
          value={breakType}
          onChange={(e) => setBreakType(e.target.value)}
          placeholder="Örn: Öğle Molası"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="startTime">Başlangıç Saati</label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="endTime">Bitiş Saati</label>
        <input
          type="time"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="submit-button">Mola Ekle</button>
    </form>
  );
};

export default BreakForm;
