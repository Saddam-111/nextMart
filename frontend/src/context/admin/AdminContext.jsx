/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseUrl = import.meta.env.VITE_BASE_URL;

   const checkAdminAuth = useCallback(async () => {
     try {
       const result = await axios.get(
         `${baseUrl}/api/v1/user/getAdmin`,
         { withCredentials: true }
       );
       if (result.data && result.data.email) {
         setAdmin(result.data);
       } else {
         setAdmin(null);
       }
     } catch (error) {
       setAdmin(null);
     } finally {
       setLoading(false);
     }
   }, [baseUrl]);

  useEffect(() => {
    checkAdminAuth();
  }, [checkAdminAuth]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.post(
        `${baseUrl}/api/v1/auth/adminLogin`,
        { email, password },
        { withCredentials: true }
      );
      if (result.data.message === "Login successful") {
        await checkAdminAuth();
        return { success: true };
      }
      return { success: false, message: "Login failed" };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${baseUrl}/api/v1/auth/adminLogout`, {
        withCredentials: true,
      });
      setAdmin(null);
    } catch (error) {
      console.error("Admin logout error:", error);
    }
  };

  const value = {
    admin,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!admin,
    checkAdminAuth,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
