import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter, FaUsers, FaUserTie, FaUserClock, FaUserCheck } from 'react-icons/fa';
import EmployeeTable from '../components/organisms/EmployeeTable';
import EmployeeModal from '../components/organisms/EmployeeModal';
import PendingLeaveRequests from '../components/organisms/PendingLeaveRequests';  // Importing the new component
import './EmployeePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  fetchEmployees, 
  deleteEmployee, 
  toggleEmployeeStatus,
  createEmployeeThunk,
  updateEmployeeThunk
} from '../store/feature/employeeSlice';

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
          <h3>Çalışan Yönetimi</h3>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={activeSection === 'all' ? 'active' : ''} 
            onClick={() => setActiveSection('all')}
          >
            <FaUsers /> Tüm Çalışanlar
          </li>
          <li 
            className={activeSection === 'active' ? 'active' : ''} 
            onClick={() => setActiveSection('active')}
          >
            <FaUserCheck /> Aktif Çalışanlar
          </li>
          <li 
            className={activeSection === 'inactive' ? 'active' : ''} 
            onClick={() => setActiveSection('inactive')}
          >
            <FaUserClock /> Pasif Çalışanlar
          </li>
          <li 
            className={activeSection === 'management' ? 'active' : ''} 
            onClick={() => setActiveSection('management')}
          >
            <FaUserTie /> Yönetim
          </li>
        </ul>
        <button className="sidebar-add-button" onClick={handleAddNew}>
          <FaUserPlus /> Yeni Çalışan Ekle
        </button>
      </div>


      {/* Ana İçerik */}
      <div className="employee-content">
        <motion.div 
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Çalışan Listesi</h1>
          <button className="add-button" onClick={handleAddNew}>
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
        </motion.div>

        <EmployeeTable
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
        />

        <EmployeeModal
          show={showModal}
          onHide={() => setShowModal(false)}
          employee={selectedEmployee}
          onSave={handleSave}
        />
      </div>

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
      </motion.div>

      <EmployeeTable
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      {/* Add the PendingLeaveRequests component */}
      <PendingLeaveRequests />

      <EmployeeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        employee={selectedEmployee}
        onSave={handleSave}
      />

    </div>
  );
};

export default EmployeePage;
