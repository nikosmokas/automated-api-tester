import React from "react";
import "./Information.css";

const Information = ({ name, email, creationDate }) => {

const formattedDate = creationDate
  ? new Date(creationDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  : 'Date not available';

  return (
    <div className="information">
      <h2>User Information</h2>
      <hr className="information-divider" />
      <p><strong>Email:</strong> {email}</p>
      <p><strong>Name:</strong> {name}</p>
      <p><strong>Account Created:</strong> {formattedDate}</p>
      </div>
  );
};

export default Information;
