import React from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css"; // Import CSS for ErrorPage styles

const ErrorPage = () => {
  return (
    <div className="index-page">
      <div className="content">
        <h1>Oops! Something went wrong.</h1>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="btn">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
