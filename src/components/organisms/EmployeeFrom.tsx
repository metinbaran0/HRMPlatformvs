import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchEmployees } from '../../store/feature/employeeSlice';

const EmployeeForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  // employees array'inden ilk çalışanı al (veya null)
  const employee = useSelector((state: RootState) => state.employee.employees[0]);
  const loading = useSelector((state: RootState) => state.employee.loading);
  const error = useSelector((state: RootState) => state.employee.error);

  useEffect(() => {
    // Sayfalama parametreleriyle çağır
    dispatch(fetchEmployees({ page: 0, size: 1 }));
  }, [dispatch]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  if (!employee) {
    return <div>Çalışan bulunamadı.</div>;
  }

  return (
    <div>
      <h2>Çalışan Bilgileri</h2>
      <div>
        <p>Ad: {employee.firstName}</p>
        <p>Soyad: {employee.lastName}</p>
        <p>Email: {employee.email}</p>
        <p>Telefon: {employee.phone}</p>
        <p>Departman: {employee.department}</p>
        <p>Pozisyon: {employee.position}</p>
        <p>Durum: {employee.isActive ? 'Aktif' : 'Pasif'}</p>
        <p>Başlangıç Tarihi: {employee.startDate}</p>
      </div>
    </div>
  );
};

export default EmployeeForm;
