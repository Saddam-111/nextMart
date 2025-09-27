import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios"
import { AuthDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/Firebase";

const Registration = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {baseUrl} = useContext(AuthDataContext)
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const {getCurrentUser} = useContext(userDataContext)
  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const result = await axios.post(baseUrl+'/api/v1/auth/register', {name, email, password}, {withCredentials: true})
      getCurrentUser()
      navigate('/')
      // console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const googleSignup = async () => {
    try {
      
      const response = await signInWithPopup(auth,provider)
      const user = response.user
      const name = user.displayName;
      const email = user.email

      const result = await axios.post(baseUrl + '/api/v1/auth/googlelogin', {name, email}, {withCredentials: true})
      // console.log(result.data)
      getCurrentUser()
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        {/* Logo */}
        <h1 className="text-3xl font-bold text-indigo-800 text-center mb-4">
          nextMart
        </h1>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="block text-xl font-semibold text-gray-800">
            Registration Page
          </span>
          <span className="block text-gray-500">
            Welcome to <span className="text-indigo-700">nextMart</span>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Google Sign Up */}
          <button
            type="button"
            onClick={googleSignup}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
          >
            <FaGoogle /> Register with Google
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Inputs */}
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

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
                placeholder="Password"
                value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Create Account
            </button>
          </div>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-amber-500 hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registration;
