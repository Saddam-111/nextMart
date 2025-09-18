import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDataContext } from "../context/AdminContext";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { FiMenu } from "react-icons/fi";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { getAdmin } = useContext(AdminDataContext);
  const { baseUrl } = useContext(AuthDataContext);

  const logout = async () => {
    try {
      await axios.get(baseUrl + "/api/v1/auth/logout", {
        withCredentials: true,
      });
      getAdmin();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm flex items-center justify-between px-4 py-2">
      {/* Sidebar Toggle (mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
      >
        <FiMenu size={22} />
      </button>

      {/* Brand */}
      <h1 className="text-xl font-bold text-gray-800" onClick={() => navigate('/')}>
        nextMart <span className="text-indigo-600 cursor-pointer">Admin</span>
      </h1>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
