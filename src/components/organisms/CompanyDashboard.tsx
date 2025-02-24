// src/components/organisms/CompanyDashboard.tsx
import React, { useState } from "react";
import CompanyCard from "../molecules/CompanyCard";
import "../../styles/CompanyDashboard.css";
import SearchBar from "../molecules/SearchBar";

// Şirket verisi örnek
const companies = [
  { id: 1, name: "ABC Ltd.", status: "active" },
  { id: 2, name: "XYZ Corp.", status: "expired" },
  { id: 3, name: "LMN Inc.", status: "active" },
];

const CompanyDashboard: React.FC = () => {
  // Arama sorgusunu tutmak için state
  const [searchQuery, setSearchQuery] = useState("");

  // Arama fonksiyonu
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Arama filtresi uygula
  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="company-dashboard">
      <h2>Şirketler</h2>

      {/* SearchBar bileşeni */}
      <SearchBar onSearch={handleSearch} />

      <div className="company-list">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <CompanyCard
              key={company.id}
              name={company.name}
              status={company.status}
              onViewDetails={() => alert(`${company.name} detayları`)}
            />
          ))
        ) : (
          <p>Aramanıza uygun şirket bulunamadı.</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
