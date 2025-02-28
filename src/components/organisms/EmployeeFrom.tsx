import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index';
import { fetchEmployeeAsync } from '../../store/feature/EmployeeSlice';


const EmployeeForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const employee = useSelector((state: RootState) => state.employee.employee);
  const loading = useSelector((state: RootState) => state.employee.loading);
  const error = useSelector((state: RootState) => state.employee.error);

  useEffect(() => {
    // Burada employeeId'yi dinamik hale getirebilirsiniz
    const employeeId = 1; // Burada employeeId'yi dinamik olarak belirleyebilirsiniz (örneğin, route parametrelerinden alınabilir)
    dispatch(fetchEmployeeAsync(employeeId));
  }, [dispatch]);

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

  if (!employee) {
    return <div>Çalışan bilgileri bulunamadı.</div>;
  }

  return (
    <div className="employee-form">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={employee.avatar || '/default-avatar.png'} alt="Profil Fotoğrafı" />
        </div>
        <div className="profile-info">
          <h1>{employee.name} {employee.surname}</h1>
          <p>{employee.position}</p>
        </div>
      </div>

      <div className="profile-content">
        <section className="info-card">
          <h2>Kişisel Bilgiler</h2>
          <p>E-posta: {employee.email}</p>
          <p>Telefon: {employee.phone}</p>
          <p>Durum: {employee.status ? 'Aktif' : 'Pasif'}</p>
          <p>Oluşturulma Tarihi: {new Date(employee.createdAt).toLocaleString()}</p>
          <p>Güncellenme Tarihi: {new Date(employee.updatedAt).toLocaleString()}</p>
        </section>
      </div>
    </div>
  );
};

export default EmployeeForm;
