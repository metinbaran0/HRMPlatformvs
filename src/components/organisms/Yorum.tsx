import React from "react";
import "./Yorum.css";

type Testimonial = {
  logo: string;
  quote: string;
  author: string;
  position: string;
  image: string;
  link: string;
};

const testimonials: Testimonial[] = [
  {
    logo: "marka logosu",
    quote:
      "Yorumlar",
    author: " kullanıcı adı",
    position: "mevki",
    image:
      "https://picsum.photos/85/85",
    link: "",
  },
  {
    logo: "marka logosu",
    quote:
      "Yorumlar",
    author: " kullanıcı adı",
    position: "mevki",
    image:
      "https://picsum.photos/85/85",
    link: "",
  },
];

const Yorum: React.FC = () => {
  return (
    <section className="testimonial-slider">
      <div className="container">
        <h2 className="title">Kullanıcı Hikayeleri</h2>
        <p className="subtitle">
          Binlerce insan kaynakları profesyoneli ile hep beraber İK'yı kolaylaştırıyoruz.
          İK profesyonellerinin Kolay İK ile tanışma hikayelerine göz atın.
        </p>
        <div className="slider">
          {testimonials.map((testimonial, index) => (
            <a href={testimonial.link} className="slide" key={index}>
              <div className="testimonial-content">
                <img src={testimonial.logo} alt="Company Logo" className="logo" />
                <p className="quote">“{testimonial.quote}”</p>
                <div className="author-info">
                  <p className="author">{testimonial.author}</p>
                  <p className="position">{testimonial.position}</p>
                </div>
              </div>
              <img src={testimonial.image} alt={testimonial.author} className="testimonial-image" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Yorum;
