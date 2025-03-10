import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCompanies } from '../store/feature/companySlice';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaPlusCircle, 
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import './CompanyPage.css';

const CompanyPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { companies, loading, error } = useSelector((state: RootState) => state.companies);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('');

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Filtreleme işlemi
  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' ? true : company.status === filterStatus;
    const matchesSector = filterSector ? company.sector === filterSector : true;
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Durum ikonu
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

  // Durum metni
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

  if (loading) {
    return (
      <div className="company-page">
        <div className="company-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Şirketler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="company-page">
        <div className="company-content">
          <div className="error-container">
            <h2>Hata!</h2>
            <p>{error}</p>
            <button className="retry-button" onClick={() => dispatch(fetchCompanies())}>Tekrar Dene</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-page">
      <div className="company-content">
        <motion.div 
          className="company-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-content">
            <div>
              <h1>Şirket Yönetimi</h1>
              <p>Şirketlerinizi görüntüleyin, ekleyin ve yönetin</p>
            </div>
            <button className="add-company-btn">
              <FaPlusCircle /> Yeni Şirket Ekle
            </button>
          </div>
        </motion.div>

        <motion.div 
          className="search-filter-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Şirket ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-box">
            <FaFilter />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="approved">Onaylanmış</option>
              <option value="pending">Onay Bekleyen</option>
              <option value="rejected">Reddedilmiş</option>
            </select>
          </div>

          <div className="filter-box">
            <FaFilter />
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
            >
              <option value="">Tüm Sektörler</option>
              <option value="Teknoloji">Teknoloji</option>
              <option value="Finans">Finans</option>
              <option value="Sağlık">Sağlık</option>
              <option value="Eğitim">Eğitim</option>
              <option value="Üretim">Üretim</option>
            </select>
          </div>
        </motion.div>

        <motion.div 
          className="company-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredCompanies.map((company) => (
            <motion.div 
              key={company.id} 
              className="company-card"
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="company-logo">
                <span>{company.name.charAt(0)}</span>
              </div>
              <div className="company-name">
                <h3>{company.name}</h3>
                <div className={`status-badge ${company.status}`}>
                  {getStatusIcon(company.status)}
                  <span>{getStatusText(company.status)}</span>
                </div>
              </div>
              
              <div className="company-info">
                <div className="info-item">
                  <span className="info-label">E-posta</span>
                  <span className="info-value">{company.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Telefon</span>
                  <span className="info-value">{company.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Sektör</span>
                  <span className="info-value">{company.sector}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Çalışan Sayısı</span>
                  <span className="info-value">{company.employeeCount}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Kayıt Tarihi</span>
                  <span className="info-value">{formatDate(company.createdAt)}</span>
                </div>
              </div>
              
              {company.status === 'pending' && (
                <div className="company-actions">
                  <button className="action-button approve">
                    <FaCheckCircle /> Onayla
                  </button>
                  <button className="action-button reject">
                    <FaTimesCircle /> Reddet
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyPage;