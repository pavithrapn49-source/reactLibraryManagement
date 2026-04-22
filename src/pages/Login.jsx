import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const data = await login(email, password);

      toast.success(`Welcome ${data.name}`);
      navigate("/dashboard");

    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <h1 className="login-title">📚 Library Login</h1>
        <p className="login-subtitle">
          Access your futuristic digital library
        </p>

        {/* Hidden fake fields to stop autofill */}
        <input
          type="text"
          name="fakeusernameremembered"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="fakepasswordremembered"
          style={{ display: "none" }}
        />

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          className="login-form"
        >
          <input
            type="email"
            name="library_user_email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="login-input"
          />

          <input
            type="password"
            name="library_user_passcode"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            className="login-input"
          />

          <button
            type="submit"
            disabled={loading}
            className="login-btn"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-text">
          Don't have an account?
          <span
            className="register-link"
            onClick={() => navigate("/register")}
          >
            Register Here
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;