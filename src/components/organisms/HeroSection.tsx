import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./HeroSection.css";

const HeroSection = () => {
  const { scrollY } = useScroll();

  // Scroll bazlı transformasyonlar
  const leftSlide = useTransform(scrollY, [0, 500], [0, -200]);
  const rightSlide = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300, 500], [1, 0.8, 0.6]);

  const images = [
    { id: 1, src: "https://picsum.photos/200/150?random=1", direction: "left" },
    { id: 2, src: "https://picsum.photos/200/150?random=2", direction: "right" },
    { id: 3, src: "https://picsum.photos/200/150?random=3", direction: "left" },
    { id: 4, src: "https://picsum.photos/200/150?random=4", direction: "none" },
    { id: 5, src: "https://picsum.photos/200/150?random=5", direction: "right" }
  ];

  return (
    <section className="hero-section">
      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-text">
          <h1 className="hero-title">
            İK Yönetiminde <span className="text-gradient">Yeni Nesil</span> Çözüm
          </h1>
          <p className="hero-description">
            Çalışanlarınızı tek platformda yönetin, verimliliği artırın
          </p>
        </div>

        <div className="images-grid">
          {/* Üst sıra görseller */}
          <div className="top-row">
            <motion.div 
              className="image-container"
              style={{ x: leftSlide, opacity }}
            >
              <img src={images[0].src} alt="Feature 1" className="feature-image" />
            </motion.div>

            <motion.div 
              className="image-container"
              style={{ x: rightSlide, opacity }}
            >
              <img src={images[1].src} alt="Feature 2" className="feature-image" />
            </motion.div>
          </div>

          {/* Sabit buton */}
          <motion.button 
            className="cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ücretsiz Deneyin
          </motion.button>

          {/* Alt sıra görseller */}
          <div className="bottom-row">
            <motion.div 
              className="image-container"
              style={{ x: leftSlide, opacity }}
            >
              <img src={images[2].src} alt="Feature 3" className="feature-image" />
            </motion.div>

            <motion.div 
              className="image-container center-image"
            >
              <img src={images[3].src} alt="Feature 4" className="feature-image" />
            </motion.div>

            <motion.div 
              className="image-container"
              style={{ x: rightSlide, opacity }}
            >
              <img src={images[4].src} alt="Feature 5" className="feature-image" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
