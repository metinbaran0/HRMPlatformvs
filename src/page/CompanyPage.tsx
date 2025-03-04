import React, { useEffect, useState } from 'react';
import Sidebar from "../components/organisms/Sidebar";
import PendingCompanies from "../components/organisms/PendingCompanies";
import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";
//burada bir yorum var
import "./CompanyPage.css";
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const CompanyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token= useSelector<RootState>(s => s.user.token) 

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
      const response = await fetch('http://localhost:9090/v1/api/company/find-all-company',{
        method:"GET",
        headers:{
          "Authorization": "Bearer " + token ,
          "Content-Type": "application/json"
        }
      });
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