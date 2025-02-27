import React from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import './PersonelTable.css';

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

interface PersonelTableProps {
  personeller: Personel[];
  onEdit: (personel: Personel) => void;
  onDelete: (id: number) => void;
  onToggleActive: (id: number) => void;
}

const PersonelTable: React.FC<PersonelTableProps> = ({
  personeller,
  onEdit,
  onDelete,
  onToggleActive
}) => {
  return (
    <div className="table-container">
      <table className="personel-table">
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Email</th>
            <th>Telefon</th>
            <th>Departman</th>
            <th>Pozisyon</th>
            <th>Başlangıç</th>
            <th>Durum</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {personeller.map((personel) => (
            <motion.tr
              key={personel.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td>{`${personel.ad} ${personel.soyad}`}</td>
              <td>{personel.email}</td>
              <td>{personel.telefon}</td>
              <td>{personel.departman}</td>
              <td>{personel.pozisyon}</td>
              <td>{personel.baslangicTarihi}</td>
              <td>
                <button
                  className={`status-button ${personel.isActive ? 'active' : 'inactive'}`}
                  onClick={() => onToggleActive(personel.id)}
                >
                  {personel.isActive ? <FaToggleOn /> : <FaToggleOff />}
                  {personel.isActive ? 'Aktif' : 'Pasif'}
                </button>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(personel)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(personel.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PersonelTable; 