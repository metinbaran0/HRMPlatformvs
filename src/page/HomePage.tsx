import React from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/organisms/Navbar";
import HeroSection from "../components/organisms/HeroSection";
import MultiCardCarousel from "../components/organisms/MultiCardCarousel";
import UygulamaSlider from "../components/organisms/UygulamaSlider";
import Yorum from "../components/organisms/Yorum";
import Footer from "../components/organisms/Footer";
//import './HomePage.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Navigate to login page
  };

  const handleGetQuote = () => {
    navigate('/get-quote'); // Navigate to Get Quote page
  };

  return (
    <div className="home-container">
      <Navbar />
      <HeroSection />
      <MultiCardCarousel />
      <UygulamaSlider />
      <Yorum />
      <Footer />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGetQuote}>Get Quote</button>
    </div>
  );
};

export default HomePage;
