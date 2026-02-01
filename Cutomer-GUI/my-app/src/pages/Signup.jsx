import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const API_URL = "http://localhost:9000";

function Signup() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      setPasswordValid(value.length >= 8);
      setPasswordMatch(value === form.confirmPassword);
    } else if (name === "confirmPassword") {
      setPasswordMatch(form.password === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordValid) {
      setMessage("❌ Password must be at least 8 characters long!");
      return;
    }

    if (!passwordMatch) {
      setMessage("❌ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post(`${API_URL}/auth/signup`, {
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      console.log("✅ Signup response:", res.data);

      setMessage(res.data.message || "✅ Signup successful!");
      setForm({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setPasswordValid(false);
      setPasswordMatch(false);
      setShowPasswordHint(false);
    } catch (err) {
      console.error("❌ Signup error:", err.response || err);
      setMessage(
        err.response?.data?.message || "❌ Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-left">
          <h2>
            Create and manage <br /> your account easily
          </h2>
          <p>Start your journey with our powerful and user-friendly dashboard.</p>
          <img
            src="https://cdn3d.iconscout.com/3d/premium/thumb/team-discussion-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--meeting-business-office-people-pack-illustrations-4473531.png"
            alt="illustration"
          />
        </div>

        <div className="signup-right">
          <h3>Create Account ✨</h3>
          <p className="subtitle">Please fill in your details</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              placeholder="Enter your name"
              onChange={handleChange}
              required
            />

            <label>Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              placeholder="Enter your email"
              onChange={handleChange}
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              placeholder="Enter your phone number"
              onChange={handleChange}
              required
            />

            {/* Password Field */}
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                placeholder="Create a password (min 8 characters)"
                onChange={handleChange}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
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

            {showPasswordHint && (
              <div className="password-hint">
                <p style={{ color: passwordValid ? "green" : "red" }}>
                  {passwordValid
                    ? "✅ Password length is valid"
                    : "❌ Minimum 8 characters required"}
                </p>
              </div>
            )}

            {/* Confirm Password Field */}
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="view-btn"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "🙈 Hide" : "👁️ View"}
              </button>
            </div>

            {form.confirmPassword && (
              <div className="password-hint">
                <p style={{ color: passwordMatch ? "green" : "red" }}>
                  {passwordMatch
                    ? "✅ Passwords match"
                    : "❌ Passwords do not match"}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !passwordValid || !passwordMatch}
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          {message && <p className="message">{message}</p>}

          <div className="divider">
            <span>or sign up with</span>
          </div>

          <p className="login-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
