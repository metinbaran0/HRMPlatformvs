import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaReact, FaUsers, FaMoneyBillWave, FaChartLine, FaUserCheck, FaClock, FaCreditCard } from "react-icons/fa";
import "./Navbar.css";
import { useNavigate } from "react-router";

function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-lg sticky-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <FaReact size={30} className="d-inline-block align-top" />
          <span className="ms-2">İK Platform</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Dropdown Menü */}
            <li className="nav-item dropdown me-4">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown1"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Uygulamalar
              </a>
              <ul className="dropdown-menu custom-dropdown" aria-labelledby="navbarDropdown1">
                <div className="dropdown-grid">
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaUsers className="dropdown-icon" />
                      <span>Personel Yönetimi</span>
                      <small>Çalışan bilgilerini yönet</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaMoneyBillWave className="dropdown-icon" />
                      <span>Bordro Yönetimi</span>
                      <small>Maaş ve ödemeleri takip et</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaChartLine className="dropdown-icon" />
                      <span>Performans Yönetimi</span>
                      <small>Çalışan değerlendirmeleri yap</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaUserCheck className="dropdown-icon" />
                      <span>İşe Alım ve Aday Takip</span>
                      <small>Yeni adayları değerlendir</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaClock className="dropdown-icon" />
                      <span>Vardiya Yönetimi</span>
                      <small>Çalışma saatlerini düzenle</small>
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      <FaCreditCard className="dropdown-icon" />
                      <span>Ücret Yönetimi</span>
                      <small>Prim ve yan hakları belirle</small>
                    </a>
                  </li>
                </div>
              </ul>
            </li>

            {/* Diğer Bağlantılar */}
            <li className="nav-item me-4"><a className="nav-link" href="#">Kullanıcı Yorumları</a></li>
            <li className="nav-item me-4"><a className="nav-link" href="#">Hakkımızda</a></li>
          </ul>

          {/* Butonlar */}
          <div className="d-flex me-4">
            <button className="btn btn-primary me-2" type="button">Teklif Al</button>
            <button className="btn btn-outline-secondary" onClick={()=>navigate("/login")} type="button">Giriş Yap</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
