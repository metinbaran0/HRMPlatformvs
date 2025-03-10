import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { fetchComments } from "../../store/feature/CommentSlice";
import { RootState, AppDispatch } from "../../store";
import { fetchPublicComments } from "../../services/PublicApiService";
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

// Kelebek animasyonu için rastgele pozisyon oluşturan yardımcı fonksiyon
const getRandomPosition = () => {
  // Kelebekleri orta kısımda daha yoğun olacak şekilde dağıtalım
  const positions = [
    { x: 40, y: 30, weight: 3 },  // Orta üst - yüksek ağırlık
    { x: 50, y: 40, weight: 4 },  // Tam orta - en yüksek ağırlık
    { x: 60, y: 50, weight: 3 },  // Orta alt - yüksek ağırlık
    { x: 30, y: 50, weight: 2 },  // Sol orta
    { x: 70, y: 30, weight: 2 },  // Sağ üst
    { x: 80, y: 60, weight: 1 },  // Sağ alt
    { x: 20, y: 70, weight: 1 }   // Sol alt
  ];
  
  // Ağırlıklı rastgele seçim
  const totalWeight = positions.reduce((sum, pos) => sum + pos.weight, 0);
  let randomWeight = Math.random() * totalWeight;
  
  let selectedPosition = positions[0];
  for (const pos of positions) {
    randomWeight -= pos.weight;
    if (randomWeight <= 0) {
      selectedPosition = pos;
      break;
    }
  }
  
  return {
    x: selectedPosition.x + (Math.random() * 15 - 7.5), // ±7.5% rastgele sapma
    y: selectedPosition.y + (Math.random() * 15 - 7.5), // ±7.5% rastgele sapma
    scale: 0.3 + Math.random() * 0.7,
    rotation: Math.random() * 360,
    delay: Math.random() * 8,
    duration: 15 + Math.random() * 20
  };
};

// Kelebek bileşeni
const Butterfly = ({ index }: { index: number }) => {
  const position = getRandomPosition();
  const butterflyColors = ["#FF9AA2", "#FFB7B2", "#FFDAC1", "#E2F0CB", "#B5EAD7", "#C7CEEA", "#F8B195", "#F67280", "#C06C84", "#6C5B7B"];
  const color = butterflyColors[index % butterflyColors.length];
  
  // Orta alana doğru uçuş yolu
  const centerX = 50;
  const centerY = 45;
  
  // Kelebeğin merkeze doğru uçmasını sağla
  const towardsCenterX = position.x < centerX 
    ? position.x + (centerX - position.x) * 0.3 
    : position.x - (position.x - centerX) * 0.3;
    
  const towardsCenterY = position.y < centerY 
    ? position.y + (centerY - position.y) * 0.3 
    : position.y - (position.y - centerY) * 0.3;
  
  return (
    <motion.div
      className="butterfly"
      initial={{ 
        x: `${position.x}%`, 
        y: `${position.y}%`, 
        scale: position.scale,
        rotate: position.rotation,
        opacity: 0
      }}
      animate={{ 
        x: [`${position.x}%`, `${towardsCenterX}%`, `${(position.x - 10 + 100) % 100}%`, `${position.x}%`],
        y: [`${position.y}%`, `${towardsCenterY}%`, `${(position.y + 15) % 100}%`, `${position.y}%`],
        rotate: [position.rotation, position.rotation + 45, position.rotation - 30, position.rotation],
        opacity: [0, 1, 1, 0]
      }}
      transition={{ 
        duration: position.duration,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
        delay: position.delay,
        times: [0, 0.3, 0.7, 1]
      }}
      style={{
        position: 'absolute',
        width: '40px',
        height: '40px',
        filter: `drop-shadow(0 0 3px ${color}40)`,
        zIndex: Math.floor(position.scale * 10)
      }}
    >
      <svg 
        viewBox="0 0 50 50" 
        fill={color}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {/* Daha estetik kelebek şekli */}
        <g>
          <motion.path 
            d="M25,10 C20,5 10,8 10,15 C10,22 20,25 25,20 C30,25 40,22 40,15 C40,8 30,5 25,10 Z" 
            animate={{
              d: [
                "M25,10 C20,5 10,8 10,15 C10,22 20,25 25,20 C30,25 40,22 40,15 C40,8 30,5 25,10 Z",
                "M25,10 C22,7 10,10 10,15 C10,20 22,23 25,20 C28,23 40,20 40,15 C40,10 28,7 25,10 Z",
                "M25,10 C20,5 10,8 10,15 C10,22 20,25 25,20 C30,25 40,22 40,15 C40,8 30,5 25,10 Z"
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.path 
            d="M25,30 C20,25 10,28 10,35 C10,42 20,45 25,40 C30,45 40,42 40,35 C40,28 30,25 25,30 Z" 
            animate={{
              d: [
                "M25,30 C20,25 10,28 10,35 C10,42 20,45 25,40 C30,45 40,42 40,35 C40,28 30,25 25,30 Z",
                "M25,30 C22,27 10,30 10,35 C10,40 22,43 25,40 C28,43 40,40 40,35 C40,30 28,27 25,30 Z",
                "M25,30 C20,25 10,28 10,35 C10,42 20,45 25,40 C30,45 40,42 40,35 C40,28 30,25 25,30 Z"
              ]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <circle cx="25" cy="25" r="2" fill="#FFF" opacity="0.7" />
          <path d="M23,25 L27,25 M25,23 L25,27" stroke="#FFF" strokeWidth="0.5" opacity="0.5" />
        </g>
      </svg>
    </motion.div>
  );
};

const Yorum: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);
  const [comments, setComments] = useState<TestimonialComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Redux store'dan gelen yorumları alıyoruz
  const { comments: apiComments, loading: reduxLoading, error: reduxError } = useSelector(
    (state: RootState) => state.comment
  );
  
  // Token kontrolü
  const token = useSelector((state: RootState) => state.user?.token);
  const butterflyCount = 10;

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        if (token) {
          // Kullanıcı giriş yapmışsa Redux action'ı ile yorumları çek
          dispatch(fetchComments({}) as any);
        } else {
          // Kullanıcı giriş yapmamışsa public API'den yorumları çek
          const publicComments = await fetchPublicComments();
          
          // Yorumları genişletilmiş formata dönüştür
          const enhancedComments: TestimonialComment[] = publicComments.map((comment: any) => ({
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
      } catch (err) {
        console.error("Yorumlar yüklenirken hata oluştu:", err);
        setError("Yorumlar yüklenirken bir hata oluştu.");
        
        // Hata durumunda örnek yorumlar göster
        setComments(getSampleComments());
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [dispatch, token]);

  useEffect(() => {
    // Redux'tan gelen yorumları işle (kullanıcı giriş yapmışsa)
    if (token && apiComments && apiComments.length > 0) {
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
  }, [apiComments, token]);

  // Örnek yorumlar (API çağrısı başarısız olursa kullanılacak)
  const getSampleComments = (): TestimonialComment[] => {
    return [
      {
        id: '1',
        content: 'Bu uygulama sayesinde şirketimizin verimliliği %30 arttı. Çalışanlarımız artık daha organize ve mutlu!',
        author: 'Ahmet Yılmaz',
        createdAt: '2023-05-15T10:30:00Z',
        authorImage: 'https://randomuser.me/api/portraits/men/32.jpg',
        position: 'Genel Müdür',
        company: 'ABC Teknoloji'
      },
      {
        id: '2',
        content: 'Kullanımı çok kolay ve sezgisel. Tüm departmanlarımız için vazgeçilmez bir araç haline geldi.',
        author: 'Ayşe Demir',
        createdAt: '2023-06-22T14:45:00Z',
        authorImage: 'https://randomuser.me/api/portraits/women/44.jpg',
        position: 'İK Direktörü',
        company: 'XYZ Holding'
      },
      {
        id: '3',
        content: 'Müşteri desteği mükemmel. Her sorunumuza anında çözüm buldular ve özel ihtiyaçlarımıza göre uyarlamalar yaptılar.',
        author: 'Mehmet Kaya',
        createdAt: '2023-07-10T09:15:00Z',
        authorImage: 'https://randomuser.me/api/portraits/men/22.jpg',
        position: 'Operasyon Müdürü',
        company: 'Lider Sanayi'
      }
    ];
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % comments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + comments.length) % comments.length);
  };

  // Yükleme durumunda gösterilecek içerik
  if (isLoading || (token && reduxLoading)) {
    return (
      <section className="testimonial-section">
        <div className="testimonial-container loading">
          <p>Yorumlar yükleniyor...</p>
        </div>
      </section>
    );
  }

  // Hata durumunda gösterilecek içerik
  if (error || (token && reduxError)) {
    // Hata durumunda örnek yorumları göster
    if (comments.length === 0) {
      setComments(getSampleComments());
    }
  }

  // Yorum yoksa gösterilecek içerik
  if (!comments || comments.length === 0) {
    return (
      <section className="testimonial-section">
        <div className="testimonial-container empty">
          <p>Henüz yorum bulunmuyor.</p>
        </div>
      </section>
    );
  }

  // Normal görünüm
  return (
    <section className="testimonial-section">
      {/* Kelebek animasyonları */}
      <div className="butterfly-container">
        {Array.from({ length: butterflyCount }).map((_, index) => (
          <Butterfly key={index} index={index} />
        ))}
      </div>
      
      <div className="testimonial-container">
        <div className="testimonial-header">
          <div className="header-content">
            <h2 className="testimonial-title">Kullanıcı Yorumları</h2>
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
                    Yorumu Oku <i className="fas fa-arrow-right"></i>
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
