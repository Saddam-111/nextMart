import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 md:px-16 pt-10 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Info */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">NextMart</h2>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for trendy fashion and lifestyle products.  
            We deliver quality and trust at your doorstep.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/collection" className="hover:text-white">Collections</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Policies</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="/" className="hover:text-white">Refund Policy</a></li>
            <li><a href="/" className="hover:text-white">Terms & Conditions</a></li>
            <li><a href="/" className="hover:text-white">Shipping Info</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex gap-4">
            <a href="/" className="hover:text-white"><FaFacebookF /></a>
            <a href="/" className="hover:text-white"><FaInstagram /></a>
            <a href="/" className="hover:text-white"><FaTwitter /></a>
            <a href="/" className="hover:text-white"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm text-gray-500 border-t border-gray-700 mt-6 p-2">
        © {new Date().getFullYear()} NextMart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
