import { useNavigate } from "react-router-dom";
import "../styles/login.css"; // ✅ reuse existing styles for consistency

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-card text-center">
        <h2 className="text-2xl font-bold text-red-600">🚫 Access Denied</h2>
        <p className="subtitle mt-2">
          You don’t have permission to view this page.
        </p>

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="btn-primary"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/login")}
            className="logout-btn"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
