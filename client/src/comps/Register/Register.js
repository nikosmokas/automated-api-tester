// src/comps/Register.js

import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="register-page">
      <form className="register-form">
        <h2>Register</h2>
        <label>
          Email <span className="required">*</span>:
          <input type="email" placeholder="Required" required />
        </label>
        <label>
          Full Name:
          <input
            type="text"
            placeholder="If left empty, we will chose one for you! :)"
          />
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
        <label className="retype-password-container">
          Retype Password <span className="required">*</span>:
          <input type="password" placeholder="Required" required />
        </label>
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </form>
    </div>
  );
};

export default Register;
