import React from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdSupportAgent } from "react-icons/md";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const Contact = () => {
  const contactInfo = [
    { icon: FaPhoneAlt, title: "Phone", value: "+91 98765 43210" },
    { icon: FaEnvelope, title: "Email", value: "support@nextmart.com" },
    { icon: FaMapMarkerAlt, title: "Address", value: "123 NextMart Plaza, New Delhi, India" },
    { icon: FaClock, title: "Working Hours", value: "Mon - Sat: 9:00 AM - 8:00 PM" },
  ];

  const faqs = [
    { q: "How can I track my order?", a: "You can easily track your order in the 'My Orders' section after logging in. You'll also receive regular updates via email." },
    { q: "What is the return/refund policy?", a: "NextMart offers a 7-day easy return & full refund policy on most items. Please check individual product pages for exact details." },
    { q: "Do you offer international shipping?", a: "Yes, we ship worldwide. Shipping charges may vary depending on your country and order value." },
  ];

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-16"
      >
        <section className="bg-[#f5f0eb] py-16 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-semibold text-[#262626] mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[#7a6b54] max-w-2xl mx-auto font-body"
          >
            Have questions, feedback, or need assistance? Our team is here to help you 24/7. Choose the best way to reach us below.
          </motion.p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 md:px-12 py-12 max-w-7xl mx-auto">
           {contactInfo.map((info, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               whileHover={{ y: -6, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
               className="flex flex-col items-center text-center bg-[#fdf8f3] p-6 rounded-3xl shadow-sm hover:shadow-md transition-all-slow organic-card"
             >
               <motion.div
                 whileHover={{ scale: 1.1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                 className="mb-4"
               >
                 <info.icon className="text-[#e4a4bd] text-3xl" />
               </motion.div>
               <h3 className="font-display font-semibold text-lg text-[#262626]">{info.title}</h3>
               <p className="text-[#7a6b54] mt-2 font-body">{info.value}</p>
             </motion.div>
           ))}
        </section>

        <section className="px-6 md:px-12 py-12 bg-[#f5f0eb]">
          <div className="max-w-3xl mx-auto bg-[#fdf8f3] shadow-lg rounded-3xl p-8 organic-card">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl font-display font-bold text-[#262626] mb-6 text-center"
            >
              Get in Touch
            </motion.h2>
            <form className="grid grid-cols-1 gap-5">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="Your Name"
                className="organic-input"
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="email"
                placeholder="Your Email"
                className="organic-input"
              />
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type="text"
                placeholder="Subject"
                className="organic-input"
              />
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                placeholder="Your Message"
                rows="5"
                className="organic-input"
              ></motion.textarea>
              <motion.button
                whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                className="organic-btn bg-[#6b7d56] text-white hover:bg-[#5d6446]"
              >
                Send Message
              </motion.button>
            </form>
          </div>
        </section>

        <section className="px-6 md:px-12 py-12 max-w-7xl mx-auto">
          <motion.iframe
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            title="NextMart Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.998289350815!2d77.20902131508325!3d28.613939982426588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd0abf3b69d7%3A0xfed0f00e0a23a9f!2sConnaught%20Place%2C%20New%20Delhi!5e0!3m2!1sen!2sin!4v1675680000000!5m2!1sen!2sin"
            width="100%"
            height="350"
            allowFullScreen=""
            loading="lazy"
            className="rounded-3xl shadow-md"
          ></motion.iframe>
        </section>

        <section className="px-6 md:px-12 py-12 bg-[#f5f0eb]">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-display font-bold text-[#262626] text-center mb-8"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#fdf8f3] p-6 rounded-2xl shadow-sm hover:shadow-md transition-all-slow organic-card"
              >
                <h3 className="font-display font-semibold text-lg text-[#262626]">{faq.q}</h3>
                <p className="text-[#7a6b54] mt-2 font-body">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-[#5e5240] text-white py-12 px-6 text-center rounded-3xl mx-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <MdSupportAgent className="text-5xl mx-auto mb-4 text-[#9e866b]" />
            <h2 className="text-2xl font-display font-bold mb-2">Need Immediate Help?</h2>
            <p className="mb-6 font-body">Our support agents are available 24/7.</p>
            <motion.button
              whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              className="organic-btn bg-white text-[#262626] hover:bg-[#f5f0eb]"
            >
              Chat with Support
            </motion.button>
          </motion.div>
        </section>
      </motion.div>
      <Footer />
    </>
  );
};

export default Contact;
