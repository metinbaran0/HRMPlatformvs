import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './LeaveRequestForm.css'; // CSS dosyasını import ediyoruz

interface LeaveRequest {
  startDate: string;
  endDate: string;
  leaveType: 'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID';
  employeeId: number;
  reason: string;
}

const LeaveRequestForm: React.FC = () => {
  const token = useSelector((state: any) => state.user.token); // Redux üzerinden token alınıyor
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID'>('ANNUAL');
  const [employeeId, setEmployeeId] = useState<number>(0); // Default employeeId, daha sonra set edilecek
  const [reason, setReason] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  // Bu useEffect fonksiyonu, modal açıldığında body kaydırmayı engeller
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';  // Modal açıkken body kaydırmayı engelle
    } else {
      document.body.style.overflow = 'auto';  // Modal kapandığında kaydırma izni ver
    }
  }, [isModalOpen]);

  // Form gönderildiğinde çalışacak fonksiyon
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      alert('Token bulunamadı, lütfen giriş yapın.');
      return;
    }

    const leaveRequestData: LeaveRequest = {
      startDate,
      endDate,
      leaveType,
      employeeId,
      reason,
    };

    try {
      const response = await fetch('http://localhost:9090/v1/api/leave/leaverequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, 
        },
        body: JSON.stringify(leaveRequestData),
      });

      const result = await response.json();

      if (response.ok) {
        setResponseMessage('İzin talebiniz başarıyla oluşturulmuştur!');
      } else {
        setResponseMessage(result.message || 'İzin talebi oluşturulurken hata oluştu.');
      }
    } catch (error) {
      setResponseMessage('Bir hata oluştu.');
    }
  };

  // Modal'ı kapatma fonksiyonu
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`}>
      <div className="leave-request-form">
        <h2>İzin Talebi Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startDate">Başlangıç Tarihi:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">Bitiş Tarihi:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="leaveType">İzin Türü:</label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as 'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID')}
              required
            >
              <option value="ANNUAL">Yıllık İzin</option>
              <option value="MARRIAGE">Evlilik İzni</option>
              <option value="MATERNITY">Doğum İzni</option>
              <option value="UNPAID">Ücretsiz İzin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Sebep:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="submit-button">İzin Talebi Gönder</button>
        </form>

        {responseMessage && <div className="response-message"><p>{responseMessage}</p></div>}

        <button className="close-modal-button" onClick={closeModal}>Kapat</button>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
