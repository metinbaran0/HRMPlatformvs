import React from 'react';
import { motion } from 'framer-motion';
import './UygulamaSlider.css'

const UygulamaSlider: React.FC = () => {
  const applications = [
    {
      id: 1,
      title: "Personel Yönetimi",
      icon: "👥",
      link: "/personel-yonetimi",
      color: "#60A5FA"
    },
    {
      id: 2,
      title: "Bordro Yönetimi",
      icon: "📊",
      link: "/bordro-yonetimi",
      color: "#34D399"
    },
    {
      id: 3,
      title: "Performans Yönetimi",
      icon: "📈",
      link: "/performans-yonetimi",
      color: "#F472B6"
    },
    {
      id: 4,
      title: "İşe Alım Ve Aday Takip",
      icon: "🎯",
      link: "/ise-alim",
      color: "#A78BFA"
    },
    {
      id: 5,
      title: "Vardiya Yönetimi",
      icon: "⏰",
      link: "/vardiya-yonetimi",
      color: "#FBBF24"
    },
    {
      id: 6,
      title: "Ücret Yönetimi",
      icon: "💰",
      link: "/ucret-yonetimi",
      color: "#6EE7B7"
    }
  ];

  return (
    <div className="section-uygulamalar">
      <div className="container">
        <motion.div 
          className="header-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className='section-title'>
            Uygulamalar
          </h2>
          <p className='section-description'>
            Çalışan sayınıza göre fiyatlama, dilediğiniz kadar kullanın, kullandığınız kadar ödeyin!
          </p>
        </motion.div>

        <div className="applications-grid">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.a 
                href={app.link}
                className="application-card"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                }}
                whileTap={{ scale: 0.95 }}
                style={{ backgroundColor: `${app.color}15` }}
              >
                <div className="card-content">
                  <span className="app-icon" style={{ backgroundColor: `${app.color}30` }}>
                    {app.icon}
                  </span>
                  <h3 style={{ color: app.color }}>{app.title}</h3>
                  <motion.div 
                    className="explore-link"
                    whileHover={{ x: 5 }}
                    style={{ color: app.color }}
                  >
                    Şimdi İncele →
                  </motion.div>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UygulamaSlider;
