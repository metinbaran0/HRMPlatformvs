import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaBuilding, FaEnvelope, FaPhone, FaUsers, FaCalendar, FaExclamationTriangle } from "react-icons/fa";
import "./PendingCompanies.css";

interface PendingCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  sector: string;
  employeeCount: number;
  createdAt: string;
  emailVerified: boolean;  // Mail doğrulama durumu
}

const PendingCompanies: React.FC = () => {
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Hata mesajı durumu
  const [showPopup, setShowPopup] = useState(false); // Popup durumu için state

  useEffect(() => {
    fetch("http://localhost:9090/company/company/pending-company")
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setPendingCompanies(data.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching pending companies:", error);
        setLoading(false);
      });
  }, []);

  const handleApprove = async (id: number, emailVerified: boolean) => {
    if (!emailVerified) {
      setShowPopup(true); // Popup'ı göster
      return;
    }

    try {
      const response = await fetch(`http://localhost:9090/company/company/approve-company/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await response.json();
      if (data.success) {
        // Başarıyla onaylanan şirketi listeden çıkarma
        setPendingCompanies(prev => prev.filter(company => company.id !== id));
      }
    } catch (error) {
      console.error("Şirket onaylanırken bir hata oluştu:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:9090/company/company/reject-company/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const data = await response.json();
      if (data.success) {
        // Başarıyla reddedilen şirketi listeden çıkarma
        setPendingCompanies(prev => prev.filter(company => company.id !== id));
      }
    } catch (error) {
      console.error("Şirket reddedilirken bir hata oluştu:", error);
    }
  };

  // Popup bileşeni
  const Popup = () => (
    <div className="popup-overlay" onClick={() => setShowPopup(false)}>
      <div className="popup-content" onClick={e => e.stopPropagation()}>
        <div className="popup-header">
          <FaExclamationTriangle className="popup-icon" />
          <h3 className="popup-title">Mail Doğrulama Gerekli</h3>
        </div>
        <p className="popup-message">
          Bu şirket henüz mail adresini doğrulamamış. Onaylama işlemi için mail doğrulaması gereklidir.
        </p>
        <button className="popup-close" onClick={() => setShowPopup(false)}>×</button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="pending-companies-container">
      <div className="pending-header">
        <h2>Onay Bekleyen Şirketler</h2>
        <div className="pending-stats">
          <div className="stat-box">
            <span className="stat-number">{pendingCompanies.length}</span>
            <span className="stat-label">Bekleyen Başvuru</span>
          </div>
        </div>
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>} {/* Hata mesajı */}

      {showPopup && <Popup />} {/* Popup bileşenini ekle */}

      <div className="pending-grid">
        {pendingCompanies.map((company) => (
          <div key={company.id} className="pending-card">
            <div className="card-header">
              <FaBuilding className="company-icon" />
              <h3>{company.name}</h3>
            </div>
            
            <div className="card-content">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <span>{company.email}</span>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{company.phone}</span>
              </div>
              <div className="info-item">
                <FaUsers className="info-icon" />
                <span>{company.employeeCount} Çalışan</span>
              </div>
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <span>{new Date(company.createdAt).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="action-button approve"
                onClick={() => handleApprove(company.id, company.emailVerified)}
              >
                <FaCheckCircle /> Onayla
              </button>
              <button
                className="action-button reject"
                onClick={() => handleReject(company.id)}
              >
                <FaTimesCircle /> Reddet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingCompanies;
