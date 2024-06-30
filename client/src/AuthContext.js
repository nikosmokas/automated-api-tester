import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");

  const fetchUserDetails = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName(response.data.name);
    } catch (error) {
      console.error("Error fetching user details:", error);
      logout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails(token);
    } else {
      setIsLoggedIn(false);
    }
  }, [fetchUserDetails]);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchUserDetails(token); // Fetch user details after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setName("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
