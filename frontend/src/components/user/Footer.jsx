import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/collection" },
    { label: "About Us", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  const policyLinks = [
    { label: "Privacy Policy", path: "/" },
    { label: "Refund Policy", path: "/" },
    { label: "Terms & Conditions", path: "/" },
    { label: "Shipping Info", path: "/" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, path: "/", label: "Facebook" },
    { icon: FaInstagram, path: "/", label: "Instagram" },
    { icon: FaTwitter, path: "/", label: "Twitter" },
    { icon: FaLinkedinIn, path: "/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-[#262626] text-[#f5f0eb] px-6 md:px-16 pt-12 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-display font-semibold text-[#fdf8f3] mb-4">
            NextMart
          </h2>
          <p className="text-sm leading-relaxed text-[#e4a4bd]">
            Your one-stop shop for trendy fashion and lifestyle products.  
            We deliver quality and trust at your doorstep.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-display font-semibold text-[#fdf8f3] mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {footerLinks.map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.path}
                  whileHover={{ x: 4, color: "#f3efe8", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  className="hover:text-[#fdf8f3] transition-colors"
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-display font-semibold text-[#fdf8f3] mb-3">
            Policies
          </h3>
          <ul className="space-y-2 text-sm">
            {policyLinks.map((link, index) => (
              <li key={index}>
                <motion.a
                  href={link.path}
                  whileHover={{ x: 4, color: "#f3efe8", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  className="hover:text-[#fdf8f3] transition-colors"
                >
                  {link.label}
                </motion.a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3 className="text-lg font-display font-semibold text-[#fdf8f3] mb-3">
            Follow Us
          </h3>
          <div className="flex gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.path}
                aria-label={social.label}
                whileHover={{ scale: 1.1, y: -2, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#e4a4bd] hover:bg-[#d494ad] transition-all-slow"
              >
                <social.icon size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-sm text-[#9e866b] border-t border-[#5e5240] mt-10 py-4"
      >
        © {currentYear} NextMart. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
