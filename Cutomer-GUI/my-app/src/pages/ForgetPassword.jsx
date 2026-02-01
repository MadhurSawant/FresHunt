import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:9000"; // Backend base URL

const ForgetPassword = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: request OTP, 2: verify OTP, 3: reset password
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  // Timer for resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 📩 Step 1: Request OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/forgot-password/request`, { email, username });
      setMessage(res.data.message || "OTP sent to your email!");
      setStep(2);
      setTimer(60);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to send OTP.");
    }
  };

  // 🔁 Step 2: Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) return;
    try {
      const res = await axios.post(`${API_URL}/forgot-password/request`, { email, username });
      setMessage(res.data.message || "OTP resent successfully!");
      setTimer(60);
    } catch (error) {
      setMessage(error.response?.data?.error || "Unable to resend OTP.");
    }
  };

  // ✅ Step 2: Verify OTP
const handleVerifyOTP = async (e) => {
  e.preventDefault();
  setMessage("");

  // Validate inputs
  if (!email.trim() || !otp.trim()) {
    setMessage("Email and OTP are required");
    return;
  }

  try {
    // Send both email and username to backend to match user correctly
    const res = await axios.post(`${API_URL}/forgot-password/verify`, {
      email: email.trim(),
      username: username.trim(),
      otp: otp.trim(),
    });

    setMessage(res.data.message || "OTP verified successfully!");
    setStep(3);
  } catch (error) {
    console.error("OTP Verification Error:", error);
    setMessage(error.response?.data?.error || "Invalid OTP. Please try again.");
  }
};


  // 🔒 Step 3: Reset Password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(`${API_URL}/forgot-password/reset`, {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message || "Password reset successfully!");
      // Reset all fields
      setUsername("");
      setEmail("");
      setOtp("");
      setNewPassword("");
      setStep(1);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to reset password.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <label style={styles.label}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Send OTP</button>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <label style={styles.label}>Enter OTP</label>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Verify OTP</button>
            <button
              type="button"
              onClick={handleResendOTP}
              style={{
                ...styles.resendButton,
                opacity: timer > 0 ? 0.6 : 1,
                cursor: timer > 0 ? "not-allowed" : "pointer",
              }}
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleSetPassword}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Update Password</button>
          </form>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

/* ----------------- Inline Styles ----------------- */
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#eef2f3",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    width: "360px",
    textAlign: "center",
  },
  title: { marginBottom: "1.5rem", color: "#333" },
  label: { display: "block", textAlign: "left", marginBottom: "0.5rem", color: "#555", fontWeight: "bold" },
  input: { width: "100%", padding: "0.7rem", marginBottom: "1rem", border: "1px solid #ccc", borderRadius: "5px" },
  button: { width: "100%", padding: "0.7rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontWeight: "bold" },
  resendButton: { marginTop: "0.8rem", width: "100%", padding: "0.6rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px" },
  message: { marginTop: "1rem", color: "#28a745", fontSize: "0.9rem" },
};

export default ForgetPassword;
