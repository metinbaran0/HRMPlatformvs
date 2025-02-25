import React, { useState } from 'react';
import axios from 'axios';

interface Company {
  id: number;
  name: string;
  emailVerified: boolean; // Mail doğrulama durumu
}

const CompanyApproval: React.FC = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Şirketi API'den al
  const fetchCompany = async (companyId: number) => {
    try {
      const response = await axios.get(`/api/companies/${companyId}`);
      setCompany(response.data);
    } catch (error) {
      console.error("Şirket bilgisi alınamadı", error);
    }
  };

  // Onaylama işlemi
  const handleApprove = async () => {
    if (company && !company.emailVerified) {
      setErrorMessage("Mail doğrulanmamış, onaylanamaz.");
      return;
    }

    try {
      await axios.post(`/api/companies/approve/${company?.id}`);
      alert("Şirket onaylandı!");
    } catch (error) {
      console.error("Onay işlemi başarısız", error);
      setErrorMessage("Onay işlemi sırasında bir hata oluştu.");
    }
  };

  // İlk şirketi yüklemek için useEffect ekleyebilirsiniz
  // useEffect(() => {
  //   fetchCompany(1); // Örneğin, ID'si 1 olan şirketi al
  // }, []);

  return (
    <div>
      {company ? (
        <div>
          <h1>{company.name}</h1>
          <p>{company.emailVerified ? "Mail doğrulandı" : "Mail doğrulanmamış"}</p>
          <button onClick={handleApprove}>Onayla</button>
        </div>
      ) : (
        <p>Şirket bilgileri yükleniyor...</p>
      )}

      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  );
};

export default CompanyApproval;
