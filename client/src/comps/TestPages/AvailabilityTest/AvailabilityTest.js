import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext"; // Adjust the path to your AuthContext file
import "./AvailabilityTest.css";

const AvailabilityTest = () => {
  const navigate = useNavigate();
  const { email } = useAuth(); // Accessing user email from AuthContext
  const [userId, setUserId] = useState(null); // State to hold userId (email)
  const [user, setUser] = useState(null); // State to hold userId (email)
  const [testRunId, setTestRunId] = useState(null); // State to hold userId (email)
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [testsCompleted, setTestsCompleted] = useState(false); // State to track test completion

  useEffect(() => {
    if (email) {
      setUserId(email);
    }
    const savedUrls = sessionStorage.getItem("savedUrls");
    if (savedUrls) {
      setUrls(JSON.parse(savedUrls));
    }
  }, [email]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddUrl = () => {
    if (inputValue) {
      const newUrls = [...urls, inputValue];
      setUrls((prevUrls) => [...prevUrls, inputValue]);
      setInputValue("");
      sessionStorage.setItem("savedUrls", JSON.stringify(newUrls));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const fileUrls = content.split("\n").filter((url) => url.trim() !== "");
        setUrls((prevUrls) => [...prevUrls, ...fileUrls]);

        sessionStorage.setItem("savedUrls", JSON.stringify(fileUrls));
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveUrl = (indexToRemove) => {
    setUrls((prevUrls) =>
      prevUrls.filter((url, index) => index !== indexToRemove)
    );
    const newUrls = urls.filter((_, index) => index !== indexToRemove);
    sessionStorage.setItem("savedUrls", JSON.stringify(newUrls));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddUrl();
    }
  };

  const handleSendToBackend = async () => {
    setLoading(true); // Set loading to true when starting tests
    try {
      const response = await axios.post("/api/tests/availabilityTest/", {
        userId,
        urls: urls, // Send the `urls` array to backend
      });

      console.log("Response from server:", response.data);

      // Extract testRunId from the top level of the response data
      const testRunId = response.data.results[0].testRun;

      // Extract user from the first result in the results array
      const user = response.data.results[0].user;

      setTestRunId(testRunId);
      setUser(user);
      // Log extracted values
      console.log("Extracted testRunId:", testRunId);
      console.log("Extracted user:", user);
      setLoading(false); // Set loading to false when tests are done
      setTestsCompleted(true); // Set testsCompleted to true after tests finish
    } catch (error) {
      console.error("Error sending data to server:", error);
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    if (testsCompleted && user && testRunId) {
      // Navigate to results page with URL parameters
      navigate(
        `/tests/availabilityTest/results?user=${encodeURIComponent(
          user
        )}&testRunId=${encodeURIComponent(testRunId)}`
      );
    }
  }, [testsCompleted, user, testRunId, navigate]);

  return (
    <div className="container">
      <h1 className="header">Availability Test</h1>
      <div className="inputContainer">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter URL"
          className="input"
        />
        <button onClick={handleAddUrl} className="button">
          Add URL
        </button>
      </div>
      <div className="fileUploadContainer">
        <label htmlFor="fileUpload" className="fileUploadLabel">
          Upload .txt file
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".txt"
          onChange={handleFileUpload}
          className="fileInput"
        />
      </div>

      <h2 id="URLheader">URL List</h2>
      <div className="urlListContainer">
        <ul className="urlList">
          {urls.map((url, index) => (
            <li key={index} className="urlItem">
              {url}
              <button
                className="removeButton"
                onClick={() => handleRemoveUrl(index)}
              >
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSendToBackend} id="StartButton" disabled={loading}>
        {loading ? "Testing..." : "Start test"}
      </button>
      <Link to="/tests" className="backToDash">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AvailabilityTest;
