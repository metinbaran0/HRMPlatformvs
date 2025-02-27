import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FaReact, FaUsers, FaMoneyBillWave, FaChartLine, FaUserCheck, FaClock, FaCreditCard } from "react-icons/fa";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/feature/userSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <svg 
            width="40" 
            height="40" 
            viewBox="0 0 40 40" 
            className="d-inline-block align-top"
            style={{ marginRight: '10px' }}
          >
            {/* Dış çerçeve - mevsim döngüsü */}
            <circle cx="20" cy="20" r="19" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
            
            {/* İlkbahar - Sağ üst çeyrek - Daha pastel yeşil */}
            <path 
              d="M20 1A19 19 0 0 1 39 20" 
              fill="none" 
              stroke="#BBF7D0" 
              strokeWidth="2"
            />
            <path 
              d="M28 12c0,0 2,-3 0,-5s-5,0 -5,0" 
              fill="none" 
              stroke="#86EFAC" 
              strokeWidth="1.5"
            />
            
            {/* Yaz - Sağ alt çeyrek - Daha pastel sarı/turuncu */}
            <path 
              d="M39 20A19 19 0 0 1 20 39" 
              fill="none" 
              stroke="#FDE68A" 
              strokeWidth="2"
            />
            <circle cx="30" cy="25" r="3" fill="#FEF08A"/>
            
            {/* Sonbahar - Sol alt çeyrek - Daha pastel turuncu */}
            <path 
              d="M20 39A19 19 0 0 1 1 20" 
              fill="none" 
              stroke="#FDBA74" 
              strokeWidth="2"
            />
            <path 
              d="M12 28c-2,2 -1,4 0,5s4,0 5,-2" 
              fill="none" 
              stroke="#FED7AA" 
              strokeWidth="1.5"
            />
            
            {/* Kış - Sol üst çeyrek - Daha pastel mavi */}
            <path 
              d="M1 20A19 19 0 0 1 20 1" 
              fill="none" 
              stroke="#BAE6FD" 
              strokeWidth="2"
            />
            <path 
              d="M10 12l2,2l-2,2M8 14l6,0" 
              fill="none" 
              stroke="#E0F2FE" 
              strokeWidth="1.5"
            />
            
            {/* Merkezdeki insan silueti - Daha yumuşak gri */}
            <path 
              d="M20,12 C18,12 16,14 16,16 C16,18 18,19 20,19 C22,19 24,18 24,16 C24,14 22,12 20,12Z" 
              fill="#94A3B8"
            />
            <path 
              d="M16,19 C14,20 13,22 13,24 C13,26 15,28 20,28 C25,28 27,26 27,24 C27,22 26,20 24,19" 
              fill="#94A3B8"
            />
            
            {/* Doğaya uzanan eller - Daha yumuşak gri */}
            <path 
              d="M15,16 C12,14 10,15 8,17M25,16 C28,14 30,15 32,17" 
              fill="none" 
              stroke="#94A3B8" 
              strokeWidth="1.5"
            />
          </svg>
          <span style={{ 
            marginLeft: '8px', 
            fontSize: '1.25rem', 
            fontWeight: 600, 
            background: 'linear-gradient(135deg, #BAE6FD, #BBF7D0, #FDBA74, #E0F2FE)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Mevsim İK
          </span>
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
          <div className="nav-buttons">
            {!isAuthenticated ? (
              <>
                <button 
                  className="btn me-2" 
                  onClick={() => navigate('/get-quote')}
                  style={{
                    backgroundColor: '#0D47A1',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Teklif Al
                </button>
                <button 
                  className="btn" 
                  onClick={() => navigate('/login')}
                  style={{
                    backgroundColor: '#0D47A1',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Giriş Yap
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn me-2" 
                  onClick={() => navigate('/profile')}
                  style={{
                    backgroundColor: '#0D47A1',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Profilim
                </button>
                <button 
                  className="btn" 
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#0D47A1',
                    color: 'white',
                    border: 'none'
                  }}
                >
                  Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
