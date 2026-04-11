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
  const { showSearch, setShowSearch, search, setSearch, getCartCount } =
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
    { label: "Orders", path: "/orders" },
    { label: "About", path: "/about" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-[#fdfbf7] shadow-sm fixed top-0 left-0 w-full z-50 border-b border-[#e8e0d3]"
    >
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <motion.h1
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleSecureNavigation("/")}
          className="text-2xl font-display font-semibold text-[#5e5240] cursor-pointer"
        >
          nextMart
        </motion.h1>

        <ul className="hidden md:flex space-x-8 text-[#7a6b54] font-medium">
          {navItems.map((item, index) => (
            <motion.li
              key={item.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ color: "#5e5240" }}
              className="cursor-pointer relative group"
              onClick={() => handleSecureNavigation(item.path, item.protected)}
            >
              {item.label}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-[#9e866b]"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </motion.li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSearchOpen((prev) => !prev)}
            className="text-[#7a6b54] cursor-pointer hover:text-[#5e5240]"
          >
            <IoSearchCircleOutline size={28} />
          </motion.button>

          {!userData && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="text-[#7a6b54] cursor-pointer hover:text-[#5e5240]"
            >
              <FaCircleUser size={28} />
            </motion.button>
          )}

          {userData && (
            <div className="relative" ref={profileDropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfile((prev) => !prev)}
                className="w-9 h-9 flex items-center justify-center bg-[#6b7d56] text-white rounded-full cursor-pointer"
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
                    {dropdownItems.map((item, index) => (
                      <motion.li
                        key={item.label}
                        variants={staggerItem}
                        onClick={() => handleSecureNavigation(item.path, item.protected)}
                        className="px-4 py-2.5 text-[#5e5240] hover:bg-[#f3efe8] cursor-pointer transition-colors"
                      >
                        {item.label}
                      </motion.li>
                    ))}
                    {userData && (
                      <motion.li
                        variants={staggerItem}
                        onClick={handleLogout}
                        className="px-4 py-2.5 text-[#965639] hover:bg-[#fdf8f5] cursor-pointer transition-colors border-t border-[#e8e0d3]"
                      >
                        Logout
                      </motion.li>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative cursor-pointer"
            onClick={() => handleSecureNavigation("/cart", true)}
          >
            <MdOutlineShoppingCart
              size={28}
              className="text-[#7a6b54] hover:text-[#5e5240]"
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
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? (
              <FaTimes size={24} className="text-[#5e5240]" />
            ) : (
              <FaBars size={24} className="text-[#5e5240]" />
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
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="w-full bg-[#f3efe8] px-6 py-3">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2.5 border border-[#d9cec0] rounded-xl bg-white focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all"
                />
              </form>
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
            {navItems.map((item, index) => (
              <motion.li
                key={item.label}
                variants={mobileMenuItem}
                onClick={() => handleSecureNavigation(item.path, item.protected)}
                className="px-4 py-3 text-[#7a6b54] hover:text-[#5e5240] hover:bg-[#f3efe8] rounded-xl cursor-pointer transition-colors"
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