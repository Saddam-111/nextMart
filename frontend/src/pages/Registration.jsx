import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";
import { motion } from "framer-motion";

const Registration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { baseUrl } = useContext(AuthDataContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const { getCurrentUser } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "/api/v1/auth/register", { name, email, password }, { withCredentials: true });
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const name = user.displayName;
      const email = user.email;
      await axios.post(baseUrl + "/api/v1/auth/googlelogin", { name, email }, { withCredentials: true });
      getCurrentUser();
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
          nextMart
        </motion.h1>

        <div className="text-center mb-6">
          <span className="block text-xl font-display font-semibold text-[#3d352b]">
            Create Account
          </span>
          <span className="block text-[#7a6b54] mt-1">
            Join <span className="text-[#6b7d56]">nextMart</span> today
          </span>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={googleSignup}
            className="w-full flex items-center justify-center gap-2 bg-[#5e5240] hover:bg-[#4a4536] text-white py-3 rounded-xl font-medium transition-colors"
          >
            <FaGoogle /> Continue with Google
          </motion.button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-[#d9cec0]"></div>
            <span className="px-3 text-[#9e866b] text-sm">OR</span>
            <div className="flex-1 h-px bg-[#d9cec0]"></div>
          </div>

          <div className="space-y-3">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-4 py-3 border border-[#d9cec0] rounded-xl bg-white text-[#5e5240] placeholder-[#b39f87] focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all"
            />

            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-[#d9cec0] rounded-xl bg-white text-[#5e5240] placeholder-[#b39f87] focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all"
            />

            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-[#d9cec0] rounded-xl bg-white text-[#5e5240] placeholder-[#b39f87] focus:outline-none focus:border-[#6b7d56] focus:ring-2 focus:ring-[#6b7d56]/20 transition-all"
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
              Create Account
            </motion.button>
          </div>
        </form>

        <p className="text-center text-sm text-[#7a6b54] mt-6 font-body">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-[#9e866b] hover:underline cursor-pointer font-medium"
          >
            Sign in
          </span>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Registration;