import React, { useState } from "react";
import axios from "axios";
import "./ChangePassword.css";


const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== repeatPassword) {
      setMessage("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/user/change-password", {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("Password updated successfully.");
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("Failed to update password.");
    }
  };

  return (
    <div className="change-password">
      <h3>Change Password</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Old Password:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            required
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
        </label>
        <label>
          Repeat New Password:
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            placeholder="Repeat new password"
            required
          />
        </label>
        <button type="submit">Update Password</button>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default ChangePassword;
