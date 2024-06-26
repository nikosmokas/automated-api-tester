// src/comps/Register.js

import React from "react";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>
          Username:
          <input type="text" />
        </label>
        <label>
          Password:
          <input type="password" />
        </label>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
};

export default Register;
