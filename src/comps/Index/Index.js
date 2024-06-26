// src/comps/Index.js

import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      <h1>Welcome to Automated API Tester</h1>
      <p>This is the index page.</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
};

export default Index;
