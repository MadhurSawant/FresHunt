import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SettingsPage.css";
import { useUser } from "../data/UserContext";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import FreshHuntFooter from "../components/FreshHuntFooter";
const API_URL = "http://localhost:9000"; // Backend base URL

function SettingsPage() {
  const { user, fetchUserByUsername } = useUser();
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Auto-fill form with logged-in user's info
  useEffect(() => {
    const loadUser = async () => {
      let currentUser = user;
      if (!currentUser) {
        // fetch by username if not in context
        currentUser = await fetchUserByUsername("madhur.sawant"); // replace with dynamic username if needed
      }
      if (currentUser) {
        setProfile((prev) => ({
          ...prev,
          username: currentUser.username || "",
          email: currentUser.email || "",
        }));
      }
    };
    loadUser();
  }, [user, fetchUserByUsername]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Update user by username
      await axios.put(`${API_URL}/users/username/${profile.username}`, {
        email: profile.email,
        currentPassword: profile.currentPassword,
        newPassword: profile.newPassword,
      });

      alert("Profile updated successfully!");
      setProfile((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error updating profile");
    }
  };

  return (
    <><FreshHuntNavbar/>
    <div className="settings-container">
      <h2>Account Settings</h2>
      <form onSubmit={handleSave}>
        <input
          name="username"
          placeholder="Username"
          value={profile.username}
          onChange={handleChange}
          required
          readOnly // prevent changing username
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={profile.currentPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={profile.newPassword}
          onChange={handleChange}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={profile.confirmPassword}
          onChange={handleChange}
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
    <FreshHuntFooter/>
    </>
    
  );
}

export default SettingsPage;
