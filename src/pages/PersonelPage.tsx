import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSearch, FaFilter } from 'react-icons/fa';
import PersonelTable from '../components/organisms/PersonelTable';
import PersonelModal from '../components/organisms/PersonelModal';
import './PersonelPage.css';

interface Personel {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  departman: string;
  pozisyon: string;
  isActive: boolean;
  baslangicTarihi: string;
}

const PersonelPage = () => {
  const [personeller, setPersoneller] = useState<Personel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPersonel, setSelectedPersonel] = useState<Personel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartman, setFilterDepartman] = useState('');

  // Modal işlemleri
  const handleAddNew = () => {
    setSelectedPersonel(null);
    setShowModal(true);
  };

  const handleEdit = (personel: Personel) => {
    setSelectedPersonel(personel);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    // API çağrısı yapılacak
    try {
      // await RestApis.deletePersonel(id);
      setPersoneller(personeller.filter(p => p.id !== id));
    } catch (error) {
      console.error('Silme hatası:', error);
    }
  };

  const handleToggleActive = async (id: number) => {
    // API çağrısı yapılacak
    try {
      const updatedPersoneller = personeller.map(p => 
        p.id === id ? { ...p, isActive: !p.isActive } : p
      );
      setPersoneller(updatedPersoneller);
    } catch (error) {
      console.error('Durum değiştirme hatası:', error);
    }
  };

  return (
    <div className="personel-page">
      <motion.div 
        className="page-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Personel Yönetimi</h1>
        <button className="add-button" onClick={handleAddNew}>
          <FaUserPlus /> Yeni Personel Ekle
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
            placeholder="Personel ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FaFilter />
          <select
            value={filterDepartman}
            onChange={(e) => setFilterDepartman(e.target.value)}
          >
            <option value="">Tüm Departmanlar</option>
            <option value="IT">IT</option>
            <option value="İK">İK</option>
            <option value="Finans">Finans</option>
            <option value="Pazarlama">Pazarlama</option>
          </select>
        </div>
      </motion.div>

      <PersonelTable
        personeller={personeller}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleActive={handleToggleActive}
      />

      <PersonelModal
        show={showModal}
        onHide={() => setShowModal(false)}
        personel={selectedPersonel}
        onSave={(data) => {
          // API çağrısı yapılacak
          console.log('Kaydedilen data:', data);
          setShowModal(false);
        }}
      />
    </div>
  );
};

export default PersonelPage; 