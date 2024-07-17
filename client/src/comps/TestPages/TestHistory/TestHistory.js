import React, { useState, useEffect } from "react";

const HistoryBox = ({ title, description, at, nextRun }) => {
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
        <span className="field-name">At:</span>
        <span>{at}</span>
      </div>
      <div className="field">
        <span className="field-name">Next Run:</span>
        <span>{nextRun !== null ? nextRun : "N/A"}</span>
      </div>
    </div>
  );
};

const TestHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/tests/availabilityTest/testhistory"); // Adjust the URL as needed
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching test run history:", error);
      }
    };

    fetchData();
  }, []);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(); // Format date using toLocaleString()
  };
  return (
    <div>
      <h2 className="availabilityTestHeader">Test Runs History</h2>
      {history.map((run) => (
        <HistoryBox
          key={run._id} // Use a unique identifier like _id for the key
          title={run.title}
          description={run.description}
          at={formatDate(run.lastRun)}
          nextRun={run.nextRun ? formatDate(run.nextRun) : "No next run"}
        />
      ))}
    </div>
  );
};

export default TestHistory;
