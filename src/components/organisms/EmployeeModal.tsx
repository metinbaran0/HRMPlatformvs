import React, { useState, useEffect } from 'react';
import './EmployeeModal.css';

interface Employee {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  position: string;
  active?: boolean;
}

interface EmployeeModalProps {
  show: boolean;
  onHide: () => void;
  employee: Employee | null;
  onSave: (data: any) => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ show, onHide, employee, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    position: ''
  });

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || '',
        surname: employee.surname || '',
        email: employee.email || '',
        phone: employee.phone || '',
        position: employee.position || ''
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{employee ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</h2>
          <button className="close-button" onClick={onHide}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Ad</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Soyad</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Pozisyon</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onHide}>İptal</button>
            <button type="submit" className="save-button">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal; 