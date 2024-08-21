import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TestHistory.css";
import { useAuth } from "../../../AuthContext";


const HistoryBox = ({
  title,
  description,
  status,
  at,
  nextRun,
  onClick,
  onDelete,
  id,
}) => {
  return (
    <div className="box" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="title-container">
        <div className="title">
          <span>{title}</span>
        </div>
        <div className="test-id">ID: {id}</div>
        <div className="title-line"></div>
      </div>
      <hr style={{ width: "100%", border: "1px solid #fff" }} />
      <div className="field">
        <span className="field-name">Description:</span>
        <span>{description}</span>
      </div>
      <div className="field">
        <span className="field-name">Status:</span>
        <span>{status}</span>
      </div>
      <div className="field">
        <span className="field-name">Ran At:</span>
        <span>{at}</span>
      </div>
      <div className="field">
        <span className="field-name">Next Run:</span>
        <span>{nextRun !== null ? nextRun : "N/A"}</span>
      </div>
      <button
        id="deleteButton"
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
  const [visibleCount, setVisibleCount] = useState(2); // Number of visible items
  const navigate = useNavigate();
  const { email } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = email;
        const response = await fetch(`/api/tests/availabilityTest/testhistory?user=${userID}`); // Adjust the URL as needed
        const data = await response.json();
        console.log("Fetched data:", data);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching test run history:", error);
      }
    };

    fetchData();
  }, [email]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleBoxClick = (testRunId, userID) => {
    navigate(
      `/tests/availabilityTest/results?user=${userID}&testRunId=${testRunId}`
    );
  };

  const handleDelete = async (testRunId) => {
    try {
      const response = await fetch(
        `/api/tests/availabilityTest/testhistory/${testRunId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setHistory(history.filter((run) => run._id !== testRunId));
      } else {
        console.error("Error deleting test:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const showMore = () => {
    setVisibleCount((prevCount) => prevCount + 2); // Show 2 more items
  };

  return (
    <div>
      <h2 className="availabilityTestHeader">Test Runs History</h2>
      <div className="history-container">
      {Array.isArray(history) && history.slice(0, visibleCount).map((run) => (
          <HistoryBox
            key={run._id}
            id={run._id}
            title={run.title}
            description={run.description}
            status={run.status}
            at={formatDate(run.lastRun)}
            nextRun={run.nextRun ? formatDate(run.nextRun) : "No next run"}
            onClick={() => handleBoxClick(run._id, run.user)}
            onDelete={() => handleDelete(run._id)}
          />
        ))}
      </div>
      {visibleCount < history.length && (
        <button onClick={showMore} className="view-more-button">
          View More
        </button>
      )}
    </div>
  );
};

export default TestHistory;
