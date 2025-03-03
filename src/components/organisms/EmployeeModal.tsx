import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './EmployeeModal.css';

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

interface EmployeeModalProps {
  show: boolean;
  onHide: () => void;
  employee: Employee | null;
  onSave: (data: EmployeeData) => void;
}

interface EmployeeData {
  id?: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  show,
  onHide,
  employee,
  onSave
}) => {
  const [formData, setFormData] = useState<EmployeeData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    position: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        id: employee.id,
        name: employee.name,
        surname: employee.surname,
        email: employee.email,
        phone: employee.phone,
        position: employee.position
      });
    } else {
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        position: ''
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} className="employee-modal">
      <Modal.Header closeButton>
        <Modal.Title>{employee ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Soyad</label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Pozisyon</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onHide}>
              İptal
            </button>
            <button type="submit" className="save-button">
              Kaydet
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeModal; 