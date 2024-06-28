// src/App.js

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./comps/Index/Index";
import Register from "./comps/Register/Register";
import Login from "./comps/Login/Login";
import Navbar from "./comps/Navbar/Navbar";
import Footer from "./comps/Footer/Footer";
import { AuthProvider } from "./AuthContext";

const App = () => {
  const isLoggedIn = false;
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar isLoggedIn={isLoggedIn} />
          <div className="container">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
