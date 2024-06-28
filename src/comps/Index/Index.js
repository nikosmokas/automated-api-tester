// src/comps/Index.js

import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../ParticleBackground/ParticleBackground'; // Adjust path as necessary
import './Index.css'; // Import CSS for styling

const Index = () => {
  return (
    <div className="index-page">
      <ParticleBackground />
      <div className="content">
        <h1>Welcome to Automated API Tester</h1>
        <p>Please log in or register.</p>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/register">
          <button>Register</button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
