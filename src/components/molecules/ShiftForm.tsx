import React, { useState } from 'react';
import './ShiftForm.css';

const ShiftForm = ({ onSubmit }: { onSubmit: (shift: { name: string; startTime: string; endTime: string }) => void }) => {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, startTime, endTime });
    setName('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <form className="shift-form" onSubmit={handleSubmit}>
      <div className="form-header">Vardiya Ekle</div>
      <label>
        Vardiya Adı:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label>
        Başlangıç Zamanı:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
      </label>
      <label>
        Bitiş Zamanı:
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
      </label>
      <button type="submit">Vardiya Ekle</button>
    </form>
  );
};

export default ShiftForm;
