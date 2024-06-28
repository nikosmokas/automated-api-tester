// src/comps/Footer/Footer.js

import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        &copy; {new Date().getFullYear()} Automated API Tester. All rights
        reserved.
      </p>
    </footer>
  );
};

export default Footer;
