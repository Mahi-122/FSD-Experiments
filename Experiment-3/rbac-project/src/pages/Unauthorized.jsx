import { Link } from "react-router-dom";
import "./Unauthorized.css";

function Unauthorized() {
  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">

        <div className="unauthorized-icon">
          🚫
        </div>

        <p className="unauthorized-label">
          RBAC SECURITY
        </p>

        <h1>Access Denied</h1>

        <p className="unauthorized-message">
          You do not have permission to access this page.
        </p>

        <Link to="/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>

      </div>
    </div>
  );
}

export default Unauthorized;