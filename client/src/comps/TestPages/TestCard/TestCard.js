import React from "react";
import PropTypes from "prop-types";
import "./TestCard.css";

const TestRun = ({ testRun }) => {
  const { title, description, status, nextRun, recurrency, urls } = testRun;

  // Log the testRun to ensure the data is being passed correctly
  console.log("TestRun data:", testRun);

  let lastRun;
  if (nextRun && recurrency > 0) {
    lastRun = new Date(new Date(nextRun).getTime() - recurrency * 60000);
  } else {
    lastRun = null;
  }

  return (
    <div className="test-run-card">
      <h2 className="test-run-card__title">{title}</h2>
      <p className="test-run-card__description">{description}</p>
      <div className="test-run-card__info">
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>Next Run:</strong>{" "}
          {nextRun ? new Date(nextRun).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>Last Run:</strong>{" "}
          {lastRun ? new Date(lastRun).toLocaleString() : "N/A"}
        </p>
        <p>
          <strong>Recurrency:</strong>{" "}
          {recurrency ? `${recurrency} minutes` : "N/A"}
        </p>
      </div>
      <div className="test-run-card__urls">
        <h3>URLs:</h3>
        <ul>
          {urls && urls.length > 0 ? (
            urls.map((url, index) => (
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))
          ) : (
            <p>No URLs available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

TestRun.propTypes = {
  testRun: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    status: PropTypes.string.isRequired,
    nextRun: PropTypes.string,
    lastRun: PropTypes.string,
    recurrency: PropTypes.number,
    urls: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default TestRun;
