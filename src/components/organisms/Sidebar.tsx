import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {isOpen ? "❌" : "☰"} {/* Toggle icon */}
      </button>
      <h2>Menü</h2>
      <nav>
        <ul>
          <li className={activeSection === "dashboard" ? "active" : ""} onClick={() => setActiveSection("dashboard")}>
            Dashboard
          </li>
          <li className={activeSection === "companies" ? "active" : ""} onClick={() => setActiveSection("companies")}>
            Tüm Şirketler
          </li>
          <li className={activeSection === "pending" ? "active" : ""} onClick={() => setActiveSection("pending")}>
            Onay Bekleyenler
          </li>
        </ul>
      </nav>
      <button className="logout" onClick={handleLogout}>Çıkış Yap</button>
    </div>
  );
};

export default Sidebar;
