import React from "react";
import Navbar from "../components/organisms/Navbar";
import HeroSection from "../components/organisms/HeroSection";
import MultiCardCarousel from "../components/organisms/MultiCardCarousel";
import UygulamaSlider from "../components/organisms/UygulamaSlider";
import Yorum from "../components/organisms/Yorum";
import Footer from "../components/organisms/Footer";

function HomePage() {
  return (
    <div className="home-container">
      <Navbar />
      <HeroSection />
      <MultiCardCarousel />
      <UygulamaSlider />
      <Yorum />
      <Footer />
    </div>
  );
}

export default HomePage;
