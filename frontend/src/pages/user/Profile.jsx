import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../../context/user/UserContext";
import { motion } from "framer-motion";

const Profile = () => {
  const { userData } = useContext(userDataContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
          country: "",
        },
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        setSuccess("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const errData = await response.json();
        setError(errData.message || "Failed to update password");
      }
    } catch (error) {
      console.error("Password update error:", error);
      setError("An error occurred while updating password");
    } finally {
      setLoading(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#fdf8f3]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4 text-[#262626]">Please log in to view your profile</h2>
          <motion.button
            whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            onClick={() => navigate("/login")}
            className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad]"
          >
            Login
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdf8f3] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 relative">
          <button 
            onClick={() => window.history.back()} 
            className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 text-[#7a6b54] hover:text-[#e4a4bd] hidden md:block"
          >
            ← Back
          </button>
          <div className="sm:pl-5">
            <h1 className="text-3xl font-display font-bold text-[#262626]">My Account</h1>
            <p className="text-[#7a6b54] mt-1">Manage your profile and security settings</p>
          </div>
        </div>

        {/* Success/Error Alerts */}
        {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">{error}</div>}
        {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl mb-6">{success}</div>}

        <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden organic-card border border-[#e4a4bd]/10">
          <div className="border-b border-[#e4a4bd]/10">
            <nav className="flex -mb-px">
              <motion.button
                whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => setActiveTab("profile")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all-slow ${
                  activeTab === "profile"
                    ? "border-[#e4a4bd] text-[#e4a4bd]"
                    : "border-transparent text-gray-500 hover:text-[#e4a4bd]"
                }`}
              >
                Profile Information
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                onClick={() => setActiveTab("password")}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all-slow ${
                  activeTab === "password"
                    ? "border-[#e4a4bd] text-[#e4a4bd]"
                    : "border-transparent text-gray-500 hover:text-[#e4a4bd]"
                }`}
              >
                Change Password
              </motion.button>
            </nav>
          </div>

          {/* Profile Information Tab */}
          {activeTab === "profile" && (
            <form onSubmit={handleProfileUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="organic-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="organic-input w-full"
                    required
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="organic-input w-full"
                  />
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t border-[#e4a4bd]/30 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleInputChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleInputChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleInputChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleInputChange}
                      className="organic-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleInputChange}
                      className="organic-input w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  type="submit"
                  disabled={loading}
                  className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </motion.button>
              </div>
            </form>
          )}

          {/* Password Change Tab */}
          {activeTab === "password" && (
            <form onSubmit={handlePasswordUpdate} className="p-6 space-y-6">
              <div className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="organic-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="organic-input w-full"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="organic-input w-full"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
                  type="submit"
                  disabled={loading}
                  className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Password"}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
