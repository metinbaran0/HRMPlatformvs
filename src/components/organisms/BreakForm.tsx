import React, { useState } from 'react';
import './BreakForm.css';

const BreakForm = ({ onSubmit }: { onSubmit: (breakItem: { breakType: string; startTime: string; endTime: string }) => void }) => {
  const [breakType, setBreakType] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ breakType, startTime, endTime });
    setBreakType('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="break-form-container">
      <h2 className="form-title">Yeni Mola Ekle</h2>
      <form onSubmit={handleSubmit} className="break-form">
        <label>
          <span>Mola Türü:</span>
          <input
            type="text"
            value={breakType}
            onChange={(e) => setBreakType(e.target.value)}
            required
            placeholder="Örnek: Kahve Molası"
          />
        </label>
        <label>
          <span>Başlangıç Zamanı:</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </label>
        <label>
          <span>Bitiş Zamanı:</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </label>
        <button type="submit" className="submit-btn">
          Mola Ekle
        </button>
      </form>
    </div>
  );
};

export default BreakForm;
