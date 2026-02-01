import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../data/UserContext";
import "./OrderDetails.css";
import FreshHuntFooter from "../components/FreshHuntFooter";
import FreshHuntNavbar from "../components/FreshHuntNavbar";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `http://localhost:9000/users/username/${encodeURIComponent(
            user.username
          )}/orders/${encodeURIComponent(orderId)}`
        );
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.response?.data?.error || "Failed to fetch order");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  if (loading) return <p>Loading order details...</p>;

  if (error)
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );

  if (!order) return <p>No order found</p>;

  const steps = ["created", "paid", "processing", "shipped", "delivered"];
  const currentIndex = steps.indexOf(order.status);
  const address = order.address || {};

  return (
    <>
    <FreshHuntNavbar/>
    <div className="order-container">
      <h2>Order Tracking</h2>

      <div className="order-tracking-card">
        <h3>Order #{order.orderNumber}</h3>

        {/* Progress Bar */}
        <div className="progress-steps">
          {steps.map((step, index) => {
            // COD special rule: "paid" step is not active until delivered
            const isActive =
              order.paymentMode === "COD" &&
              step === "paid" &&
              order.status !== "delivered"
                ? false
                : index <= currentIndex;

            return (

              
              <div key={index} className="step">
                <div className={`step-icon ${isActive ? "active" : ""}`}>
                  <i className="fas fa-box"></i>
                </div>
                <p className={isActive ? "active-text" : ""}>{step}</p>
                {index < steps.length - 1 && (
                  <div
                    className={`step-line ${
                      index < currentIndex ? "active" : ""
                    }`}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Items Section */}
        <div className="items-section">
          <h4>Items</h4>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.product} x {item.qty} - ₹{item.total}
              </li>
            ))}
          </ul>
        </div>

        {/* Total & Payment Mode */}
        <div className="payment-section">
          <h4>Payment Details</h4>
          <p>
            <strong>Total Amount:</strong> ₹{order.totalAmount}
          </p>
          <p>
            <strong>Mode of Payment:</strong> {order.paymentMode || "-"}
          </p>
        </div>

        {/* Delivery Address & OTP */}
        <div className="delivery-section">
          <h4>Delivery Address</h4>
          <p>
            {address.street || "-"}, {address.city || "-"}, {address.state || "-"},{" "}
            {address.postalCode || "-"}, {address.country || "-"}
          </p>

          {order.otp && (
            <div className="otp-box">
              <p className="otp-label">Delivery OTP</p>
              <h2 className="otp-value">{order.otp}</h2>
              <p className="otp-note">Share this with the delivery person</p>
            </div>
          )}
        </div>
      </div>
    </div>
     <FreshHuntFooter/>

   </>  
    
  );
};

export default OrderDetails;
