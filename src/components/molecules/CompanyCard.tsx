// components/molecules/CompanyCard.tsx
import React from "react";
import Button from "../atoms/ButtonCompany";
import "../../styles/CompanyDashboard.css";

type CompanyCardProps = {
  name: string;
  status: string;
  onViewDetails: () => void;
};

const CompanyCard: React.FC<CompanyCardProps> = ({ name, status, onViewDetails }) => {
  return (
    <div className={`company-card ${status === "expired" ? "expired" : "active"}`}>
      <h3>{name}</h3>
      <p>Status: {status}</p>
      <Button label="Detayları Gör" onClick={onViewDetails} className="view-details" />
    </div>
  );
};

export default CompanyCard;