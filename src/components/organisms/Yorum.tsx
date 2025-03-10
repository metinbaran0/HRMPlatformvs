import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from "../../store/feature/CommentSlice";
import { RootState, AppDispatch } from "../../store";
import "./Yorum.css";

// Genişletilmiş Comment tipi
interface TestimonialComment {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  authorImage?: string;
  position?: string;
  company?: string;
}

const Yorum: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [comments, setComments] = useState<TestimonialComment[]>([]);

  // Redux store'dan gelen yorumları alıyoruz
  const { comments: apiComments, loading, error } = useSelector(
    (state: RootState) => state.comment
  );

  useEffect(() => {
    dispatch(fetchComments({}) as any);
  }, [dispatch]);

  useEffect(() => {
    // API'den gelen yorumları genişletilmiş formata dönüştür
    if (apiComments && apiComments.length > 0) {
      const enhancedComments: TestimonialComment[] = apiComments.map(comment => ({
        id: comment.id,
        content: comment.content,
        author: comment.author || 'Anonim',
        createdAt: comment.createdAt,
        // Eksik alanlar için varsayılan değerler
        authorImage: 'https://randomuser.me/api/portraits/' + 
                    (Math.random() > 0.5 ? 'men/' : 'women/') + 
                    Math.floor(Math.random() * 50) + '.jpg',
        position: 'Şirket Yöneticisi',
        company: 'Şirketimiz'
      }));
      setComments(enhancedComments);
    }
  }, [apiComments]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % comments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + comments.length) % comments.length);
  };

  if (loading) {
    return <p>Yorumlar yükleniyor...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="testimonial-container empty">
        <p>Henüz yorum bulunmuyor.</p>
      </div>
    );
  }

  return (
    <section className="testimonial-section">
      <div className="testimonial-container">
        <div className="testimonial-header">
          <div className="header-content">
            <h2 className="testimonial-title">Kullanıcı Hikayeleri</h2>
            <p className="testimonial-subtitle">
              Binlerce kullanıcı deneyimini keşfedin
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
                onClick={() => setSelectedStory(comments[currentIndex])}
              >
                <div className="card-image">
                  <img src={comments[currentIndex]?.authorImage || 'https://picsum.photos/400/300'} alt={comments[currentIndex]?.author} />
                </div>
                <div className="card-content">
                  <div className="card-header">
                    <div className="author-details">
                      <h3>{comments[currentIndex]?.author}</h3>
                      <p>{comments[currentIndex]?.position}</p>
                      <p className="company-name">{comments[currentIndex]?.company}</p>
                    </div>
                  </div>
                  <blockquote className="testimonial-quote">
                    {comments[currentIndex]?.content}
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
              <img src={selectedStory?.authorImage || 'https://picsum.photos/400/300'} alt={selectedStory?.author} className="story-image" />
              <div className="story-content">
                <h3>{selectedStory?.author}</h3>
                <p className="position">{selectedStory?.position} - {selectedStory?.company}</p>
                <p className="full-story">{selectedStory?.content}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Yorum;
