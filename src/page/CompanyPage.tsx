import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CompanyPage.css";

import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";

interface PendingCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  applicationDate: string;
  sector: string;
  emailVerified: boolean;
  companySize: string;
  contactPerson: string;
}

const CompanyPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Örnek veriler - API'den gelecek
  const pendingCompanies: PendingCompany[] = [
    {
      id: 1,
      name: "Tech Solutions A.Ş.",
      email: "info@techsolutions.com",
      phone: "0212 555 0001",
      applicationDate: "2024-02-20",
      sector: "Teknoloji",
      emailVerified: true,
      companySize: "50-100",
      contactPerson: "Ahmet Yılmaz"
    },
    // ... diğer şirketler
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const renderPendingCompanies = () => {
    return (
      <div className="pending-companies-container">
        <div className="pending-header">
          <h2>Onay Bekleyen Şirketler</h2>
          <div className="pending-stats">
            <div className="stat-item">
              <span className="stat-value">{pendingCompanies.length}</span>
              <span className="stat-label">Toplam Başvuru</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {pendingCompanies.filter(company => company.emailVerified).length}
              </span>
              <span className="stat-label">E-posta Doğrulanmış</span>
            </div>
          </div>
        </div>

        <div className="pending-grid">
          {pendingCompanies.map(company => (
            <div key={company.id} className="pending-card">
              <div className="card-header">
                <h3>{company.name}</h3>
                <div className={`email-status ${company.emailVerified ? 'verified' : 'pending'}`}>
                  {company.emailVerified ? 'E-posta Doğrulandı' : 'E-posta Doğrulanmadı'}
                </div>
              </div>
              <div className="card-content">
                <div className="info-group">
                  <div className="info-item">
                    <span className="label">İletişim Kişisi:</span>
                    <span>{company.contactPerson}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">E-posta:</span>
                    <span>{company.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Telefon:</span>
                    <span>{company.phone}</span>
                  </div>
                </div>
                <div className="info-group">
                  <div className="info-item">
                    <span className="label">Sektör:</span>
                    <span>{company.sector}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Şirket Büyüklüğü:</span>
                    <span>{company.companySize} çalışan</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Başvuru Tarihi:</span>
                    <span>{new Date(company.applicationDate).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              </div>
              {company.emailVerified && (
                <div className="card-actions">
                  <button className="action-button approve">Onayla</button>
                  <button className="action-button reject">Reddet</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CompanyDashboard />;
      case 'companies':
        return <CompanyList />;
      case 'pending':
        return renderPendingCompanies();
      default:
        return <CompanyDashboard />;
    }
  };

  return (
    <div className="company-page">
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarOpen ? '←' : '→'}
        </button>
        <div className="sidebar-content">
          <h2>Menü</h2>
          <nav>
            <ul>
              <li 
                className={activeSection === 'dashboard' ? 'active' : ''}
                onClick={() => setActiveSection('dashboard')}
              >
                Dashboard
              </li>
              <li 
                className={activeSection === 'companies' ? 'active' : ''}
                onClick={() => setActiveSection('companies')}
              >
                Tüm Şirketler
              </li>
              <li 
                className={activeSection === 'pending' ? 'active' : ''}
                onClick={() => setActiveSection('pending')}
              >
                Onay Bekleyenler
              </li>
              <li 
                className="logout"
                onClick={handleLogout}
              >
                Çıkış Yap
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className={`main-content ${isSidebarOpen ? 'with-sidebar' : 'full-width'}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyPage;
