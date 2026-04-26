import React from "react";
import Navbar from "../../components/user/Navbar";
import Hero from "../../components/user/Hero";
import Product from "./Product";
import OurPolicy from "../../components/user/OurPolicy";
import NewsLetter from "../../components/user/NewsLetter";
import Footer from "../../components/user/Footer";

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
