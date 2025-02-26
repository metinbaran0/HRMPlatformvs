import React, { useState, useEffect } from 'react';
import Sidebar from "../components/organisms/Sidebar";
import PendingCompanies from "../components/organisms/PendingCompanies";
import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";

import "./CompanyPage.css";

const CompanyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const plans = [
    { id: 1, name: 'Aylık', price: 100 },
    { id: 2, name: 'Yıllık', price: 1000 }
  ];

  useEffect(() => {
    if (activeSection === "companies") {
      fetchCompanies();
    }
  }, [activeSection]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://localhost:9090/company/company/find-all-company');
      const data = await response.json();
      if (data.success) {
        setCompanies(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Şirketler alınırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (planId: number) => {
    setSelectedPlan(planId);
    // Üyelik planı güncelleme işlemi burada yapılabilir
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <CompanyDashboard />;
      case "companies":
        return <CompanyList companies={companies} loading={loading} error={error} />;
      case "pending":
        return <PendingCompanies />;
      default:
        return <CompanyDashboard />;
    }
  };

  return (
    <div className="company-page">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="main-content">
        
      
        {renderContent()}
      </div>
    </div>
  );
};

export default CompanyPage;
