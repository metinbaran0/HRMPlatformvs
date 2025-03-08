import React, { useState, useEffect } from "react";
import { FaCheckCircle, FaTimesCircle, FaBuilding, FaEnvelope, FaPhone, FaUsers, FaCalendar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import swal from "sweetalert";  // SweetAlert kütüphanesi eklenmeli
import "./PendingCompanies.css";

interface PendingCompany {
  id: number;
  name: string;
  email: string;
  phone: string;
  sector: string;
  employeeCount: number;
  createdAt: string;
  emailVerified: boolean;
}

const PendingCompanies: React.FC = () => {
  const [pendingCompanies, setPendingCompanies] = useState<PendingCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const token = useSelector<RootState>((s) => s.user.token);

  const fetchPendingCompanies = () => {
    fetch("http://localhost:9090/v1/api/company/pending-company", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setPendingCompanies(data.data);
        } else {
          setErrorMessage("Veriler alınırken bir hata oluştu.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pending companies:", error);
        setLoading(false);
        setErrorMessage("Şirket verileri alınırken bir hata oluştu.");
      });
  };

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const handleApprove = async (id: number, emailVerified: boolean) => {
    if (!emailVerified) {
      swal("Uyarı!", "Bu şirket mail doğrulaması yapmadı. Onay verilemez.", "warning");
      return;
    }
  
    swal({
      title: "Şirketi Onaylamak İstediğinize Emin misiniz?",
      text: "Bu işlem sonucunda şirket aktif hale gelecektir.",
      icon: "info",
      buttons: ["İptal", "Evet, Onayla"],
    }).then(async (willApprove) => {
      if (willApprove) {
        try {
          const response = await fetch(`http://localhost:9090/v1/api/company/approve-company/${id}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          });
  
          const data = await response.json();
          if (data.success) {
            swal("Başarılı!", "Şirket başarıyla onaylandı.", "success");
            fetchPendingCompanies(); // Listeyi güncelle
          } else {
            swal("Hata!", "Şirket onaylanamadı. Lütfen tekrar deneyin.", "error");
          }
        } catch (error) {
          console.error("Şirket onaylanırken bir hata oluştu:", error);
          swal("Bir hata oluştu!", "Lütfen tekrar deneyin.", "error");
        }
      }
    });
  };
  

  const handleReject = (id: number, emailVerified: boolean) => {
    swal({
      title: "Şirketi Reddetmek İstediğinize Emin misiniz?",
      text: "Bu işlemi geri alamazsınız!",
      icon: "warning",
      buttons: ["İptal", "Evet, Reddet"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        fetch(`http://localhost:9090/v1/api/company/reject-company/${id}`, {
          method: "PUT",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              swal("Şirket başarıyla reddedildi!", { icon: "success" });
              fetchPendingCompanies(); // Sayfayı tekrar yükleyerek reddedilen şirketi listeden kaldır
            } else {
              swal("Şirket reddedilemedi. Lütfen tekrar deneyin.", { icon: "error" });
            }
          })
          .catch((error) => {
            console.error("Şirket reddedilirken bir hata oluştu:", error);
            swal("Bir hata oluştu. Lütfen tekrar deneyin.", { icon: "error" });
          });
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
    <div className="pending-companies-container">
      <div className="pending-header">
        <h2>Onay Bekleyen Şirketler</h2>
        <div className="pending-stats">
          <div className="stat-box">
            <span className="stat-number">{pendingCompanies.length}</span>
            <span className="stat-label">Bekleyen Başvuru</span>
          </div>
        </div>
      </div>

      {errorMessage && <div className="error">{errorMessage}</div>}

      <div className="pending-grid">
        {pendingCompanies.map((company) => (
          <div key={company.id} className="pending-card">
            <div className="card-header">
              <FaBuilding className="company-icon" />
              <h3>{company.name}</h3>
            </div>

            <div className="card-content">
              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <span>{company.email}</span>
              </div>
              <div className="info-item">
                <FaPhone className="info-icon" />
                <span>{company.phone}</span>
              </div>
              <div className="info-item">
                <FaUsers className="info-icon" />
                <span>{company.employeeCount} Çalışan</span>
              </div>
              <div className="info-item">
                <FaCalendar className="info-icon" />
                <span>{new Date(company.createdAt).toLocaleDateString("tr-TR")}</span>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="action-button approve"
                onClick={() => handleApprove(company.id, company.emailVerified)}
              >
                <FaCheckCircle /> Onayla
              </button>
              <button className="action-button reject" onClick={() => handleReject(company.id, company.emailVerified)}>
                <FaTimesCircle /> Reddet
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingCompanies;
