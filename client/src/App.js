// src/App.js

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Index from "./comps/Index/Index";
import Register from "./comps/Register/Register";
import Login from "./comps/Login/Login";
import Navbar from "./comps/Navbar/Navbar";
import Footer from "./comps/Footer/Footer";
import ErrorPage from "./comps/ErrorPage/ErrorPage";
import TestsDashboard from "./comps/TestsDashboard/TestsDashboard";
import { AuthProvider, useAuth } from "./AuthContext"; // Import AuthProvider and useAuth

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  const { isLoggedIn, name, logout } = useAuth(); // Use useAuth hook to get authentication state

  const handleLogout = () => {
    logout();
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          isLoggedIn={isLoggedIn}
          userName={name}
          handleLogout={handleLogout}
        />
        <div className="container">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tests" element={<TestsDashboard />} />
            <Route
              path="/register"
              element={isLoggedIn ? <Navigate to="/" /> : <Register />}
            />
            <Route
              path="/login"
              element={isLoggedIn ? <Navigate to="/" /> : <Login />}
            />
            <Route path="*" element={<ErrorPage />} />{" "}
            {/* Catch all unmatched routes */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
