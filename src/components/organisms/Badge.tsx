import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


// Kullanıcı rolünü yöneten bir context (örnek)
const UserContext = React.createContext<{ role: string }>({ role: 'visitor' });

const Navbar: React.FC = () => {
  const { role } = useContext(UserContext); // Kullanıcı rolü context'ten alınır
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navbar menüsünü açma/kapama işlevi
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Navbar içerikleri
  const visitorLinks = (
    <>
      <Link to="/">Ana Sayfa</Link>
      <Link to="/about">Hakkında</Link>
      <Link to="/reviews">Kullanıcı Yorumları</Link>
      <Link to="/signup">Üye Ol</Link>
      <Link to="/login">Giriş Yap</Link>
    </>
  );

  const employeeLinks = (
    <>
      <Link to="/dashboard">Ana Sayfa</Link>
      <Link to="/calendar">Vardiya ve İzinler</Link>
      <Link to="/holidays">Resmi Tatiller</Link>
      <Link to="/profile">Profil</Link>
    </>
  );

  const managerLinks = (
    <>
      <Link to="/dashboard">Ana Sayfa</Link>
      <Link to="/employees">Çalışanlar</Link>
      <Link to="/birthdays">Yaklaşan Doğum Günleri</Link>
      <Link to="/holidays">Resmi Tatiller</Link>
      <Link to="/profile">Profil</Link>
    </>
  );

  const adminLinks = (
    <>
      <Link to="/dashboard">Ana Sayfa</Link>
      <Link to="/companies">Şirketler</Link>
      <Link to="/memberships">Üyelik Sonlandırma</Link>
      <Link to="/holidays">Resmi Tatiller</Link>
      <Link to="/profile">Profil</Link>
    </>
  );

  // Dinamik olarak hangi bağlantıların gösterileceğine karar verilir
  const getLinks = () => {
    switch (role) {
      case 'admin':
        return adminLinks;
      case 'manager':
        return managerLinks;
      case 'employee':
        return employeeLinks;
      default:
        return visitorLinks;
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Platform Logo</Link>
      </div>
      <div className="menu">
        {/* Desktop menüsü */}
        <div className="desktop-menu">
          {getLinks()}
        </div>
        {/* Mobil menü */}
        <div className="mobile-menu">
          <button onClick={toggleMobileMenu} className="hamburger-menu">
            ☰
          </button>
          {isMobileMenuOpen && (
            <div className="mobile-links">
              {getLinks()}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
