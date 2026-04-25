import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAdmin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf8f3] to-[#f5f0eb] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-4xl font-display font-bold text-[#262626] tracking-tighter"
          >
            nextMart<span className="text-[#e4a4bd]">Admin</span>
          </motion.h1>
          <p className="mt-2 text-[#7a6b54]">Admin Panel Login</p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8 organic-card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="organic-input w-full"
                placeholder="admin@nextmart.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#262626] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="organic-input w-full"
                placeholder="••••••••"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] disabled:opacity-50 py-3"
            >
              {loading ? "Signing in..." : "Sign In"}
            </motion.button>
          </form>
        </motion.div>

        <p className="text-center text-sm text-[#7a6b54] mt-6">
          NextMart Admin Panel v1.0
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
