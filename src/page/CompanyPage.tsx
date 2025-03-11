import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  fetchCompanies, 
  fetchPendingCompanies, 
  fetchAprovedCompanies,
  approveCompany,
  rejectCompany
} from '../store/feature/companySlice';
import { 
  FaBuilding, 
  FaSearch, 
  FaFilter, 
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import './CompanyPage.css';

const CompanyPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { companies, loading, error } = useSelector((state: RootState) => state.companies);
  const [pendingCompanies, setPendingCompanies] = useState<any[]>([]);
  const [approvedCompanies, setApprovedCompanies] = useState<any[]>([]);
  const [allCompanies, setAllCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSector, setFilterSector] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending' veya 'approved'

  useEffect(() => {
    // Tüm şirketleri getir
    dispatch(fetchCompanies())
      .unwrap()
      .then((data) => {
        setAllCompanies(data);
      })
      .catch((error) => {
        console.error("Tüm şirketler alınırken hata:", error);
      });
    
    // Onay bekleyen şirketleri getir
    const fetchPending = async () => {
      try {
        const response = await fetch("http://localhost:9090/v1/api/company/pending-company", {
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        });
        
        const data = await response.json();
        if (data.success) {
          setPendingCompanies(data.data);
        }
      } catch (error) {
        console.error("Onay bekleyen şirketler alınırken hata:", error);
      }
    };
    
    // Onaylanmış şirketleri getir - Redux thunk kullanarak
    dispatch(fetchAprovedCompanies())
      .unwrap()
      .then((data) => {
        setApprovedCompanies(data);
      })
      .catch((error) => {
        console.error("Onaylanmış şirketler alınırken hata:", error);
      });
    
    fetchPending();
  }, [dispatch]);

  // Filtreleme işlemi
  const filteredCompanies = allCompanies.filter(company => {
    const matchesSearch = company.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         company.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // Şirket onaylama işlemi
  const handleApproveCompany = (id: number) => {
    console.log('Onaylama butonuna tıklandı, ID:', id);
    dispatch(approveCompany(id))
      .unwrap()
      .then(() => {
        // Başarılı onaylama sonrası listeleri güncelle
        dispatch(fetchCompanies())
          .unwrap()
          .then((data) => {
            setAllCompanies(data);
          });
        
        dispatch(fetchAprovedCompanies())
          .unwrap()
          .then((data) => {
            setApprovedCompanies(data);
          });
        
        // Onay bekleyen şirketleri güncelle
        const updatedPendingCompanies = pendingCompanies.filter(company => company.id !== id);
        setPendingCompanies(updatedPendingCompanies);
        
        // Başarı mesajı göster
        alert("Şirket başarıyla onaylandı!");
      })
      .catch((error) => {
        console.error("Şirket onaylanırken hata:", error);
        alert("Şirket onaylanırken bir hata oluştu: " + error);
      });
  };
  
  // Şirket reddetme işlemi
  const handleRejectCompany = (id: number) => {
    console.log('Reddetme butonuna tıklandı, ID:', id);
    dispatch(rejectCompany(id))
      .unwrap()
      .then(() => {
        // Başarılı reddetme sonrası listeleri güncelle
        dispatch(fetchCompanies())
          .unwrap()
          .then((data) => {
            setAllCompanies(data);
          });
        
        // Onay bekleyen şirketleri güncelle
        const updatedPendingCompanies = pendingCompanies.filter(company => company.id !== id);
        setPendingCompanies(updatedPendingCompanies);
        
        // Başarı mesajı göster
        alert("Şirket başvurusu reddedildi!");
      })
      .catch((error) => {
        console.error("Şirket reddedilirken hata:", error);
        alert("Şirket reddedilirken bir hata oluştu: " + error);
      });
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
              <p>Şirketlerinizi görüntüleyin ve yönetin</p>
            </div>
          </div>
        </motion.div>

        {/* Tab Seçenekleri */}
        <div className="company-tabs">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tüm Şirketler
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
          >
            Onaylanmış Şirketler
            {approvedCompanies.length > 0 && (
              <span className="approved-badge">{approvedCompanies.length}</span>
            )}
          </button>
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Onay Bekleyen Şirketler
            {pendingCompanies.length > 0 && (
              <span className="pending-badge">{pendingCompanies.length}</span>
            )}
          </button>
        </div>

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
          {activeTab === 'all' ? (
            // Tüm şirketleri göster
            filteredCompanies.map((company) => (
              <motion.div 
                key={company.id} 
                className="company-card"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="company-logo">
                  <span>{company.name?.charAt(0)}</span>
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
              </motion.div>
            ))
          ) : activeTab === 'approved' ? (
            // Onaylanmış şirketleri göster
            approvedCompanies.map((company) => (
              <motion.div 
                key={company.id} 
                className="company-card"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="company-logo">
                  <span>{company.name?.charAt(0)}</span>
                </div>
                <div className="company-name">
                  <h3>{company.name}</h3>
                  <div className="status-badge approved">
                    <FaCheckCircle className="status-icon approved" />
                    <span>Onaylandı</span>
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
                    <span className="info-value">{company.employeeCount || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Onay Tarihi</span>
                    <span className="info-value">{formatDate(company.approvedAt || company.createdAt)}</span>
                  </div>
                </div>
                
                <div className="company-actions">
                  <button 
                    className="action-button view"
                    onClick={() => console.log('Şirket detayları:', company.id)}
                  >
                    Detayları Görüntüle
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            // Onay bekleyen şirketleri göster
            pendingCompanies.map((company) => (
              <motion.div 
                key={company.id} 
                className="company-card"
                whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="company-logo">
                  <span>{company.name?.charAt(0)}</span>
                </div>
                <div className="company-name">
                  <h3>{company.name}</h3>
                  <div className="status-badge pending">
                    <FaHourglassHalf className="status-icon pending" />
                    <span>Onay Bekliyor</span>
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
                    <span className="info-label">Başvuru Tarihi</span>
                    <span className="info-value">{formatDate(company.createdAt || company.applicationDate)}</span>
                  </div>
                </div>
                
                <div className="company-actions">
                  <button 
                    className="action-button approve"
                    onClick={() => handleApproveCompany(company.id)}
                  >
                    <FaCheckCircle /> Onayla
                  </button>
                  <button 
                    className="action-button reject"
                    onClick={() => handleRejectCompany(company.id)}
                  >
                    <FaTimesCircle /> Reddet
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyPage;