import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrdersPage.css";
import { useUser } from "../data/UserContext";
import { Link } from "react-router-dom";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import FreshHuntFooter from "../components/FreshHuntFooter";

function MyOrders() {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.username) {
      setOrders([]);
      setLoading(false);
      return;
    }

    axios
      .get(
        `http://localhost:9000/users/username/${encodeURIComponent(
          user.username
        )}/orders`
      )
      .then((res) => {
        setOrders(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching user orders:", err);
        setOrders([]);
        setLoading(false);
      });
  }, [user?.username]);

  if (loading) return <p className="loading">Loading your orders...</p>;

  // Split orders into active and completed
  const activeOrders = orders.filter(
    (order) => order.status?.toLowerCase() !== "delivered"
  );
  const completedOrders = orders.filter(
    (order) => order.status?.toLowerCase() === "delivered"
  );

  // Render each order card safely
const renderOrderCard = (order, index) => {
  const orderId = (order.orderNumber || order._id || index).toString().replace(/"/g, "");
  const linkTo = `/order/${orderId}`;

  return (
    <li key={order._id || index} className="order-card">
      <Link to={linkTo} className="order-link">
        <div className="order-header">
          <strong>Order #{order.orderNumber || "N/A"}</strong>
          <span className={`status ${order.status?.toLowerCase() || "pending"}`}>
            {order.status || "Pending"}
          </span>
        </div>
        <div className="order-body">
          <div className="total">Total: ₹{order.totalAmount || 0}</div>
          <div className="items">Items: {order.items?.length || 0}</div>
          <div className="loyalty">
            Earned: {order.loyaltyPointsEarned || 0} pts | Used: {order.loyaltyPointsUsed || 0} pts
          </div>
          <div className="date">
            Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}
          </div>
        </div>
      </Link>
    </li>
  );
};

  return (
    <>
      <FreshHuntNavbar />
      <div className="orders-container">
        <h2>My Orders</h2>

        {/* Active Orders Section */}
        <section className="active-orders">
          <h3>Active Orders</h3>
          {activeOrders.length === 0 ? (
            <p>No active orders.</p>
          ) : (
            <ul className="orders-list">
              {activeOrders.map(renderOrderCard)}
            </ul>
          )}
        </section>

        {/* Completed Orders Section */}
        <section className="completed-orders">
          <h3>Completed Orders</h3>
          {completedOrders.length === 0 ? (
            <p>No completed orders.</p>
          ) : (
            <ul className="orders-list">
              {completedOrders.map(renderOrderCard)}
            </ul>
          )}
        </section>
      </div>
      <FreshHuntFooter/>
    </>
  );
}

export default MyOrders;
