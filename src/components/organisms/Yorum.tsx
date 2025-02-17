import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Yorum.css";

type Testimonial = {
  id: number;
  logo: string;
  quote: string;
  author: string;
  position: string;
  company: string;
  image: string;
  fullStory: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    logo: "https://picsum.photos/50/50?random=1",
    quote: "İK süreçlerimizi çok daha verimli yönetmeye başladık. Özellikle izin takibi konusunda büyük kolaylık sağladı.",
    author: "Ayşe Yılmaz",
    position: "İK Direktörü",
    company: "Tech Solutions",
    image: "https://picsum.photos/400/300?random=1",
    fullStory: "Detaylı kullanıcı deneyimi...",
  },
  {
    id: 2,
    logo: "https://picsum.photos/50/50?random=2",
    quote: "Bordro işlemlerimiz artık çok daha hızlı ve hatasız. Çalışan memnuniyetimiz arttı.",
    author: "Mehmet Demir",
    position: "İK Müdürü",
    company: "Global Yazılım",
    image: "https://picsum.photos/400/300?random=2",
    fullStory: "Detaylı kullanıcı deneyimi...",
  },
  {
    id: 3,
    logo: "https://picsum.photos/50/50?random=3",
    quote: "Performans değerlendirme süreçlerimiz artık çok daha şeffaf ve ölçülebilir.",
    author: "Zeynep Kaya",
    position: "İK Uzmanı",
    company: "Innovate Inc.",
    image: "https://picsum.photos/400/300?random=3",
    fullStory: "Detaylı kullanıcı deneyimi...",
  },
];

const Yorum: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<Testimonial | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <div className="header-content">
            <h2 className="testimonial-title">Kullanıcı Hikayeleri</h2>
            <p className="testimonial-subtitle">
              Binlerce İK profesyonelinin deneyimlerini keşfedin
            </p>
            <motion.a 
              href="/tum-hikayeler"
              className="view-all-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Tümünü İnceleyin →
            </motion.a>
          </div>

          <div className="testimonial-slider">
            <button className="nav-button prev" onClick={prevSlide}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <AnimatePresence mode="wait">
              <motion.div 
                key={currentIndex}
                className="testimonial-card"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                onClick={() => setSelectedStory(testimonials[currentIndex])}
              >
                {/* Daha fazla kelebek */}
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>
                <div className="butterfly"></div>

                <div className="card-image">
                  <img src={testimonials[currentIndex].image} alt={testimonials[currentIndex].author} />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <div className="author-details">
                      <h3>{testimonials[currentIndex].author}</h3>
                      <p>{testimonials[currentIndex].position}</p>
                      <p className="company-name">{testimonials[currentIndex].company}</p>
                    </div>
                  </div>
                  <blockquote className="testimonial-quote">
                    {testimonials[currentIndex].quote}
                  </blockquote>
                  <motion.button 
                    className="read-more-button"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Hikayeyi Oku <i className="fas fa-arrow-right"></i>
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            <button className="nav-button next" onClick={nextSlide}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Modal for full story */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div 
            className="story-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStory(null)}
          >
            <motion.div 
              className="story-modal"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-modal" onClick={() => setSelectedStory(null)}>
                ×
              </button>
              <img src={selectedStory.image} alt={selectedStory.author} className="story-image" />
              <div className="story-content">
                <h3>{selectedStory.author}</h3>
                <p className="position">{selectedStory.position} - {selectedStory.company}</p>
                <p className="full-story">{selectedStory.fullStory}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Yorum;
