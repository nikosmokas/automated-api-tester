
import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout, email }) => {

  const navigate = useNavigate();

  const handleUserPanelClick = () => {
    if (email) {
      const encodedEmail = encodeURIComponent(email);
      console.log("Navigating to User Panel with email:", encodedEmail);
      navigate(`/user/${encodedEmail}`);
    }
    
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
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
                <button className="nav-link" onClick={handleUserPanelClick}>
                  User Panel
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogoutClick}>
                  Logout
                </button>
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
