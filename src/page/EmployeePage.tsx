import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter, FaUsers, FaUserTie, FaUserClock, FaUserCheck, FaHome, FaBuilding, FaUserCircle, FaCalendarAlt, FaClock, FaExchangeAlt, FaBoxOpen, FaMoneyBillWave, FaCalendarCheck } from 'react-icons/fa';
import EmployeeTable from '../components/organisms/EmployeeTable';
import EmployeeModal from '../components/organisms/EmployeeModal';
import './EmployeePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  fetchEmployees, 
  deleteEmployee, 
  toggleEmployeeStatus,
  createEmployeeThunk,
  updateEmployeeThunk,

} from '../store/feature/employeeSlice';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: number;
  companyId: number;
  avatar: string | null;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

const EmployeePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, loading, error } = useSelector((state: RootState) => state.employee);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [activeSection, setActiveSection] = useState('all'); // Aktif sol menü seçeneği
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const navigate = useNavigate();

  // Sayfa yüklendiğinde çalışanları getir
  useEffect(() => {
    dispatch(fetchEmployees({}));
  }, [dispatch]);

  // Modal işlemleri
  const handleAddNew = () => {
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await dispatch(toggleEmployeeStatus(id)).unwrap();
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (selectedEmployee) {
        // Güncelleme işlemi
        const employeeData = {
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          position: data.position
        };
        
        await dispatch(updateEmployeeThunk({ 
          id: selectedEmployee.id, 
          employeeData 
        })).unwrap();
      } else {
        // Yeni çalışan ekleme işlemi
        const employeeData = {
          companyId: 1, // Varsayılan şirket ID'si veya state'ten alınabilir
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          position: data.position
        };
        
        await dispatch(createEmployeeThunk(employeeData)).unwrap();
      }
      
      setShowModal(false);
      // Başarılı olduğunda listeyi yenile
      dispatch(fetchEmployees({}));
    } catch (error) {
      console.error('Çalışan işlemi hatası:', error);
    }
  };

  // Filtreleme işlemi
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      employee.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment ? employee.position === filterDepartment : true;
    
    // Sol menü filtreleme
    if (activeSection === 'all') return matchesSearch && matchesDepartment;
    if (activeSection === 'active') return matchesSearch && matchesDepartment && employee.active;
    if (activeSection === 'inactive') return matchesSearch && matchesDepartment && !employee.active;
    
    return matchesSearch && matchesDepartment;
  });

  const handleAddClick = () => {
    setEditingEmployee(null);
    setShowModal(true);
  };
  
  const handleEditClick = (employee: any) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };
  
  const handleDeleteClick = (id: number) => {
    if (window.confirm('Bu çalışanı silmek istediğinizden emin misiniz?')) {
      dispatch(deleteEmployee(id));
    }
  };
  
  const handleToggleStatus = (id: number) => {
    dispatch(toggleEmployeeStatus(id));
  };
  
  const handleSubmit = (employeeData: any) => {
    if (editingEmployee) {
      dispatch(updateEmployeeThunk({ id: editingEmployee.id, ...employeeData }));
    } else {
      dispatch(createEmployeeThunk(employeeData));
    }
    setShowModal(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Loading durumunu kontrol et
  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  // Hata durumunu kontrol et
  if (error) {
    return <div>Hata: {error}</div>;
  }

  return (
    <div className="employee-page">
      {/* Sol Menü */}
      <div className="employee-sidebar">
        <div className="sidebar-header">
          <h2>İK Yönetimi</h2>
        </div>
        <div className="sidebar-menu">
          <div className="menu-item" onClick={() => handleNavigation('/')}>
            <FaHome className="menu-icon" />
            <span>Ana Sayfa</span>
          </div>
          <div className="menu-item active" onClick={() => handleNavigation('/employee')}>
            <FaUsers className="menu-icon" />
            <span>Çalışanlar</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/company')}>
            <FaBuilding className="menu-icon" />
            <span>Şirketler</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/profile')}>
            <FaUserCircle className="menu-icon" />
            <span>Profil</span>
          </div>
          
          {/* Vardiya Yönetimi Menü Öğeleri */}
          <div className="menu-section">
            <h3>Vardiya Yönetimi</h3>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/shift')}>
            <FaCalendarAlt className="menu-icon" />
            <span>Vardiyalar</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/shift/molalar')}>
            <FaClock className="menu-icon" />
            <span>Molalar</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/shift/atamalar')}>
            <FaExchangeAlt className="menu-icon" />
            <span>Vardiya Atamaları</span>
          </div>
          
          {/* Yeni Menü Bölümü */}
          <div className="menu-section">
            <h3>Diğer İşlemler</h3>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/assets')}>
            <FaBoxOpen className="menu-icon" />
            <span>Demirbaşlar</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/expenses')}>
            <FaMoneyBillWave className="menu-icon" />
            <span>Harcamalar</span>
          </div>
          <div className="menu-item" onClick={() => handleNavigation('/leave-requests')}>
            <FaCalendarCheck className="menu-icon" />
            <span>İzin Talepleri</span>
          </div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="employee-content">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="header-title">
            <h1><FaUsers /> Çalışan Yönetimi</h1>
            <p>Çalışanlarınızı görüntüleyin, ekleyin, düzenleyin ve yönetin</p>
          </div>
          <button className="add-button" onClick={handleAddClick}>
            <FaUserPlus /> Yeni Çalışan Ekle
          </button>
        </motion.div>

        <motion.div 
          className="search-filter-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="search-box">
            <FaSearch />
            <input
              type="text"
              placeholder="Çalışan ara..."
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
              <option value="all">Tüm Çalışanlar</option>
              <option value="active">Aktif Çalışanlar</option>
              <option value="inactive">Pasif Çalışanlar</option>
            </select>
          </div>
        </motion.div>

        <div className="filter-box">
          <FaFilter />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="">Tüm Departmanlar</option>
            <option value="IT">IT</option>
            <option value="İK">İK</option>
            <option value="Finans">Finans</option>
            <option value="Pazarlama">Pazarlama</option>
          </select>
        </div>

        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onToggleStatus={handleToggleStatus}
        />

        <EmployeeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          employee={editingEmployee}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EmployeePage;