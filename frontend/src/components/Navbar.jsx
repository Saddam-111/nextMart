import React, { useContext, useState, useRef, useEffect } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoSearchCircleOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { FaCircleUser } from "react-icons/fa6";
import { FaBars, FaTimes } from "react-icons/fa";
import { ShopDataContext } from "../context/ShopContext";

const Navbar = () => {
  const { userData, getCurrentUser,setUserData, baseUrl } = useContext(userDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCartCount } =
    useContext(ShopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      const result = await axios.get(baseUrl + "/api/v1/auth/logout", {
        withCredentials: true,
      });
      console.log(result.data);
      setUserData(null)
      getCurrentUser();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search) {
      navigate("/collection");
    }
  };

  // ✅ helper to navigate securely
  const handleSecureNavigation = (path, isProtected = false) => {
    if (isProtected && !userData) {
      navigate("/login");
    } else {
      navigate(path);
    }
    setMenuOpen(false);
    setShowProfile(false);
  };

  // Close profile dropdown if clicked outside
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

  const handleSearchToggle = () => {
    setShowSearch((prev) => !prev);
    if (!showSearch) setSearch("");
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <h1
          onClick={() => handleSecureNavigation("/")}
          className="text-2xl font-bold text-indigo-800 cursor-pointer"
        >
          nextMart
        </h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/")}
          >
            HOME
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/collection")}
          >
            COLLECTION
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/about")}
          >
            ABOUT
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/contact", true)}
          >
            CONTACT
          </li>
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          <IoSearchCircleOutline
            size={28}
            className="text-gray-600 cursor-pointer hover:text-indigo-700"
            onClick={handleSearchToggle}
          />

          {!userData && (
            <FaCircleUser
              size={28}
              className="text-gray-600 cursor-pointer hover:text-indigo-700"
              onClick={() => navigate("/login")}
            />
          )}

          {userData && (
            <div
              onClick={() => setShowProfile((prev) => !prev)}
              className="w-9 h-9 flex items-center justify-center bg-indigo-700 text-white rounded-full cursor-pointer"
            >
              {userData?.name?.slice(0, 1).toUpperCase()}
            </div>
          )}

          {/* Shopping Cart with Count */}
          <div
            className="relative cursor-pointer"
            onClick={() => handleSecureNavigation("/cart", true)}
          >
            <MdOutlineShoppingCart
              size={28}
              className="text-gray-600 hover:text-indigo-700"
            />
          
              <p className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {getCartCount()}
              </p>
            
          </div>

          {/* Mobile Hamburger */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col bg-white shadow-md px-6 py-4 space-y-3">
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/")}
          >
            HOME
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/collection")}
          >
            COLLECTION
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/about")}
          >
            ABOUT
          </li>
          <li
            className="hover:text-indigo-700 cursor-pointer"
            onClick={() => handleSecureNavigation("/contact", true)}
          >
            CONTACT
          </li>
        </ul>
      )}

      {/* Search Bar */}
      {showSearch && (
        <div className="w-full bg-gray-100 px-6 py-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
            placeholder="Search products..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      )}

      {/* Profile Dropdown */}
      {showProfile && (
        <div
          ref={profileDropdownRef}
          className="absolute right-6 mt-2 bg-white shadow-lg rounded-lg py-2 w-40 text-gray-700 font-medium"
        >
          <li
            onClick={() => handleSecureNavigation("/orders", true)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Orders
          </li>
          <li
            onClick={() => handleSecureNavigation("/about")}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            About
          </li>
          {userData && (
            <li
              onClick={() => {
                handleLogout();
                setShowProfile(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </li>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
