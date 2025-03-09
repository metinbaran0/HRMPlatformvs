import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import "./Sidebar.css";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "☰" : "☰"} {/* Toggle icon */}
      </button>

      {isOpen && (
        <div className="sidebar-header">
          <h2>Mevsim İK</h2>
        </div>
      )}

      {/* Arama Çubuğu */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Şirket veya Yönetici Ara"
          className="search-input"
        />
        <button className="search-btn">
          <FaSearch />
        </button>
      </div>

      {/* Kullanıcı Avatarı ve Profil Menüsü */}
      <div className="avatar-section">
        <FaUserCircle size={40} className="avatar-icon" />
        <div className="user-info">
          <span className="user-name">Admin</span>
          <div className="profile-dropdown">
            <button
              className="dropdown-toggle"
              onClick={toggleProfileMenu}
            >
              Profilim
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown open">
                <button onClick={() => navigate("/profile")}>Profil Sayfası</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menü Linkleri */}
      <nav>
        <ul>
          <li
            className={activeSection === "dashboard" ? "active" : ""}
            onClick={() => setActiveSection("dashboard")}
          >
            AnaSayfa
          </li>
          <li
            className={activeSection === "companies" ? "active" : ""}
            onClick={() => setActiveSection("companies")}
          >
            Tüm Şirketler
          </li>
          <li
            className={activeSection === "pending" ? "active" : ""}
            onClick={() => setActiveSection("pending")}
          >
            Onay Bekleyenler
          </li>
        </ul>
      </nav>

      {/* Çıkış Butonu */}
      {isOpen && (
        <button className="logout" onClick={handleLogout}>
          Çıkış Yap
        </button>
      )}
    </div>
  );
};

export default Sidebar;
