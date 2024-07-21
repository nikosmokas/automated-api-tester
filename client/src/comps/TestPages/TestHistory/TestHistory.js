import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HistoryBox = ({ title, description, at, nextRun, onClick, onDelete }) => {
  return (
    <div className="box" onClick={onClick} style={{ cursor: "pointer" }}>
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
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent the click from triggering the onClick event for the box
          onDelete(); // Call the onDelete function passed as prop
        }}
      >
        Delete
      </button>
    </div>
  );
};

const TestHistory = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

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

  const handleBoxClick = (testRunId, userID) => {
    // Navigate to the test result page with the userId and testRunId as query parameters
    navigate(
      `/tests/availabilityTest/results?user=${userID}&testRunId=${testRunId}`
    );
  };

  const handleDelete = async (testRunId) => {
    try {
      // Call the API to delete the test
      const response = await fetch(
        `/api/tests/availabilityTest/testhistory/${testRunId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Remove the test from the state
        setHistory(history.filter((run) => run._id !== testRunId));
      } else {
        console.error("Error deleting test:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <div>
      <h2 className="availabilityTestHeader">Test Runs History</h2>
      <div className="history-container">
        {history.map((run) => (
          <HistoryBox
            key={run._id} // Use a unique identifier like _id for the key
            title={run.title}
            description={run.description}
            at={formatDate(run.lastRun)}
            nextRun={run.nextRun ? formatDate(run.nextRun) : "No next run"}
            onClick={() => handleBoxClick(run._id, run.user)} // Pass the test run ID to handleBoxClick
            onDelete={() => handleDelete(run._id)} // Pass the test run ID to handleDelete
          />
        ))}
      </div>
    </div>
  );
};

export default TestHistory;
