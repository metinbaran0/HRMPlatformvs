import React, { useEffect } from "react";
import "./MultiCardCarousel.css";

const MultiCardCarousel = () => {
  const companies = [
    { id: 1, name: "Company 1", logo: "https://picsum.photos/150/80?random=1" },
    { id: 2, name: "Company 2", logo: "https://picsum.photos/150/80?random=2" },
    { id: 3, name: "Company 3", logo: "https://picsum.photos/150/80?random=3" },
    { id: 4, name: "Company 4", logo: "https://picsum.photos/150/80?random=4" },
    { id: 5, name: "Company 5", logo: "https://picsum.photos/150/80?random=5" },
    { id: 6, name: "Company 6", logo: "https://picsum.photos/150/80?random=6" }
  ];

  return (
    <div className="multi-card-section">
      <div className="multi-card-container">
        <div className="multi-card-track">
          {/* İlk set */}
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <img src={company.logo} alt={company.name} />
              <p>{company.name}</p>
            </div>
          ))}
          {/* İkinci set (sonsuz döngü için) */}
          {companies.map(company => (
            <div key={`clone-${company.id}`} className="company-card">
              <img src={company.logo} alt={company.name} />
              <p>{company.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiCardCarousel;
