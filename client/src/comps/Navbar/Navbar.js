
import React from "react";
import "./Navbar.css";
import { Link, Navigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout, userName }) => {
  const handleLogoutClick = () => {
    handleLogout();
    Navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          Automated API Tester
        </Link>
        <ul className="navbar-nav">
          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={handleLogoutClick}>
                  Logout
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
