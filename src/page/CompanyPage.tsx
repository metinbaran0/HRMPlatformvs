import React, { useEffect, useState } from 'react';
import Sidebar from "../components/organisms/Sidebar";
import PendingCompanies from "../components/organisms/PendingCompanies";
import CompanyList from "../components/organisms/CompanyList";
import CompanyDashboard from "../components/organisms/CompanyDashboard";
//burada bir yorum var
import "./CompanyPage.css";
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCompanies } from '../store/feature/companySlice';

const CompanyPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const { companies, loading, error } = useSelector((state: RootState) => state.companies);
  const dispatch: AppDispatch = useDispatch();

  const plans = [
    { id: 1, name: 'Aylık', price: 100 },
    { id: 2, name: 'Yıllık', price: 1000 }
  ];

  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

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

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return <div>Hata: {error}</div>;
  }

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