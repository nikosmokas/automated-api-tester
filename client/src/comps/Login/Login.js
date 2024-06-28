// src/comps/Login.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="login-page">
      <form className="login-form">
        <h2>Login</h2>
        <label>
          Email <span className="required">*</span>:
          <input type="email" placeholder="Required" required />
        </label>
        <label className="password-container">
          Password <span className="required">*</span>:
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="Required"
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordShown ? "Hide" : "Show"}
          </button>
        </label>
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </form>
    </div>
  );
};

export default Login;
