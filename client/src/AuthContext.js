import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    // Check localStorage for token on component mount (like app start)
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails(token);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const login = (token) => {
    // Save token to localStorage
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  const fetchUserDetails = async (token) => {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName(response.data.name);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // Handle error (e.g., logout user if token is invalid)
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
