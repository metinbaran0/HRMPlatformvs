import React, { useEffect, useState } from 'react';



interface Company {
  id: number;
  name: string;
  emailVerified: boolean;
  applicationStatus: 'approved' | 'rejected' | 'pending';
}

const CompanyList: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    // API çağrısı burada yapılabilir
    const fetchCompanies = async () => {
      const response = await fetch('/api/companies'); // API URL'si
      const data = await response.json();
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  const handleApprove = (companyId: number) => {
    // Başvuruyu onaylama işlemi
    console.log(`Company with ID ${companyId} approved`);
    // API çağrısı yapılabilir
  };

  const handleReject = (companyId: number) => {
    // Başvuruyu reddetme işlemi
    console.log(`Company with ID ${companyId} rejected`);
    // API çağrısı yapılabilir
  };

  const handleDelete = (companyId: number) => {
    // Şirket silme işlemi (soft delete)
    console.log(`Company with ID ${companyId} deleted`);
    // API çağrısı yapılabilir
  };

  return (
    <div className="company-page">
      <div className="company-page-header">
        <h1>Şirket Başvuruları</h1>
      </div>

      <div className="company-list">
        {companies.map((company) => (
          <div key={company.id} className="company-card">
            <h3>{company.name}</h3>
            <p>Email Doğrulama Durumu: {company.emailVerified ? 'Doğrulandı' : 'Doğrulanmadı'}</p>
            <p className={`application-status status-${company.applicationStatus}`}>
              {company.applicationStatus.charAt(0).toUpperCase() + company.applicationStatus.slice(1)}
            </p>

            <div className="action-buttons">
              <button
                className="approve-btn"
                onClick={() => handleApprove(company.id)}
                disabled={company.applicationStatus === 'approved'}
              >
                Onayla
              </button>
              <button
                className="reject-btn"
                onClick={() => handleReject(company.id)}
                disabled={company.applicationStatus === 'rejected'}
              >
                Reddet
              </button>
            </div>

            <div className="delete-icon" onClick={() => handleDelete(company.id)}>
              🗑️
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyList;
