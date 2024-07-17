import React, { useState, useEffect } from "react";
import "./ScheduledTest.css";

const Box = ({ title, description, recurrency, nextRun }) => {
  return (
    <div className="box">
      <div className="title">
        <span>{title}</span>
      </div>
      <hr style={{ width: "100%", border: "1px solid #fff" }} />
      <div className="field">
        <span className="field-name">Description:</span>
        <span>{description}</span>
      </div>
      <div className="field">
        <span className="field-name">Recurring:</span>
        <span>{recurrency !== null ? recurrency : "No"}</span>
      </div>
      <div className="field">
        <span className="field-name">Next Run:</span>
        <span>{nextRun}</span>
      </div>
    </div>
  );
};

const ScheduledTests = ({ tests }) => {
  const [scheduled, setScheduled] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "/api/tests/availabilityTest/scheduledtests"
        ); // Adjust the URL as needed
        const data = await response.json();
        setScheduled(data);
      } catch (error) {
        console.error("Error fetching test run scheduledtests:", error);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(); // Format date using toLocaleString()
  };

  return (
    <div>
      <h2 className="availabilityTestHeader">Scheduled Tests</h2>
      {scheduled.map((run) => (
        <Box
          key={run._id}
          title={run.title}
          description={run.description}
          recurrency={run.recurrency}
          nextRun={formatDate(run.nextRun)}
        />
      ))}
    </div>
  );
};

export default ScheduledTests;
