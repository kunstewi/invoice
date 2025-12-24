import React, { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../src/utils/axiosInstance";
import API_PATHS from "../src/utils/apiPaths";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.auth.register,
        userData
      );

      if (response.data.success) {
        const { token, ...userInfo } = response.data.data;

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));

        // Update state
        setUser(userInfo);
        setIsAuthenticated(true);

        toast.success("Registration successful!");
        return { success: true };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.auth.login,
        credentials
      );

      if (response.data.success) {
        const { token, ...userInfo } = response.data.data;

        // Save to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userInfo));

        // Update state
        setUser(userInfo);
        setIsAuthenticated(true);

        toast.success("Login successful!");
        return { success: true };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.response?.data?.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
  };

  // Update user data
  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
