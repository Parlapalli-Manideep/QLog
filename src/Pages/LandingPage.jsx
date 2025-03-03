import React from "react";
import Header from "../Components/Header";
import HeroSection from "../Components/HeroSection";
import Features from "../Components/Features";
import HowItWorks from "../Components/HowItWorks";
import Footer from "../Components/Footer";

const LandingPage = () => {
  return (
    <div className="container-fluid bg-light text-center p-5">
      <Header />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default LandingPage;
