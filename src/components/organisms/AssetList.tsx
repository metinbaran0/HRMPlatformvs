import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssetsAsync, deleteAssetAsync } from '../../store/feature/AssetSlice';
import { AppDispatch } from '../../store/index';

const AssetList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { assets, loading, error } = useSelector((state: any) => state.assets);

  useEffect(() => {
    dispatch(fetchAssetsAsync());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteAssetAsync(id));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="asset-list">
      <h2>Tüm Zimmetler</h2>
      <ul>
        {assets.map((asset: any) => (
          <li key={asset.id}>
            <div>
              <h4>{asset.assetName}</h4>
              <p>Tür: {asset.assetType}</p>
              <p>Seri Numarası: {asset.serialNumber}</p>
              <p>Atanma Tarihi: {asset.assignedDate}</p>
              <p>İade Tarihi: {asset.returnDate || "Belirtilmemiş"}</p>
              <button onClick={() => handleDelete(asset.id)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetList;
