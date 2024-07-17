import React from "react";
import { Link } from "react-router-dom";
import ScheduledTests from "../ScheduledTests/ScheduledTest";
import TestHistory from "../TestHistory/TestHistory";
import NewTest from "../NewTest/NewTest";
import "./AvailabilityTest.css";

const zAvailabilityTest = () => {
  return (
    <div className="container">
      <div className="topSection">
        <div className="leftSection">
          <ScheduledTests />
        </div>
        <div className="middleLine" />
        <div className="rightSection">
          <TestHistory />
        </div>
      </div>
      <hr style={{ width: "90%", border: "1px solid #fff" }} />
      <div className="newTestSection">
        <NewTest />
      </div>
      <Link to="/tests" className="backToDash">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AvailabilityTest;
