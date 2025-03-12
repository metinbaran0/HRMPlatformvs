import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClipboardList, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './LeaveRequestForm.css';

interface LeaveRequest {
  startDate: string;
  endDate: string;
  leaveType: 'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID';
  employeeId: number;
  reason: string;
}

interface LeaveRequestFormProps {
  onClose: () => void;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.user.token);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID'>('ANNUAL');
  const [employeeId, setEmployeeId] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isModalOpen]);

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
        setTimeout(() => {
          navigate('/employee');
        }, 2000);
      } else {
        setResponseMessage(result.message || 'İzin talebi oluşturulurken hata oluştu.');
      }
    } catch (error) {
      setResponseMessage('Bir hata oluştu.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    onClose();
  };

  const getLeaveTypeLabel = (type: string) => {
    const types = {
      ANNUAL: 'Yıllık İzin',
      MARRIAGE: 'Evlilik İzni',
      MATERNITY: 'Doğum İzni',
      UNPAID: 'Ücretsiz İzin'
    };
    return types[type as keyof typeof types];
  };

  return (
    <div className={`modal-overlay ${isModalOpen ? 'open' : ''}`}>
      <div className="leave-request-form">
        <button className="close-modal-button" onClick={closeModal}>
          <FaTimes />
        </button>
        
        <div className="form-header">
          <FaCalendarAlt className="form-icon" />
          <h2>İzin Talebi Oluştur</h2>
          <p>Lütfen izin bilgilerinizi doldurun</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="startDate">
              <FaCalendarAlt className="input-icon" />
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">
              <FaCalendarAlt className="input-icon" />
              Bitiş Tarihi
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="leaveType">
              <FaClipboardList className="input-icon" />
              İzin Türü
            </label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as 'ANNUAL' | 'MARRIAGE' | 'MATERNITY' | 'UNPAID')}
              required
            >
              {Object.entries({
                ANNUAL: 'Yıllık İzin',
                MARRIAGE: 'Evlilik İzni',
                MATERNITY: 'Doğum İzni',
                UNPAID: 'Ücretsiz İzin'
              }).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

         

          <button type="submit" className="submit-button">
            <FaPaperPlane className="button-icon" />
            İzin Talebi Gönder
          </button>
        </form>

        {responseMessage && (
          <div className="response-message">
            <p>{responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequestForm;
