import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Contact = () => {
  return (
    <>
    <Navbar />
    <div className="mt-16">
      {/* 1️⃣ Hero Section */}
      <section className="bg-indigo-50 py-16 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-4">
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Have questions, feedback, or need assistance? Our team is here to
          help you 24/7. Choose the best way to reach us below.
        </p>
      </section>

      {/* 2️⃣ Contact Info Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 py-12">
        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaPhoneAlt className="text-indigo-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg">Phone</h3>
          <p className="text-gray-600 mt-2">+91 98765 43210</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaEnvelope className="text-indigo-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg">Email</h3>
          <p className="text-gray-600 mt-2">support@nextmart.com</p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaMapMarkerAlt className="text-indigo-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg">Address</h3>
          <p className="text-gray-600 mt-2">
            123 NextMart Plaza, New Delhi, India
          </p>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center text-center">
          <FaClock className="text-indigo-700 text-3xl mb-3" />
          <h3 className="font-semibold text-lg">Working Hours</h3>
          <p className="text-gray-600 mt-2">Mon - Sat: 9:00 AM - 8:00 PM</p>
        </div>
      </section>

      {/* 3️⃣ Contact Form */}
      <section className="px-6 md:px-12 py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6 text-center">
            Get in Touch
          </h2>
          <form className="grid grid-cols-1 gap-6">
            <input
              type="text"
              placeholder="Your Name"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <textarea
              placeholder="Your Message"
              rows="5"
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            ></textarea>
            <button className="bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 rounded-lg transition-all">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* 4️⃣ Google Map Embed */}
      <section className="px-6 md:px-12 py-12">
        <iframe
          title="NextMart Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.998289350815!2d77.20902131508325!3d28.613939982426588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0abf3b69d7%3A0xfed0f00e0a23a9f!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1675680000000!5m2!1sen!2sin"
          width="100%"
          height="350"
          allowFullScreen=""
          loading="lazy"
          className="rounded-2xl shadow-md"
        ></iframe>
      </section>

      {/* 5️⃣ FAQ Section */}
      <section className="px-6 md:px-12 py-12 bg-gray-50">
        <h2 className="text-2xl font-bold text-indigo-800 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg">How can I track my order?</h3>
            <p className="text-gray-600 mt-2">
              You can easily track your order in the "My Orders" section after
              logging in. You’ll also receive regular updates via email.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg">
              What is the return/refund policy?
            </h3>
            <p className="text-gray-600 mt-2">
              NextMart offers a 7-day easy return & full refund policy on most
              items. Please check individual product pages for exact details.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="font-semibold text-lg">
              Do you offer international shipping?
            </h3>
            <p className="text-gray-600 mt-2">
              Yes, we ship worldwide 🌍. Shipping charges may vary depending on
              your country and order value.
            </p>
          </div>
        </div>
      </section>

      {/* 6️⃣ Customer Support CTA */}
      <section className="bg-indigo-700 text-white py-12 px-6 text-center">
        <MdSupportAgent className="text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Need Immediate Help?</h2>
        <p className="mb-6">Our support agents are available 24/7.</p>
        <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
          Chat with Support
        </button>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Contact;
