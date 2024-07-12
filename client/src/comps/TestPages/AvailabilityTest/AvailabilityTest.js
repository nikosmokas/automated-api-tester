import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../AuthContext'; // Adjust the path to your AuthContext file
import './AvailabilityTest.css';

const AvailabilityTest = () => {
  const { email } = useAuth(); // Accessing user email from AuthContext
  const [userId, setUserId] = useState(null); // State to hold userId (email)
  const [urls, setUrls] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [testsCompleted, setTestsCompleted] = useState(false); // State to track test completion

  useEffect(() => {
    if (email) {
      setUserId(email);
    }
  }, [email]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddUrl = () => {
    if (inputValue) {
      setUrls((prevUrls) => [...prevUrls, inputValue]);
      setInputValue('');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const fileUrls = content.split('\n').filter((url) => url.trim() !== '');
        setUrls((prevUrls) => [...prevUrls, ...fileUrls]);
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveUrl = (indexToRemove) => {
    setUrls((prevUrls) => prevUrls.filter((url, index) => index !== indexToRemove));
  };

  const handleSendToBackend = async () => {
    setLoading(true); // Set loading to true when starting tests
    try {
      const response = await axios.post('/api/tests/availabilityTest/', {
        userId,
        urls: urls, // Send the `urls` array to backend
      });

      console.log('Response from server:', response.data);
      setLoading(false); // Set loading to false when tests are done
      setTestsCompleted(true); // Set testsCompleted to true after tests finish
    } catch (error) {
      console.error('Error sending data to server:', error);
      setLoading(false); // Set loading to false on error
    }
  };

  if (testsCompleted) {
    return <Navigate to="/tests/availabilityTest/results" />;
  }

  return (
    <div className="container">
      <h1 className="header">Availability Test</h1>
      <div className="inputContainer">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
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
      <button onClick={handleSendToBackend} className="button" disabled={loading}>
        {loading ? 'Testing...' : 'Start test'}
      </button>
      <div className="urlListContainer">
        <h2 className="urlListHeader">URL List</h2>
        <ul className="urlList">
          {urls.map((url, index) => (
            <li key={index} className="urlItem">
              {url}
              <button className="removeButton" onClick={() => handleRemoveUrl(index)}>
                X
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Link to="/tests" className="button">
        Back to Dashboard
      </Link>
    </div>
  );
};

export default AvailabilityTest;
