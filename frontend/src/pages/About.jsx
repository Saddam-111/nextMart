import React from "react";
import { FaHeadset, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { images } from "../assets/asset";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const About = () => {
  return (
    <>
    <Navbar />
    <div className="text-gray-800">
      {/* Hero Section */}
      <section className="relative bg-blue-50 py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
            About <span className="text-blue-600">NextMart</span>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            At NextMart, we believe shopping should be effortless, enjoyable, and 
            reliable. From fashion to lifestyle essentials, we bring quality 
            products to your doorstep with trust and care.
          </p>
        </div>
        <div className="flex-1">
          <img
            src={images.nextMartBanner}
            alt="About NextMart"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 px-6 md:px-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6">Our Story</h2>
        <p className="text-gray-600 leading-relaxed">
          Founded with a vision to make online shopping more accessible and 
          reliable, NextMart has grown into a trusted marketplace for thousands of 
          happy customers. What started as a small initiative is now an 
          ever-growing platform where style, comfort, and affordability come 
          together. We are committed to bringing the latest collections and 
          delivering them with love and responsibility.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16 px-6 md:px-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Why Choose Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <FaTruckFast className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">
              Get your products delivered quickly and safely.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <FaHeadset className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">
              Our support team is always here to help you.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <FaCreditCard className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">
              Pay safely with multiple payment options.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <FaShieldAlt className="text-blue-600 text-4xl mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Trusted Quality</h3>
            <p className="text-gray-600 text-sm">
              Every product goes through strict quality checks.
            </p>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-16 px-6 md:px-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 bg-white rounded-xl shadow hover:shadow-md transition"
            >
              <img
                src={`https://via.placeholder.com/150`}
                alt={`Team Member ${i}`}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-semibold">Member {i}</h3>
              <p className="text-gray-500 text-sm">Role at NextMart</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-gradient-to-r from-amber-400 to-indigo-400 py-16 px-6 md:px-16 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to Start Shopping?
        </h2>
        <p className="mb-6 text-shadow-md font-medium">
          Join thousands of happy customers who trust NextMart for their 
          everyday needs. Explore our latest collections now!
        </p>
        <a
          href="/collection"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;
