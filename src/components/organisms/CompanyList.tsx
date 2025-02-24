import React from 'react';
import './CompanyList.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  employeeCount: number;
  registrationDate: string;
  sector: string;
}

const CompanyList: React.FC = () => {
  // Örnek veriler - API'den gelecek
  const companies: Company[] = [
    {
      id: 1,
      name: "Tech Solutions A.Ş.",
      email: "info@techsolutions.com",
      phone: "0212 555 0001",
      status: "approved",
      employeeCount: 150,
      registrationDate: "2024-01-15",
      sector: "Teknoloji"
    },
    {
      id: 2,
      name: "Global Marketing Ltd.",
      email: "contact@globalmarketing.com",
      phone: "0216 444 0002",
      status: "pending",
      employeeCount: 75,
      registrationDate: "2024-02-20",
      sector: "Pazarlama"
    },
    // ... diğer şirketler
  ];

  const handleApprove = (companyId: number) => {
    // API çağrısı ve state güncelleme işlemleri
    console.log(`Company ${companyId} approved`);
  };

  const handleReject = (companyId: number) => {
    // API çağrısı ve state güncelleme işlemleri
    console.log(`Company ${companyId} rejected`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      case 'pending':
        return <FaHourglassHalf className="status-icon pending" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      case 'pending':
        return 'Onay Bekliyor';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  return (
    <div className="company-list-container">
      <h2>Tüm Şirketler</h2>
      <div className="company-grid">
        {companies.map(company => (
          <div key={company.id} className="company-card">
            <div className="company-card-header">
              <h3>{company.name}</h3>
              <div className={`status-badge ${company.status}`}>
                {getStatusIcon(company.status)}
                <span>{getStatusText(company.status)}</span>
              </div>
            </div>
            <div className="company-card-content">
              <div className="info-row">
                <span className="label">E-posta:</span>
                <span>{company.email}</span>
              </div>
              <div className="info-row">
                <span className="label">Telefon:</span>
                <span>{company.phone}</span>
              </div>
              <div className="info-row">
                <span className="label">Sektör:</span>
                <span>{company.sector}</span>
              </div>
              <div className="info-row">
                <span className="label">Çalışan Sayısı:</span>
                <span>{company.employeeCount}</span>
              </div>
              <div className="info-row">
                <span className="label">Kayıt Tarihi:</span>
                <span>{formatDate(company.registrationDate)}</span>
              </div>
            </div>
            {company.status === 'pending' && (
              <div className="company-card-actions">
                <button 
                  className="action-button approve"
                  onClick={() => handleApprove(company.id)}
                >
                  Onayla
                </button>
                <button 
                  className="action-button reject"
                  onClick={() => handleReject(company.id)}
                >
                  Reddet
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
