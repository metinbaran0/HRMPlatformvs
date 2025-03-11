import React, { useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaCalendar, FaUser } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import {
  fetchPendingLeavesForManagerAsync,
  approveLeaveByManagerAsync,
  rejectLeaveByManagerAsync
} from "../../store/feature/LeaveSlice";
import swal from "sweetalert";
import "./PendingLeaveRequests.css";
import { ThunkDispatch } from "redux-thunk"; // ThunkDispatch'i import et

const PendingLeaveRequests: React.FC = () => {
  const dispatch = useDispatch<ThunkDispatch<RootState, void, any>>();  // ThunkDispatch tipi ekleyin
  const { pendingLeaveRequests, loading, error } = useSelector((state: RootState) => state.leave);

  useEffect(() => {
    dispatch(fetchPendingLeavesForManagerAsync());
  }, [dispatch]);


  const handleApprove = (id: string) => {
    dispatch(approveLeaveByManagerAsync(parseInt(id))) // String'i number'a dönüştürüyoruz
      .then(() => dispatch(fetchPendingLeavesForManagerAsync()));
  };

  const handleReject = (id: string) => {
    swal({
      title: "İzin talebini reddetmek istediğinizden emin misiniz?",
      text: "Bu işlemi geri alamazsınız!",
      icon: "warning",
      buttons: ["İptal", "Evet, Reddet"],
      dangerMode: true,
    }).then((willDelete) => {

      if (willDelete) {
        dispatch(rejectLeaveByManagerAsync(parseInt(id))) // String'i number'a dönüştürüyoruz
          .then(() => dispatch(fetchPendingLeavesForManagerAsync()));

      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="pending-leaves-container">
      <div className="pending-header">
        <h2>Onay Bekleyen İzin Talepleri</h2>
        <div className="pending-stats">
          <div className="stat-box">
            <span className="stat-number">{pendingLeaveRequests.length}</span>
            <span className="stat-label">Bekleyen Talepler</span>
          </div>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="pending-grid">
        {pendingLeaveRequests.map((request) => (
          <div key={request.id} className="pending-card">
            <div className="card-header">
              <FaUser className="user-icon" />
              <h3>{request.employeeName || "Bilinmeyen Çalışan"}</h3> {/* Varsayılan değer ekleyin */}
            </div>

            <div className="card-content">
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <span>
                  {request.type || "Bilinmeyen İzin Tipi"} ({new Date(request.startDate).toLocaleDateString("tr-TR")} - 
                  {new Date(request.endDate).toLocaleDateString("tr-TR")})
                </span>
              </div>
            </div>

            <div className="card-actions">
              <button className="action-button approve" onClick={() => handleApprove(request.id.toString())}>
                <FaCheckCircle /> Onayla
              </button>
              <button className="action-button reject" onClick={() => handleReject(request.id.toString())}>
                <FaTimesCircle /> Reddet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingLeaveRequests;
