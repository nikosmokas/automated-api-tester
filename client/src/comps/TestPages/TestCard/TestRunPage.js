import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import TestCard from "./TestCard";

const TestRunList = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const testRunId = searchParams.get("testRunId");
  const navigate = useNavigate();

  const [test, setTest] = useState([]);

  useEffect(() => {
    const fetchTestRuns = async () => {
      console.log(
        "Entered endpoint with userId:",
        userId,
        "and testRunId:",
        testRunId
      );
      try {
        const response = await axios.get(
          "/api/tests/availabilityTest/scheduledTests",
          {
            params: { userId, testRunId },
          }
        );
        console.log("API Response:", response.data); // Log the response data

        setTest(response.data);
      } catch (error) {
        console.error("Error fetching test runs:", error);
        setTest([]); // Ensure `test` is always an array
      }
    };

    fetchTestRuns();
  }, [userId, testRunId]);

  return (
    <div className="availability-test-results">
      <button className="button" onClick={() => navigate(-1)}>
        Go back
      </button>{" "}
      <div>
        {test && Array.isArray(test) ? (
          test.length > 0 ? (
            test.map((testRun) => (
              <TestCard key={testRun._id} testRun={testRun} />
            ))
          ) : (
            <h2>No URLs in this test</h2>
          )
        ) : (
          <p>No tests available</p>
        )}
      </div>
    </div>
  );
};

export default TestRunList;
