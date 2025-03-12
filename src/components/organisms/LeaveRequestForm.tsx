import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createLeaveRequestAsync } from "../../store/feature/LeaveSlice";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import Swal from "sweetalert2";
import "./LeaveRequestForm.css";

// Props tipini tanımla
interface LeaveRequestFormProps {
  onClose?: () => void;
}

// Props'u bileşene geçir
const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("ANNUAL"); // Varsayılan izin tipi
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Tarih formatını backend'in beklediği formata dönüştür (YYYY-MM-DD)
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      // İzin talebi oluştur
      await dispatch(createLeaveRequestAsync({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        leaveType: leaveType,
        reason: reason
      })).unwrap();

      // Başarılı mesajı göster
      Swal.fire({
        icon: "success",
        title: "Başarılı!",
        text: "İzin talebiniz başarıyla oluşturuldu.",
        timer: 2000,
        showConfirmButton: false
      });

      // Formu sıfırla
      setStartDate("");
      setEndDate("");
      setLeaveType("ANNUAL");
      setReason("");

      // Başarılı olduğunda onClose'u çağır
      if (onClose) onClose();
    } catch (error: any) {
      // Hata mesajı göster
      Swal.fire({
        icon: "error",
        title: "Hata!",
        text: error || "İzin talebi oluşturulurken bir hata oluştu."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leave-request-form-container">
      <h2>Yeni İzin Talebi</h2>
      <form onSubmit={handleSubmit} className="leave-request-form">
        <div className="form-group">
          <label htmlFor="leaveType">
            <FaClipboardList className="input-icon" />
            İzin Türü
          </label>
          <select
            id="leaveType"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            required
          >
            <option value="ANNUAL">Yıllık İzin</option>
            <option value="MARRIAGE">Evlilik İzni</option>
            <option value="MATERNITY">Doğum İzni</option>
            <option value="UNPAID">Ücretsiz İzin</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="startDate">
            <FaCalendarAlt className="input-icon" />
            Başlangıç Tarihi
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]} // Bugünden önceki tarihleri seçmeyi engelle
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endDate">
            <FaCalendarAlt className="input-icon" />
            Bitiş Tarihi
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || new Date().toISOString().split('T')[0]} // Başlangıç tarihinden önceki tarihleri seçmeyi engelle
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reason">
            <FaClipboardList className="input-icon" />
            İzin Nedeni
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="İzin talebinizin nedenini açıklayın..."
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Gönderiliyor..." : "İzin Talebi Oluştur"}
        </button>
      </form>
    </div>
  );
};

export default LeaveRequestForm;
