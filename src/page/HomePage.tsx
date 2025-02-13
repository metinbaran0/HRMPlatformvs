import React from "react";
import Navbar from "../components/organisms/Navbar";
import HeroSection from "../components/organisms/HeroSection";
import Carousel from "../components/organisms/Carousel";
import MultiCarousel from "../components/organisms/MultiCarousel";
import Tag from "../components/organisms/Badge";
import Badge from "../components/organisms/Badge";

function HomePage() {
  return (
    <div>
      <Navbar />
      <HeroSection/>
     <MultiCarousel/>
     
    </div>
  );
}

export default HomePage;
