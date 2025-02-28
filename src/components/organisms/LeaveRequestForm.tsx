import React, { useState } from 'react';  
import { useDispatch } from 'react-redux';
import { addLeaveRequestAsync } from '../../store/feature/LeaveSlice';
import './LeaveRequestForm.css';

interface LeaveRequestFormProps {
  onSubmit: (formData: LeaveRequestDto) => void;
}

interface LeaveRequestDto {
  employeeId: number;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<LeaveRequestDto>({
    employeeId: 1, // Kullanıcının ID'sini dinamik hale getirin
    type: '',
    startDate: '',
    endDate: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="leave-request-form">
      <div className="form-group">
        <label htmlFor="leaveType">İzin Türü</label>
        <select id="leaveType" name="type" value={formData.type} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          <option value="annual">Yıllık İzin</option>
          <option value="sick">Hastalık İzni</option>
          <option value="excuse">Mazeret İzni</option>
          <option value="unpaid">Ücretsiz İzin</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="startDate">Başlangıç Tarihi</label>
        <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="endDate">Bitiş Tarihi</label>
        <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="description">Açıklama</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="İzin talebiniz için açıklama yazınız..." />
      </div>

      <button type="submit" className="submit-button">İzin Talebi Gönder</button>
    </form>
  );
};

export default LeaveRequestForm;
