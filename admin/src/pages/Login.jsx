import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import  { AuthDataContext } from "../context/AuthContext";
import { AdminDataContext } from "../context/AdminContext";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const {baseUrl} = useContext(AuthDataContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const {adminData, getAdmin} = useContext(AdminDataContext)
  const handleSignin = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(baseUrl+'/api/v1/auth/adminLogin', { email, password}, {withCredentials: true})
      getAdmin()
      navigate('/')
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-indigo-800 text-center mb-4">
          nextMart <span>Admin</span>
        </h1>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="block text-xl font-semibold text-gray-800">
            Login
          </span>
          <span className="block text-gray-500">
            Welcome back to <span className="text-indigo-700">nextMart Admin</span>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSignin} className="space-y-4">

          {/* Divider */}
          

          {/* Inputs */}
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-2 rounded-lg font-medium transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
