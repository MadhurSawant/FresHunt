// src/pages/AddressPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../data/UserContext";
import "./AddressPage.css";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import FreshHuntFooter from "../components/FreshHuntFooter";

function AddressPage() {
  const { user } = useUser();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India", // ✅ default
  });

  const API_BASE = "http://localhost:9000"; // 🔗 change to deployed link later

  // ✅ Fetch addresses
  useEffect(() => {
    if (!user?.username) return;

    const fetchAddresses = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/users/username/${user.username}/addresses`
        );
        setAddresses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();

    setFormData((prev) => ({
      ...prev,
      username: user?.username || "",
      country: prev.country || "India",
    }));
  }, [user]);

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add new address
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) return alert("Username is required");

    try {
      const res = await axios.post(
        `${API_BASE}/users/username/${formData.username}/addresses`,
        formData
      );

      if (Array.isArray(res.data)) {
        setAddresses(res.data);
      } else if (res.data.addresses) {
        setAddresses(res.data.addresses);
      }

      setFormData({
        username: user?.username || "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India", // reset to India
      });
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Failed to add address");
    }
  };

  return (
    <>
    <FreshHuntNavbar/>
    <div className="address-page">
      <h2>My Addresses</h2>

      {loading ? (
        <p>Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p>No addresses found.</p>
      ) : (
        <ul className="address-list">
          {addresses.map((addr, idx) => (
            <li key={idx} className="address-item">
              <strong>{addr.username}</strong>: {addr.street}, {addr.city},{" "}
              {addr.state}, {addr.postalCode}, {addr.country}
            </li>
          ))}
        </ul>
      )}

      <h3>Add New Address</h3>
      <form onSubmit={handleSubmit} className="address-form">
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          required
        />
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          placeholder="Street"
          required
        />
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={formData.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={handleChange}
          placeholder="Postal Code"
          required
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />

        <button type="submit">Add Address</button>
      </form>
    </div>
    <FreshHuntFooter/>
    </>
    
  );
}

export default AddressPage;
