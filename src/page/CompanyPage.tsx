import React from "react";

import "./CompanyPage.css";

import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";


const CompanyPage: React.FC = () => {
  return (
    <div className="company-page">
      <h1>Şirketler</h1>
     
      <CompanyDashboard />
      <CompanyList />
    </div>
  );
};

export default CompanyPage;