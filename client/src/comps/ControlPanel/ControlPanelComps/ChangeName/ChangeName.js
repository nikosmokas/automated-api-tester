import React, { useState } from "react";
import axios from "axios";
import "./ChangeName.css";

const ChangeUsername = () => {
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/user/change-username", { name: newName }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Username updated successfully. Refresh your page!");
    } catch (error) {
      console.error("Error changing username:", error);
      setMessage("Failed to update username.");
    }
  };

  return (
    <div className="change-username">
      <h3>Change Username</h3>
      <form onSubmit={handleSubmit}>
        <label>
          New Username:
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new username"
            required
          />
        </label>
        <button type="submit">Update Username</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ChangeUsername;
