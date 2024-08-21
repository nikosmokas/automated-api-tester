import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ScheduledTest.css";
import { useAuth } from "../../../AuthContext";


const Box = ({
  title,
  description,
  recurrency,
  nextRun,
  id,
  onClick,
  onDelete,
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
        <span className="field-name">Recurring:</span>
        <span>{recurrency === null || recurrency === 0 ? "No" : recurrency}</span>
      </div>
      <div className="field">
        <span className="field-name">Next Run:</span>
        <span>{nextRun}</span>
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

const ScheduledTests = () => {
  const [scheduled, setScheduled] = useState([]);
  const [visibleCount, setVisibleCount] = useState(2); // Number of visible items
  const navigate = useNavigate();
  const { email } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userID = email;
        const response = await fetch(
          `/api/tests/availabilityTest/scheduledtests?user=${userID}`
        );
        const data = await response.json();
        console.log("Fetched data:", data);
        setScheduled(data);
      } catch (error) {
        console.error("Error fetching test run scheduled tests:", error);
      }
    };
  
    fetchData();
  }, [email]);
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleBoxClick = (userID, testRunId) => {
    navigate(
      `/tests/availabilityTest/scheduledTestCard?user=${userID}&testRunId=${testRunId}`
    );
  };

  const handleDelete = async (testRunId) => {
    try {
      const response = await fetch(
        `/api/tests/availabilityTest/scheduledtests/${testRunId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setScheduled(scheduled.filter((run) => run._id !== testRunId));
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
      <h2 className="availabilityTestHeader">Scheduled Tests</h2>
      <div className="scheduled-container">
      {Array.isArray(scheduled) && scheduled.slice(0, visibleCount).map((run) => (
          <Box
            key={run._id}
            id={run._id}
            title={run.title}
            description={run.description}
            recurrency={run.recurrency}
            nextRun={formatDate(run.nextRun)}
            onClick={() => handleBoxClick(run.user, run._id)}
            onDelete={() => handleDelete(run._id)}
          />
        ))}
      </div>
      {visibleCount < scheduled.length && (
        <button onClick={showMore} className="view-more-button">
          View More
        </button>
      )}
    </div>
  );
};

export default ScheduledTests;
