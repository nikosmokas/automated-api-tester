// ControlPanel.js

import React, { useState } from "react";
import Information from "./ControlPanelComps/Information/Information";
import ChangeUsername from "./ControlPanelComps/ChangeName/ChangeName";
import ChangePassword from "./ControlPanelComps/ChangePassword/ChangePassword";
import "./ControlPanel.css";
import { useAuth } from "../../AuthContext";

const ControlPanel = () => {
  const [selectedOption, setSelectedOption] = useState("Information");
  const { name, email, creationDate } = useAuth();

  const renderContent = () => {
    switch (selectedOption) {
      case "Information":
        return <Information name={name} email={email} creationDate={creationDate} />;
      case "Settings":
        return (
          <div className="settings-container">
            <ChangeUsername />
            <ChangePassword />
          </div>
        );
      case "Availability Tests":
        return (
          <div className="test-section">
            <h3>Upcoming Tests</h3>
            {/* Render upcoming tests here */}
          </div>
        );
      case "Test History":
        return (
          <div className="test-section">
            <h3>Test History</h3>
            {/* Render test history here */}
          </div>
        );
      case "Performance Tests":
        return (
          <div className="test-section">
            <h3>Performance Tests</h3>
            {/* Render performance tests here */}
          </div>
        );
      case "Security Tests":
        return (
          <div className="test-section">
            <h3>Security Tests</h3>
            {/* Render security tests here */}
          </div>
        );
      default:
        return <div>Select an option from the left panel.</div>;
    }
  };

  return (
    <div className="control-panel-container">
      <div className="control-panel-sidebar">
        <ul>
          <li
            className={selectedOption === "Information" ? "active" : ""}
            onClick={() => setSelectedOption("Information")}
          >
            Information
          </li>
          <li
            className={selectedOption === "Settings" ? "active" : ""}
            onClick={() => setSelectedOption("Settings")}
          >
            Settings
          </li>
          <li
            className={selectedOption === "Availability Tests" ? "active" : ""}
            onClick={() => setSelectedOption("Availability Tests")}
          >
            Availability Tests
          </li>
          <li
            className={selectedOption === "Performance Tests" ? "active" : ""}
            onClick={() => setSelectedOption("Performance Tests")}
          >
            Performance Tests
          </li>
          <li
            className={selectedOption === "Security Tests" ? "active" : ""}
            onClick={() => setSelectedOption("Security Tests")}
          >
            Security Tests
          </li>
        </ul>
      </div>
      <div className="control-panel-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default ControlPanel;
