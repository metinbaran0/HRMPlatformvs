import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './PersonelModal.css';

interface PersonelModalProps {
  show: boolean;
  onHide: () => void;
  personel: {
    id: number;
    ad: string;
    soyad: string;
    email: string;
    telefon: string;
    departman: string;
    pozisyon: string;
    isActive: boolean;
    baslangicTarihi: string;
  } | null;
  onSave: (data: PersonelData) => void;
}

interface PersonelData {
  id?: number;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  departman: string;
  pozisyon: string;
  baslangicTarihi: string;
}

const PersonelModal: React.FC<PersonelModalProps> = ({
  show,
  onHide,
  personel,
  onSave
}) => {
  const [formData, setFormData] = useState<PersonelData>({
    ad: '',
    soyad: '',
    email: '',
    telefon: '',
    departman: '',
    pozisyon: '',
    baslangicTarihi: ''
  });

  useEffect(() => {
    if (personel) {
      setFormData({
        ad: personel.ad,
        soyad: personel.soyad,
        email: personel.email,
        telefon: personel.telefon,
        departman: personel.departman,
        pozisyon: personel.pozisyon,
        baslangicTarihi: personel.baslangicTarihi
      });
    } else {
      setFormData({
        ad: '',
        soyad: '',
        email: '',
        telefon: '',
        departman: '',
        pozisyon: '',
        baslangicTarihi: ''
      });
    }
  }, [personel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered className="personel-modal">
      <Modal.Header closeButton>
        <Modal.Title>{personel ? 'Personel Düzenle' : 'Yeni Personel Ekle'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Ad</label>
            <input
              type="text"
              name="ad"
              value={formData.ad}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Soyad</label>
            <input
              type="text"
              name="soyad"
              value={formData.soyad}
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
              name="telefon"
              value={formData.telefon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Departman</label>
            <select
              name="departman"
              value={formData.departman}
              onChange={handleChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="IT">IT</option>
              <option value="İK">İK</option>
              <option value="Finans">Finans</option>
              <option value="Pazarlama">Pazarlama</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pozisyon</label>
            <input
              type="text"
              name="pozisyon"
              value={formData.pozisyon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Başlangıç Tarihi</label>
            <input
              type="date"
              name="baslangicTarihi"
              value={formData.baslangicTarihi}
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

export default PersonelModal; 