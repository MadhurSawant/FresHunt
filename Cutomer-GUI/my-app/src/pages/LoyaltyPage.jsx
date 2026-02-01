import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LoyaltyPage.css";
import { useUser } from "../data/UserContext";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import FreshHuntFooter from "../components/FreshHuntFooter";

function LoyaltyPage() {


  const { user } = useUser();
  const [loyalty, setLoyalty] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper: calculate expiry date 1 month from latest update
  const calculateExpiry = (lastUpdated) => {
    const date = lastUpdated ? new Date(lastUpdated) : new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toISOString();
  };

  useEffect(() => {
    if (!user?.username) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:9000/users/username/${user.username}/loyalty`)
      .then((res) => {
        if (res.data) {
          const expiryDate = calculateExpiry(res.data.lastUpdated);
          setLoyalty({ ...res.data, expiryDate });
        } else {
          setLoyalty(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching loyalty:", err);
        setLoading(false);
      });
  }, [user?.username]);

  const handleEnroll = () => {
    if (!user?.username) {
      alert("Login required to enroll.");
      return;
    }

    const expiryDate = calculateExpiry(); // 1 month from now

    axios
      .post(`http://localhost:9000/users/username/${user.username}/loyalty`, {
        points: 50,
        expiryDate,
      })
      .then((res) => {
        alert("Enrolled in loyalty program!");
        setLoyalty({ ...res.data, expiryDate });
      })
      .catch((err) => console.error("Error enrolling:", err));
  };

  if (loading) return <p className="loading">Loading loyalty details...</p>;

  const isExpired = loyalty
    ? new Date(loyalty.expiryDate) < new Date()
    : false;

  return (
    <> 
    <FreshHuntNavbar/>
    <div className="loyalty-container">
      <h2 className="loyalty-title">✨ Loyalty Program ✨</h2>

      {loyalty ? (
        <div className={`loyalty-card ${isExpired ? "expired" : ""}`}>
          <p className="points">
            Points: <span>{isExpired ? 0 : loyalty.points.toFixed(2)}</span>
          </p>
          <p className="expiry">
            Expiry Date:{" "}
            <span>
              {new Date(loyalty.expiryDate).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </p>
          {isExpired && <p className="expired-note">⚠️ Points expired</p>}
        </div>
      ) : (
        <div className="no-data">
          <p>No loyalty data available.</p>
          <button className="btn btn-success" onClick={handleEnroll}>
            Enroll Now
          </button>
        </div>
      )}
    </div>
    <FreshHuntFooter/>
    </>
   
  );
}

export default LoyaltyPage;
