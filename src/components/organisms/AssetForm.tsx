import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAssetAsync, updateAssetAsync } from '../../store/feature/AssetSlice';  // Redux actions
import { AppDispatch } from "../../store/index";
import './AssetForm.css';

interface AssetFormProps {
  onSubmit: (assetData: AssetDto) => void;
  existingAsset?: AssetDto;  // For editing an existing asset
}

interface AssetDto {
  id?: number;
  employeeId: number;
  assetName: string;
  assetType: string;
  serialNumber: string;
  assignedDate: string;
  returnDate?: string;
}

const AssetForm: React.FC<AssetFormProps> = ({ onSubmit, existingAsset }) => {
  const [assetData, setAssetData] = useState<AssetDto>({
    employeeId: existingAsset?.employeeId || 1,
    assetName: existingAsset?.assetName || '',
    assetType: existingAsset?.assetType || '',
    serialNumber: existingAsset?.serialNumber || '',
    assignedDate: existingAsset?.assignedDate || '',
    returnDate: existingAsset?.returnDate || '',
  });
  const [error, setError] = useState<string | null>(null); // To handle errors

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAssetData({ ...assetData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingAsset && existingAsset.id !== undefined) {
      dispatch(updateAssetAsync({ id: existingAsset.id, updatedAssetData: assetData }));  // For editing
    } else {
      dispatch(addAssetAsync(assetData));  // For adding new asset
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="asset-form">
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="assetName">Varlık Adı</label>
        <input
          type="text"
          id="assetName"
          name="assetName"
          value={assetData.assetName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="assetType">Varlık Türü</label>
        <select
          id="assetType"
          name="assetType"
          value={assetData.assetType}
          onChange={handleChange}
          required
        >
          <option value="">Seçiniz</option>
          <option value="Laptop">Laptop</option>
          <option value="Telefon">Telefon</option>
          <option value="Araç">Araç</option>
          <option value="Diğer">Diğer</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="serialNumber">Seri Numarası</label>
        <input
          type="text"
          id="serialNumber"
          name="serialNumber"
          value={assetData.serialNumber}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="assignedDate">Zimmet Tarihi</label>
        <input
          type="date"
          id="assignedDate"
          name="assignedDate"
          value={assetData.assignedDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="returnDate">İade Tarihi (Opsiyonel)</label>
        <input
          type="date"
          id="returnDate"
          name="returnDate"
          value={assetData.returnDate}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="submit-button">
        {existingAsset ? "Zimmet Güncelle" : "Zimmet Ekle"}
      </button>
    </form>
  );
};

export default AssetForm;