import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../AuthContext"; // Adjust path as needed
import "./Login.css";

const Login = () => {
  const { login } = useAuth(); // Use login function from AuthContext
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [passwordShown, setPasswordShown] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/api/login", {
        email: formData.email,
        password: formData.password,
      });

      // Assuming login is successful and response.data contains token
      login(response.data.token); // Use login function from context
    } catch (error) {
      console.error("Error logging in:", error);
      setLoginError("Invalid credentials. Please try again.");
    }
  };

  // Redirect to home page if user is logged in
  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {loginError && <p className="error-message">{loginError}</p>}
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
        <button type="submit">Login</button>
        <p>
          Don't have an account? <Link to="/register">Register here</Link>.
        </p>
      </form>
    </div>
  );
};

export default Login;
