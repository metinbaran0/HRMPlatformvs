
import React from "react";
import { PendingCompany} from "../organisms/PendingCompanies";
import "./CompanyCard.css";

interface CompanyCardProps {
  company: PendingCompany;
}

const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  return (
    <div className="pending-card">
      <div className="card-header">
        <h3>{company.name}</h3>
        <div className={`email-status ${company.emailVerified ? "verified" : "pending"}`}>
          {company.emailVerified ? "E-posta Doğrulandı" : "E-posta Doğrulanmadı"}
        </div>
      </div>
      <div className="card-content">
        <div className="info-group">
          <div className="info-item">
            <span className="label">İletişim Kişisi:</span>
            <span>{company.contactPerson}</span>
          </div>
          <div className="info-item">
            <span className="label">E-posta:</span>
            <span>{company.email}</span>
          </div>
          <div className="info-item">
            <span className="label">Telefon:</span>
            <span>{company.phone}</span>
          </div>
        </div>
      </div>
      {company.emailVerified && (
        <div className="card-actions">
          <button className="action-button approve">Onayla</button>
          <button className="action-button reject">Reddet</button>
        </div>
      )}
    </div>
  );
};

export default CompanyCard;
