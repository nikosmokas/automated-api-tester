// src/comps/Index.js

import React from "react";
import { Link } from "react-router-dom";
import ParticleBackground from "../ParticleBackground/ParticleBackground"; // Adjust path as necessary
import "./Index.css"; // Import CSS for styling
import { useAuth } from "../../AuthContext";

const Index = () => {
  const { isLoggedIn, name } = useAuth();
  return (
    <div className="index-page">
      <ParticleBackground />
      <div className="content">
        {isLoggedIn ? (
          <>
            <h1>Welcome, {name}!</h1>
            <p>Explore your automated API testing journey.</p>
            <Link to="/">
              <button>Start Testing</button>
            </Link>
          </>
        ) : (
          <>
            <h1>Welcome to Automated API Tester</h1>
            <p>Please log in or register.</p>
            <Link to="/login">
              <button>Login</button>
            </Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
