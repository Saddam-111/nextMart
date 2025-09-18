import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Product from "./Product";
import OurPolicy from "../components/OurPolicy";
import NewsLetter from "../components/NewsLetter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Navbar />
      {/* Add Hero section or content here */}
      <Hero />
      <Product />
      <OurPolicy />
      <NewsLetter />
      <Footer />
    </div>
  );
};

export default Home;
