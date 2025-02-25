import React, { useState } from "react";
import Sidebar from "../components/organisms/Sidebar";
import PendingCompanies from "../components/organisms/PendingCompanies";
import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";
import "./CompanyPage.css";

const CompanyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <CompanyDashboard />;
      case "companies":
        return <CompanyList />;
      case "pending":
        return <PendingCompanies />;
      default:
        return <CompanyDashboard />;
    }
  };

  return (
    <div className="company-page">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default CompanyPage;
