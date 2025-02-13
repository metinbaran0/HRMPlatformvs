import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translateImage1 = (scrollY: number) => {
    return `translateX(${scrollY * 0.4}px)`; // 1. resim sola kayacak
  };

  const translateImage2 = (scrollY: number) => {
    return `translateX(${scrollY * -0.4}px)`; // 2. resim sağa kayacak
  };

  const translateImage3 = (scrollY: number) => {
    return `translateY(${scrollY * 0.2}px)`; // 3. resim biraz yukarı aşağı kayacak
  };

  const translateImage4 = (scrollY: number) => {
    return `translateY(${scrollY * 0.3}px)`; // 4. resim sağa kayacak
  };

  const translateImage5 = (scrollY: number) => {
    return `translateX(${scrollY * -0.5}px)`; // 5. resim sağa kayacak
  };

  return (
    <section className="hero-section flex flex-col items-center justify-center text-center p-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white min-h-[80vh]">
      {/* Başlık & Açıklama */}
      <motion.h1
        className="text-5xl font-bold mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        İK Yönetiminizi Kolaylaştırın
      </motion.h1>

      <motion.p
        className="text-lg mb-6 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        Çalışanlarınızı tek bir platform üzerinden yönetin, izinleri takip edin ve performanslarını değerlendirin.
      </motion.p>

      {/* Görsellerin Konumlandırılması ve Animasyon */}
      <motion.div
        className="hero-images mt-8 relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
          alt="Platform Kullanımı"
          className="hero-image image-1"
          style={{ transform: translateImage1(scrollY) }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
          alt="Platform Kullanımı"
          className="hero-image image-2"
          style={{ transform: translateImage2(scrollY) }}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
          alt="Platform Kullanımı"
          className="hero-image image-3"
          style={{ transform: translateImage3(scrollY) }}
        />
        <div className="image-4-container">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
            alt="Platform Kullanımı"
            className="hero-image image-4"
            style={{ transform: translateImage4(scrollY) }}
          />
          <motion.button
            className="free-trial-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Ücretsiz Deneyin
          </motion.button>
        </div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/6820/6820955.png"
          alt="Platform Kullanımı"
          className="hero-image image-5"
          style={{ transform: translateImage5(scrollY) }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
