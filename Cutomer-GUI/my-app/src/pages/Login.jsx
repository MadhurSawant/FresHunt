import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../data/UserContext";
import "./Login.css";

const API_URL = "http://localhost:9000";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state

  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!username || !password) {
      setMessage("Username and password are required");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      setMessage(res.data.message || "Login successful");
      login(res.data.user);

      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);
      setMessage(error.response?.data?.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h2>
            Simplify management <br /> with our dashboard
          </h2>
          <p>User-friendly admin dashboard for e-commerce management.</p>
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/business-team-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--working-office-group-man-people-pack-illustrations-4166628.png"
            alt="illustration"
          />
        </div>

        <div className="login-right">
          <h3>Welcome Back 👋</h3>
          <p className="subtitle">Please login to your account</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="view-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈 Hide" : "👁️ View"}
              </button>
            </div>

            <div className="forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {message && (
            <p style={{ color: "red", marginTop: "10px" }}>{message}</p>
          )}

          <div className="divider">
            <span>or login with</span>
          </div>

          <p className="register-text">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
