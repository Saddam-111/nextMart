import React, { useContext, useState, useRef, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoSearchCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShopDataContext } from "../context/ShopContext";
import { dropdownVariants, mobileMenuVariants, mobileMenuItem, staggerItem } from "../lib/animations";

const Navbar = () => {
  const { userData, getCurrentUser, baseUrl } = useContext(userDataContext);
  const { search, setSearch, getCartCount } =
    useContext(ShopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await axios.get(baseUrl + "/api/v1/auth/logout", {
        withCredentials: true,
      });
      getCurrentUser();
      setShowProfile(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search) {
      navigate("/collection");
      setSearchOpen(false);
    }
  };

  const handleSecureNavigation = (path, isProtected = false) => {
    if (isProtected && !userData) {
      navigate("/login");
    } else {
      navigate(path);
    }
    setMenuOpen(false);
    setShowProfile(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "COLLECTION", path: "/collection" },
    { label: "ABOUT", path: "/about" },
    { label: "CONTACT", path: "/contact", protected: true },
  ];

  const dropdownItems = [
    { label: "Profile", path: "/profile" },
    { label: "Orders", path: "/orders" },
    { label: "Returns", path: "/returns" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "About", path: "/about" },
  ];

  return (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 glassmorphism-nav"
      >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <motion.h1
          whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          onClick={() => handleSecureNavigation("/")}
          className="text-2xl font-display font-bold text-[#262626] cursor-pointer tracking-tighter transition-all-slow"
        >
          nextMart
        </motion.h1>

        <ul className="hidden md:flex space-x-8 text-[#262626] font-medium">
          {navItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ color: "#e4a4bd", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              className="cursor-pointer relative group transition-all-slow"
              onClick={() => handleSecureNavigation(item.path, item.protected)}
            >
              {item.label}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-[#e4a4bd]"
                initial={{ width: 0 }}
                whileHover={{ width: "100%", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              />
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            onClick={() => setSearchOpen((prev) => !prev)}
            className="cursor-pointer transition-all-slow"
          >
            <IoSearchCircleOutline
              size={30}
              className={`text-[#262626] hover:text-[#e4a4bd] transition-all-slow ${searchOpen ? 'text-[#e4a4bd]' : ''}`}
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            onClick={() => handleSecureNavigation("/cart", true)}
            className="relative cursor-pointer transition-all-slow"
          >
                <MdOutlineShoppingCart
                  size={28}
                  className="text-[#262626] hover:text-[#e4a4bd] transition-all-slow"
                />
             {getCartCount() > 0 && (
               <motion.p
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="absolute -top-2 -right-2 bg-[#965639] text-white text-xs font-bold px-2 py-0.5 rounded-full"
               >
                 {getCartCount()}
               </motion.p>
             )}
           </motion.button>

              {!userData && (
              <motion.button
                whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => navigate("/login")}
                className="text-[#262626] cursor-pointer hover:text-[#e4a4bd] transition-all-slow"
              >
                <FaCircleUser size={28} />
              </motion.button>
              )}

                {userData && (
                <div className="relative" ref={profileDropdownRef}>
                  <motion.button
                    whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                    whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                    onClick={() => setShowProfile((prev) => !prev)}
                    className="w-9 h-9 flex items-center justify-center bg-[#e4a4bd] text-[#262626] rounded-full cursor-pointer transition-all-slow"
                  >
                    {userData?.name?.slice(0, 1).toUpperCase()}
                  </motion.button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 bg-white shadow-lg rounded-2xl py-2 w-44 overflow-hidden"
                      style={{ zIndex: 100 }}
                    >
                      {dropdownItems.map((item) => (
                        <motion.li
                          key={item.label}
                          variants={staggerItem}
                          onClick={() => handleSecureNavigation(item.path, item.protected)}
                          className="px-4 py-2.5 text-[#262626] hover:bg-[#f5f0eb] cursor-pointer transition-all-slow"
                        >
                          {item.label}
                        </motion.li>
                      ))}
                      {userData && (
                        <motion.li
                          variants={staggerItem}
                          onClick={handleLogout}
                          className="px-4 py-2.5 text-[#e4a4bd] hover:bg-[#f5f0eb] cursor-pointer transition-all-slow border-t border-[#e8e0d3]"
                        >
                          Logout
                        </motion.li>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              )}

              <motion.button
                whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => setMenuOpen((prev) => !prev)}
                className="md:hidden cursor-pointer transition-all-slow"
              >
                {menuOpen ? (
                  <FaTimes size={24} className="text-[#262626]" />
                ) : (
                  <FaBars size={24} className="text-[#262626]" />
                )}
              </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full bg-white/80 backdrop-blur-md border-b border-[#e8e0d3] overflow-hidden"
          >
             <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-4">
                <div className="relative flex-1">
                  <IoSearchCircleOutline size={24} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a6b54]" />
                  <form onSubmit={handleSearchSubmit} className="pl-4">
                    <input
                      type="text"
                      autoFocus
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="What are you looking for?"
                      className="w-full organic-input pl-14 pr-4 py-3 bg-[#f5f0eb]/50 focus:bg-white transition-all-slow"
                    />
                  </form>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(false)}
                  className="p-2 text-[#7a6b54] hover:text-[#e4a4bd] transition-all-slow"
                >
                  <FaTimes size={20} />
                </motion.button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.ul
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden flex flex-col bg-white px-6 py-4 space-y-1 border-t border-[#e8e0d3]"
          >
             {navItems.map((item) => (
              <motion.li
                key={item.label}
                variants={mobileMenuItem}
                onClick={() => handleSecureNavigation(item.path, item.protected)}
                 className="px-4 py-3 text-[#262626] hover:text-[#e4a4bd] hover:bg-[#f5f0eb] rounded-xl cursor-pointer transition-all-slow"

              >
                {item.label}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
