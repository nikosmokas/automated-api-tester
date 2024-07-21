import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./AvailabilityTestResults.css";

const AvailabilityTestResult = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const testRunId = searchParams.get("testRunId");
  const navigate = useNavigate(); // Initialize navigate

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      console.log(
        "Entered endpoint with userId:",
        userId,
        "and testRunId:",
        testRunId
      );
      try {
        const response = await axios.get(
          "/api/tests/availabilityTest/results",
          {
            params: { userId, testRunId },
          }
        );
        setResults(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching availability test results:", error);
        // Handle error state if needed
        setLoading(false); // Stop loading even if there's an error
      }
    };

    if (userId && testRunId) {
      fetchResults();
    } else {
      console.error("Missing userId or testRunId");
      setLoading(false); // Stop loading if required parameters are missing
    }
  }, [userId, testRunId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="availability-test-results">
      <h1 id="header">Availability Test Results</h1>
      <button className="button" onClick={() => navigate(-1)}>
        Go back
      </button>{" "}
      {/* Go back button */}
      <div className="results-container">
        {results.length === 0 ? (
          <p>No results found for this test run.</p>
        ) : (
          <ul className="results-list">
            {results.map((result) => (
              <li key={result._id} className="result-item">
                <span className="url">{result.url}</span>
                <span className={`status ${result.result.toLowerCase()}`}>
                  {result.result}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailabilityTestResult;
