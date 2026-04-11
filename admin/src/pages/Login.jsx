import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { AdminDataContext } from "../context/AdminContext";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { baseUrl } = useContext(AuthDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getAdmin } = useContext(AdminDataContext);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "/api/v1/auth/adminLogin", { email, password }, { withCredentials: true });
      getAdmin();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-[#f3efe8] p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#fdfbf7] rounded-3xl shadow-lg p-8"
      >
        <motion.h1
          whileHover={{ scale: 1.02 }}
          className="text-3xl font-display font-semibold text-[#5e5240] text-center mb-6"
        >
          nextMart <span className="text-[#6b7d56]">Admin</span>
        </motion.h1>

        <div className="text-center mb-6">
          <span className="block text-xl font-display font-semibold text-[#3d352b]">
            Login
          </span>
          <span className="block text-[#7a6b54]">
            Welcome back to <span className="text-[#6b7d56]">nextMart Admin</span>
          </span>
        </div>

        <form onSubmit={handleSignin} className="space-y-4">
          <div className="space-y-3">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#d9cec0] rounded-xl bg-white text-[#5e5240] placeholder-[#b39f87] focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all font-body"
            />

            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-3 border border-[#d9cec0] rounded-xl bg-white text-[#5e5240] placeholder-[#b39f87] focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all font-body"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#7a6b54] cursor-pointer hover:text-[#5e5240]"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full bg-[#6b7d56] hover:bg-[#5d6446] text-white py-3 rounded-xl font-medium transition-colors"
            >
              Login
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Login;