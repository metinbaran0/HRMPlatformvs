import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchEmployees } from '../../store/feature/EmployeeSlice';

const EmployeeForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // İlk çalışanı al (veya undefined olabilir)
  const employee = useSelector((state: RootState) => state.employee.employees[0]);
  const loading = useSelector((state: RootState) => state.employee.loading);
  const error = useSelector((state: RootState) => state.employee.error);

  useEffect(() => {
    dispatch(fetchEmployees({ page: 0, size: 1 }));
  }, [dispatch]);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;
  if (!employee) return <div>Çalışan bulunamadı.</div>;

  return (
    <div>
      <h2>Çalışan Bilgileri</h2>
      <div>
        <p>Ad: {employee.name} {employee.surname}</p>
        <p>Profil: {employee.avatar && 
          <img src={employee.avatar} alt="Profil Resmi" width={50} height={50} />
        }</p>
        <p>Email: {employee.email}</p>
        <p>Telefon: {employee.phone}</p>
        <p>Pozisyon: {employee.position ?? 'Bilinmiyor'}</p>
        <p>Durum: {employee.active ? 'Aktif' : 'Pasif'}</p>
        <p>Oluşturulma: {new Date(employee.createdAt).toLocaleDateString()}</p>
        <p>Güncelleme: {new Date(employee.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default EmployeeForm;
