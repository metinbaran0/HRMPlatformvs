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
  onSave: (data: any) => void;
}

interface Company {
  id: number;
  name: string;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({
  show,
  onHide,
  employee,
  onSave
}) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [position, setPosition] = useState('');
  const [companyId, setCompanyId] = useState<number>(0);
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    if (employee) {
      setName(employee.name);
      setSurname(employee.surname);
      setEmail(employee.email);
      setPhone(employee.phone);
      setPosition(employee.position);
      setCompanyId(employee.companyId);
    } else {
      setName('');
      setSurname('');
      setEmail('');
      setPhone('');
      setPosition('');
      setCompanyId(0);
    }
  }, [employee]);

  useEffect(() => {
    const fetchCompanies = async () => {
      //const response = await fetch('http://localhost:8080/api/companies'); // Backend endpoint'i
      //const data = await response.json();
      //setCompanies(data);
      setCompanies([{ id: 1, name: 'Company A' }, { id: 2, name: 'Company B' }]);
    };

    fetchCompanies();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      companyId: Number(companyId),
      name,
      surname,
      email,
      phone,
      position,
    };

    onSave(formData);
    onHide();
  };

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onHide={onHide} className="employee-modal">
      <Modal.Header closeButton>
        <Modal.Title>{employee ? 'Çalışan Düzenle' : 'Yeni Çalışan Ekle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="companyId">Şirket:</label>
            <select
              id="companyId"
              value={companyId}
              onChange={(e) => setCompanyId(Number(e.target.value))}
              required
            >
              <option value="">Şirket Seçin</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="name">Ad:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="surname">Soyad:</label>
            <input
              type="text"
              id="surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon:</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Pozisyon:</label>
            <input
              type="text"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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