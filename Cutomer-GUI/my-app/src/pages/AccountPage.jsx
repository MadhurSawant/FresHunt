import React from "react";
import "./AccountPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaBox, FaMapMarkerAlt, FaGift, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useUser } from "../data/UserContext"; // ✅ Import context
import FreshHuntNavbar from "../components/FreshHuntNavbar";
function AccountPage() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();            // clear context + localStorage
    navigate("/");  // redirect to login page
  };

  return (
    <>
    <FreshHuntNavbar/> 
    <div className="account-page">
      <h1 className="page-title">My Account</h1>

      <div className="account-grid">
        <div className="account-card">
          <h2><FaBox className="icon" /> My Orders</h2>
          <p>View your order history and track active orders.</p>
          <Link to="/orders"><button className="btn">View Orders</button></Link>
        </div>

        <div className="account-card">
          <h2><FaMapMarkerAlt className="icon" /> My Address</h2>
          <p>Manage your saved delivery addresses.</p>
          <Link to="/address"><button className="btn">Manage Address</button></Link>
        </div>

        <div className="account-card">
          <h2><FaGift className="icon" /> Loyalty Program</h2>
          <p>Check your reward points and exclusive offers.</p>
          <Link to="/loyalty"><button className="btn">View Loyalty</button></Link>
        </div>

        <div className="account-card">
          <h2><FaCog className="icon" /> Settings</h2>
          <p>Update your personal information and preferences.</p>
          <Link to="/settings"><button className="btn">Go to Settings</button></Link>
        </div>

        {/* ✅ Logout card */}
        <div className="account-card logout-card">
          <h2><FaSignOutAlt className="icon" /> Logout</h2>
          <p>Sign out of your account safely.</p>
          <button className="btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
    </>
  );

}

export default AccountPage;
