import React, { useEffect, useState } from 'react';
import './CompanyList.css';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';

interface Company {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
  employeeCount: number;
  createdAt: string;
  sector: string;
}

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // API'den veri çekme işlemi
  useEffect(() => {
    fetch('http://localhost:9090/company/company/find-all-company')
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCompanies(data.data); // Şirket listesini güncelle
        } else {
          setError(data.message); // Hata mesajını al
        }
        setLoading(false); // Yükleme işlemi tamamlandı
      })
      .catch((err) => {
        setError('Şirketler alınırken bir hata oluştu');
        setLoading(false); // Yükleme tamamlandı, hata durumunda da
      });
  }, []);

  const handleApprove = (companyId: number) => {
    console.log(`Company ${companyId} approved`);
  };

  const handleReject = (companyId: number) => {
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

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="company-list-container">
      <h2>Tüm Şirketler</h2>
      <div className="company-grid">
        {companies.map((company) => (
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
  <span>{formatDate(company.createdAt)}</span> {/* createdAt artık burada */}
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
