import "./TestsDashboard.css";
import { Link } from "react-router-dom";

const TestsDashboard = () => {


  return (
    <div className="tests-dashboard">
      <h1>Tests Dashboard</h1>
      <div className="dashboard-container">
        <div className="dashboard-card">
          <img src="/images/endpoint-tests.png" alt="Endpoint tests" />
          <Link to = "/tests/availabilityTest" className = "link">Availability Tests</Link>
          <p>Enter a list of URLs and see if they work!</p>
        </div>
        <div className="dashboard-card">
          <img src="/images/performance-tests.jpg" alt="Performance Tests" />
          <Link to = "/tests/availabilityTest" className = "link">Performance Tests</Link>
          <p>WIP</p>
        </div>
        <div className="dashboard-card">
          <img src="/images/security-tests.jpg" alt="Security Tests" />
          <Link to = "/tests/availabilityTest" className = "link">Security Tests</Link>
          <p>WIP</p>
        </div>
      </div>
    </div>
  );
};

export default TestsDashboard;
