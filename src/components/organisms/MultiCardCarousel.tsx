import React, { useEffect } from "react";
import "./MultiCardCarousel.css";

const MultiCardCarousel = () => {
  const companies = [
    { id: 1,  logo: "https://www.altensis.com/wp-content/uploads/2009/10/Philips-Logo-1160x600.jpg" },
    { id: 2,  logo: "https://cdnuploads.aa.com.tr/uploads/sirkethaberleri/Contents/2022/02/22/thumbs_b_c_70aa145685ee09249fe4ff36d3168481.jpg" },
    { id: 3,  logo: "https://www.marmarapark.com/fileadmin/user_upload/GLOBAL/brand_stores/logos/koton.jpg" },
    { id: 4,  logo: "https://yt3.googleusercontent.com/W0bHWNh6wAFyg2Xp7byR47amwu_PfT-Pdu1JUy5sb-nwkYDn6TSN2xUsYsxOwvjDQVDADDWg=s900-c-k-c0x00ffffff-no-rj" },
    { id: 5,  logo: "https://marmaraforum.com.tr/media/image/6S2CJW1JY53V4S.png" },
    { id: 6,  logo: "https://thumbs.dreamstime.com/b/nike-inc-american-multinational-corporation-engaged-design-development-manufacturing-worldwide-marketing-139136474.jpg" }
  ];

  return (
    <div className="multi-card-section">
      <div className="multi-card-container">
        <div className="multi-card-track">
          {/* İlk set */}
          {companies.map(company => (
            <div key={company.id} className="company-card">
              <img src={company.logo} />
              
            </div>
          ))}
          {/* İkinci set (sonsuz döngü için) */}
          {companies.map(company => (
            <div key={`clone-${company.id}`} className="company-card">
              <img src={company.logo}  />
             
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiCardCarousel;
