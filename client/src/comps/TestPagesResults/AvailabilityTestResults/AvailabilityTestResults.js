import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AvailabilityTestResults.css';

const AvailabilityTestResults = ({ userId, testRunId }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
        console.log("Entered endpoint");
      try {
        const response = await axios.get('/api/tests/availabilityTest/results', {
          params: { userId, testRunId }
        });
        setResults(response.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching availability test results:', error);
        // Handle error state if needed
      }
    };

    fetchResults();
  }, [userId, testRunId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="availability-test-results">
      <h1 className="header">Availability Test Results</h1>
      <div className="results-container">
        {results.length === 0 ? (
          <p>No results found for this test run.</p>
        ) : (
          <ul className="results-list">
            {results.map((result, index) => (
              <li key={index} className="result-item">
                <span className="url">{result.url}</span>
                <span className={`status ${result.result.toLowerCase()}`}>{result.result}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailabilityTestResults;
