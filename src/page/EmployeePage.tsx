import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';
import EmployeeTable from '../components/organisms/EmployeeTable';
import EmployeeModal from '../components/organisms/EmployeeModal';
import './EmployeePage.css';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { 
  fetchEmployees, 
  deleteEmployee, 
  toggleEmployeeStatus 
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
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Çalışan Yönetimi</h1>
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
        employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <EmployeeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        employee={selectedEmployee}
        onSave={(data) => {
          console.log('Kaydedilen data:', data);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default EmployeePage; 