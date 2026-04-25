import React from "react";
import { FaHeadset, FaCreditCard, FaShieldAlt } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { images } from "../assets/asset";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const About = () => {
  const features = [
    { icon: FaTruckFast, title: "Fast Delivery", desc: "Get your products delivered quickly and safely." },
    { icon: FaHeadset, title: "24/7 Support", desc: "Our support team is always here to help you." },
    { icon: FaCreditCard, title: "Secure Payments", desc: "Pay safely with multiple payment options." },
    { icon: FaShieldAlt, title: "Trusted Quality", desc: "Every product goes through strict quality checks." },
  ];

  const teamMembers = [
    { name: "Alex Johnson", role: "Founder & CEO" },
    { name: "Sarah Williams", role: "Head of Design" },
    { name: "Michael Brown", role: "Operations Lead" },
    { name: "Emily Davis", role: "Customer Success" },
  ];

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[#3d352b]"
      >
        <section className="relative bg-[#f5f0eb] py-16 px-6 md:px-16 flex flex-col md:flex-row items-center gap-10 max-w-7xl mx-auto mt-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            className="flex-1"
          >
            <h1 className="text-3xl md:text-5xl font-display font-semibold mb-4">
              About <span className="text-[#e4a4bd]">NextMart</span>
            </h1>
            <p className="text-[#262626] text-lg leading-relaxed font-body">
              At NextMart, we believe shopping should be effortless, enjoyable, and 
              reliable. From fashion to lifestyle essentials, we bring quality 
              products to your doorstep with trust and care.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "cubic-bezier(0.16, 1, 0.3, 1)" }}
            className="flex-1"
          >
            <motion.img
              whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              src={images.nextMartBanner}
              alt="About NextMart"
              className="rounded-3xl shadow-lg"
            />
          </motion.div>
        </section>

        <section className="py-16 px-6 md:px-16 text-center max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-semibold mb-6"
          >
            Our Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#262626] leading-relaxed font-body"
          >
            Founded with a vision to make online shopping more accessible and 
            reliable, NextMart has grown into a trusted marketplace for thousands of 
            happy customers. What started as a small initiative is now an 
            ever-growing platform where style, comfort, and affordability come 
            together. We are committed to bringing the latest collections and 
            delivering them with love and responsibility.
          </motion.p>
        </section>

        <section className="bg-[#f5f0eb] py-16 px-6 md:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-semibold text-center mb-10"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                className="p-6 bg-[#fdf8f3] rounded-3xl shadow-sm hover:shadow-md transition-all-slow organic-card"
              >
                <motion.div
                  whileHover={{ scale: 1.1, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  className="mb-4"
                >
                  <feature.icon className="text-4xl mx-auto text-[#e4a4bd]" />
                </motion.div>
                <h3 className="font-display font-semibold mb-2 text-[#262626]">{feature.title}</h3>
                <p className="text-[#7a6b54] text-sm font-body">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="py-16 px-6 md:px-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-semibold text-center mb-10"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                className="p-6 bg-[#fdf8f3] rounded-3xl shadow-sm hover:shadow-md transition-all-slow organic-card"
              >
                <motion.img
                  whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  src={`https://via.placeholder.com/150`}
                  alt={member.name}
                  className="w-28 h-28 rounded-full mx-auto mb-4 object-cover bg-[#e8e0d3] image-grayscale-hover"
                />
                <h3 className="font-display font-semibold text-[#262626]">{member.name}</h3>
                <p className="text-[#7a6b54] text-sm font-body">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#9e866b] to-[#6b7d56] py-16 px-6 md:px-16 text-center text-[#262626] rounded-3xl mx-4 mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-display font-bold mb-4"
          >
            Ready to Start Shopping?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-6 font-body"
          >
            Join thousands of happy customers who trust NextMart for their 
            everyday needs. Explore our latest collections now!
          </motion.p>
          <motion.a
            href="/collection"
            whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            className="inline-block organic-btn bg-white text-[#262626] hover:bg-[#f5f0eb]"
          >
            Shop Now
          </motion.a>
        </section>
      </motion.div>
      <Footer />
    </>
  );
};

export default About;


