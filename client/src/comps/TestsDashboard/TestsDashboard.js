// src/comps/TestsDashboard/TestsDashboard.js

import "./TestsDashboard.css";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const TestsDashboard = () => {
  return (
    <div className="tests-dashboard">
      <h1>Tests Dashboard</h1>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <img src="/images/endpoint-tests.png" alt="Endpoint tests" />
          <button>Availability Tests</button>
          <p>Enter a list of URLs and see if they work!</p>
        </div>
        <div className="dashboard-card">
          <img src="/images/performance-tests.jpg" alt="Performance Tests" />
          <button>Performance Tests</button>
          <p>WIP</p>
        </div>
        <div className="dashboard-card">
          <img src="/images/security-tests.jpg" alt="Security Tests" />
          <button>Security Tests</button>
          <p>WIP</p>
        </div>
      </div>
    </div>
  );
};

export default TestsDashboard;
