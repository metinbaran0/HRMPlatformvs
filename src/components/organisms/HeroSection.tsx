import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import { motion } from "framer-motion";
import MultiCardCarousel from "./MultiCardCarousel";
import UygulamaSlider from "./UygulamaSlider";

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <section className="hero-section">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          İK Yönetiminizi Kolaylaştırın
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Çalışanlarınızı tek bir platform üzerinden yönetin, izinleri takip edin ve performanslarını değerlendirin.
        </motion.p>

        <motion.div
          className="hero-images"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.05 }}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
              alt={`Platform Kullanımı ${i}`}
              className={`hero-image image-${i}`}
              style={{
                transform: `translate${i === 1 || i === 4 ? "X" : "Y"}(${i === 3 ? -scrollY * 0.2 : scrollY * 0.2}px)`,
                transition: "transform 0.3s ease-in-out",
                transformOrigin: "center center",
                ...(hoveredImage === i ? { transform: "scale(1.2)" } : {})
              }}
              onMouseEnter={() => setHoveredImage(i)}
              onMouseLeave={() => setHoveredImage(null)}
            />
          ))}
          <motion.button className="free-trial-btn" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            Ücretsiz Deneyin
          </motion.button>
        </motion.div>
      </section>
      
      <div className="multi-card-carousel">
        
      </div>

      <div className="uygulama-slider">
        
      </div>
    </div>
  );
};

export default HeroSection;
