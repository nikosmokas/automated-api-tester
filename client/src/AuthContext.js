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
  const [email, setEmail] = useState("");

  const fetchUserDetails = useCallback(async (token) => {
    try {
      const response = await axios.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setName(response.data.name);
      setEmail(response.data.email);
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
    setEmail("");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, name, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
