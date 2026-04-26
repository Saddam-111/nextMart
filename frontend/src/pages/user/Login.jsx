import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthDataContext } from "../../context/user/AuthContext";
import { userDataContext } from "../../context/user/UserContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../../utils/Firebase";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { baseUrl } = useContext(AuthDataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { getCurrentUser } = useContext(userDataContext);

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      await axios.post(baseUrl + "/api/v1/auth/login", { email, password }, { withCredentials: true });
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const googleLogin = async () => {
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
        className="w-full max-w-md bg-[#fdf8f3] rounded-3xl shadow-lg p-8 organic-card"
      >
        <motion.h1
          whileHover={{ scale: 1.02 }}
          className="text-3xl font-display font-semibold text-[#262626] text-center mb-6"
        >
          nextMart
        </motion.h1>

        <div className="text-center mb-6">
          <span className="block text-xl font-display font-semibold text-[#3d352b]">
            Welcome Back
          </span>
          <span className="block text-[#7a6b54] mt-1">
            Sign in to continue to <span className="text-[#6b7d56]">nextMart</span>
          </span>
        </div>

        <form onSubmit={handleSignin} className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            type="button"
            onClick={googleLogin}
            className="w-full flex items-center justify-center gap-2 bg-[#5e5240] hover:bg-[#4a4536] text-white py-3 rounded-xl font-medium transition-all-slow organic-btn"
          >
            <FaGoogle /> Continue with Google
          </motion.button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-[#e4a4bd]/30"></div>
            <span className="px-3 text-[#9e866b] text-sm">OR</span>
            <div className="flex-1 h-px bg-[#e4a4bd]/30"></div>
          </div>

          <div className="space-y-3">
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full organic-input"
            />

            <div className="relative">
              <motion.input
                whileFocus={{ scale: 1.01 }}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full organic-input pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-[#7a6b54] cursor-pointer hover:text-[#262626] transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              type="submit"
              className="w-full organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
            >
              Sign In
            </motion.button>
          </div>
        </form>

         <p className="text-center text-sm text-[#7a6b54] mt-6 font-body">
           Don't have an account?{" "}
           <span
             onClick={() => navigate("/signup")}
             className="text-[#9e866b] hover:underline cursor-pointer font-medium"
           >
             Register here
           </span>
         </p>
         <p className="text-center text-sm text-[#7a6b54] mt-2 font-body">
           Admin?{" "}
           <span
             onClick={() => navigate("/admin/login")}
             className="text-[#9e866b] hover:underline cursor-pointer font-medium"
           >
             Admin Login
           </span>
         </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
