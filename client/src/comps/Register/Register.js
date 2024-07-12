import { Link, Navigate } from "react-router-dom";
import "./Register.css";
import React, { useState } from "react";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [registered, setRegistered] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false); 

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/register", {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      // Handle successful registration
      console.log("Registration successful:", response.data);

      // Redirect to login page after successful registration
      setRegistered(true);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  if (registered) {
    // Redirect to login page after registration
    return <Navigate to="/login" />;
  }

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <label>
          Email <span className="required">*</span>:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Required"
            required
          />
        </label>
        <label>
          Full Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="If left empty, we will choose one for you! :)"
          />
        </label>
        <label className="password-container">
          Password <span className="required">*</span>:
          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Required"
            required
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordShown ? "Hide" : "Show"}
          </button>
        </label>
        {/* Removed the retype password input for simplicity */}
        <button type="submit">Register</button>
        <p>
          Already have an account? <Link to="/login">Login here</Link>.
        </p>
      </form>
    </div>
  );
};

export default Register;
