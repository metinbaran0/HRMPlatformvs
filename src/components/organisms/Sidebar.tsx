import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <div className="sidebar">
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
    </div>
  );
};

export default Sidebar;
