import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAssetAsync } from '../../store/feature/AssetSlice';  // Correct import
import { AppDispatch } from "../../store/index";
import './AssetForm.css';


interface AssetFormProps {
  onSubmit: (assetData: AssetDto) => void;
}

interface AssetDto {
  employeeId: number;
  assetName: string;
  assetType: string;
  serialNumber: string;
  assignedDate: string;
  returnDate?: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ onSubmit }) => {
  const [assetData, setAssetData] = useState<AssetDto>({
    employeeId: 1, // Dinamik hale getirilebilir
    assetName: '',
    assetType: '',
    serialNumber: '',
    assignedDate: '',
    returnDate: '',
  });

  const dispatch = useDispatch<AppDispatch>();  // dispatch hook

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addAssetAsync(assetData));  // Dispatch the action
  };

  return (
    <form onSubmit={handleSubmit} className="asset-form">
      <div className="form-group">
        <label htmlFor="assetName">Varlık Adı</label>
        <input type="text" id="assetName" name="assetName" value={assetData.assetName} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="assetType">Varlık Türü</label>
        <select id="assetType" name="assetType" value={assetData.assetType} onChange={handleChange} required>
          <option value="">Seçiniz</option>
          <option value="Laptop">Laptop</option>
          <option value="Telefon">Telefon</option>
          <option value="Araç">Araç</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="serialNumber">Seri Numarası</label>
        <input type="text" id="serialNumber" name="serialNumber" value={assetData.serialNumber} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="assignedDate">Zimmet Tarihi</label>
        <input type="date" id="assignedDate" name="assignedDate" value={assetData.assignedDate} onChange={handleChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="returnDate">İade Tarihi (Opsiyonel)</label>
        <input type="date" id="returnDate" name="returnDate" value={assetData.returnDate} onChange={handleChange} />
      </div>

      <button type="submit" className="submit-button">Zimmet Ekle</button>
    </form>
  );
};

export default AssetForm;
