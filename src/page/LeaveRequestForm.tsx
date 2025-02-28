import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addLeaveRequestAsync } from '../store/feature/LeaveSlice';
import Swal from 'sweetalert2';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

const LeaveRequestForm: React.FC = () => {
  const dispatch: ThunkDispatch<{}, {}, AnyAction> = useDispatch();
  const [formData, setFormData] = useState({
    employeeId: '',
    type: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'employeeId' ? Number(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form verilerini kontrol et
    if (!formData.employeeId || !formData.type || !formData.startDate || !formData.endDate || !formData.description) {
      Swal.fire('Hata!', 'Lütfen tüm alanları doldurun.', 'error');
      return;
    }

    const resultAction = await dispatch(addLeaveRequestAsync({
      ...formData,
      employeeId: Number(formData.employeeId),
    }));

    // Hata kontrolü
    if (addLeaveRequestAsync.fulfilled.match(resultAction)) {
      Swal.fire('Başarılı!', 'İzin talebiniz başarıyla oluşturuldu.', 'success');
    } else {
      console.error('Hata:', resultAction.payload); // Hata mesajını konsola yazdır
      Swal.fire('Hata!', resultAction.payload as string, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" name="employeeId" placeholder="Çalışan ID" onChange={handleChange} required />
      <select name="type" onChange={handleChange} required>
        <option value="">İzin Türü Seçin</option>
        <option value="ANNUAL">Yıllık İzin</option>
        <option value="MARRIAGE">Evlilik İzni</option>
        <option value="MATERNITY">Doğum İzni</option>
        <option value="UNPAID">Ücretsiz İzin</option>
      </select>
      <input type="date" name="startDate" onChange={handleChange} required />
      <input type="date" name="endDate" onChange={handleChange} required />
      <textarea name="description" placeholder="Açıklama" onChange={handleChange} required></textarea>
      <button type="submit">İzin Talebi Oluştur</button>
    </form>
  );
};

export default LeaveRequestForm; 