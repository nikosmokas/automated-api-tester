import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../AuthContext"; // Adjust the path to your AuthContext file
import "./NewTest.css"; // Adjust the path to your CSS file

const NewTest = () => {
  const navigate = useNavigate();
  const { email } = useAuth();
  const [userId, setUserId] = useState(null);
  const [testRunId, setTestRunId] = useState(null);
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [testsCompleted, setTestsCompleted] = useState(false);
  const [runChoice, setRunChoice] = useState("Run Now");
  const [runDateTime, setRunDateTime] = useState("");
  const [recurringMinutes, setRecurringMinutes] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const formatDateTimeLocal = (date) => {
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const minDateTime = formatDateTimeLocal(new Date(Date.now() + 60 * 1000));

  // Helper function to convert UTC Date to local datetime string
  const convertUTCToLocal = (utcDate) => {
    const localDate = new Date(utcDate);
    return localDate.toISOString().slice(0, -1); // Removes the 'Z' to fit datetime-local format
  };

  // Helper function to convert local datetime string to UTC Date
  const convertLocalToUTC = (localDateString) => {
    return new Date(localDateString).toISOString(); // Converts local datetime to UTC
  };

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
    setLoading(true);
    try {
      const response = await axios.post("/api/tests/availabilityTest/", {
        userId,
        urls,
        title,
        description,
        runChoice,
        runDateTime,
        recurringMinutes,
      });

      console.log("We received this response:", response);

      const testRunId = response.data.testRun._id;

      setTestRunId(testRunId);
      setLoading(false);
      if (runChoice === "Run Now") {
        setTestsCompleted(true);
      }
      console.log("Tests Completed:", testsCompleted);
      console.log("User ID:", userId);
      console.log("Test Run ID:", testRunId);
    } catch (error) {
      console.error("Error sending data to server:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (testsCompleted && userId && testRunId) {
      console.log("Tests Completed:", testsCompleted);
      console.log("User ID:", userId);
      console.log("Test Run ID:", testRunId);
      navigate(
        `/tests/availabilityTest/results?user=${encodeURIComponent(
          userId
        )}&testRunId=${encodeURIComponent(testRunId)}`
      );
    } else if (testRunId) {
      window.location.reload();
    }
  }, [testsCompleted, userId, testRunId, navigate]);

  return (
    <div className="newTestContainer">
      <h1 className="header">New Availability Test</h1>
      <div className="contentWrapper">
        <div className="formContainer">
          <h2 className="newTestHeader">Enter Test Information</h2>
          <div className="formField">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="formField">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="formField">
            <label htmlFor="runChoice">Run Choices:</label>
            <select
              id="runChoice"
              value={runChoice}
              onChange={(e) => setRunChoice(e.target.value)}
            >
              <option value="Run Now">Run Now</option>
              <option value="Run Once">Run Once</option>
              <option value="Recurring">Recurring</option>
            </select>
          </div>
          {runChoice === "Run Once" && (
            <div className="formField">
              <label htmlFor="runDateTime">Run Date and Time:</label>
              <input
                type="datetime-local"
                id="runDateTime"
                value={
                  runDateTime ||
                  formatDateTimeLocal(new Date(Date.now() + 60 * 1000))
                }
                required
                onChange={(e) => {
                  setRunDateTime(e.target.value); // Local time is used as is
                }}
                min={minDateTime} // Minimum value in YYYY-MM-DDTHH:MM format
              />
            </div>
          )}
          {runChoice === "Recurring" && (
            <div className="formField">
              <label htmlFor="recurringMinutes">Recurring (minutes):</label>
              <input
                type="number"
                id="recurringMinutes"
                value={recurringMinutes || 1} // Sets default value to 1
                required
                onChange={(e) => setRecurringMinutes(e.target.value)}
                min="1"
                max="90"
              />
            </div>
          )}
          <button
            onClick={handleSendToBackend}
            disabled={loading}
            className="runNowButton"
          >
            {runChoice === "Run Now" ? "Run Now" : "Schedule Test"}
          </button>
        </div>
        <div className="inputSection">
          <h2 className="newTestHeader">Enter URL(s)</h2>
          <div className="inputContainer">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Enter URL"
              className="input"
            />
            <button onClick={handleAddUrl} className="addURLbutton">
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
        </div>
      </div>
    </div>
  );
};

export default NewTest;
