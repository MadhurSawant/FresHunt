import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../data/UserContext";
import { useCart } from "../data/CartContext";
import { useNavigate } from "react-router-dom";
import productsData from "../data/Product.json";
import "./Checkout.css";
import FreshHuntNavbar from "../components/FreshHuntNavbar";

// Helper: Find product by ID
function getProductById(id) {
  const allProducts = Object.values(productsData).flat();
  return allProducts.find((item) => item.id === id);
}

function Checkout() {
  const { user, setUser } = useUser();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("UPI"); // main checkout selection
  const [showDemoPayment, setShowDemoPayment] = useState(false);
  const [demoMethod, setDemoMethod] = useState("UPI"); // inside modal
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/users/username/${user.username}/addresses`
      );
      const data = res.data || [];
      setAddresses(data);
      if (data.length > 0) setSelectedAddress(data[0]);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  // Fetch loyalty points
  const fetchLoyalty = async () => {
    try {
      const res = await axios.get(
        `http://localhost:9000/users/username/${user.username}/loyalty`
      );
      const newPoints = res.data?.points || 0;
      setLoyaltyPoints(newPoints);
      if (setUser && user?.loyaltyPoints !== newPoints) {
        setUser((prev) => ({ ...prev, loyaltyPoints: newPoints }));
      }
    } catch (error) {
      console.error("Failed to fetch loyalty:", error);
    }
  };

  useEffect(() => {
    if (user?.username) {
      fetchAddresses();
      fetchLoyalty();
    }
  }, [user?.username]);

  // Bill calculation
  const subtotal = cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);

  const deliveryFee = 25;
  const handlingFee = 2;
  const smallCartFee = subtotal < 200 ? 20 : 0;
  const discount = 10;

  let totalPrice =
    subtotal + deliveryFee + handlingFee + smallCartFee - discount;

  // Apply loyalty points (max 20% of total bill)
  let loyaltyPointsUsed = 0;
  const maxLoyaltyUsage = parseFloat((totalPrice * 0.2).toFixed(2));
  if (useLoyalty && loyaltyPoints > 0) {
    loyaltyPointsUsed = Math.min(loyaltyPoints, maxLoyaltyUsage);
    totalPrice -= loyaltyPointsUsed;
  }

  totalPrice = parseFloat(totalPrice.toFixed(2));

  // ------------------ PLACE ORDER ------------------
const placeOrder = async (status = "created", method = "COD") => {
  if (!user || !selectedAddress) {
    alert("Please login and select an address.");
    return;
  }

  const earnedPoints = Math.floor(totalPrice / 100);

  const orderData = {
    items: cart.map((item) => {
      const product = getProductById(item.id);
      return {
        product: product?.name || "Unknown",
        qty: item.qty,
        price: product?.price || 0,
        total: product ? parseFloat((product.price * item.qty).toFixed(2)) : 0,
      };
    }),
    totalAmount: totalPrice,
    loyaltyPointsUsed: loyaltyPointsUsed || 0,
    loyaltyPointsEarned: earnedPoints,
    status,
    paymentMode: method,
    address: {
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postalCode: selectedAddress.pincode,
      country: "IN",
    },
  };

  try {
    const response = await axios.post(
      `http://localhost:9000/users/username/${encodeURIComponent(user.username)}/orders`,
      orderData
    );

    clearCart();
    // 🔹 Use OTP returned from backend
    const otpFromBackend = response.data.otp;
    alert(`Order placed successfully!\nYour delivery OTP: ${otpFromBackend}`);
    navigate("/orders");
  } catch (error) {
    console.error("Failed to place order:", error);
    if (error.response) {
      alert(`Error: ${error.response.data.error}`);
    } else {
      alert("Something went wrong while placing the order.");
    }
  }
};





  // ------------------ DEMO PAYMENT ------------------
  const handleDemoPayment = () => {
    if (!selectedAddress) {
      alert("Please select an address before paying.");
      return;
    }
    setDemoMethod(paymentMethod); // modal matches selected method
    setShowDemoPayment(true);
  };

  const confirmDemoPayment = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      setShowDemoPayment(false);
      await placeOrder("paid", demoMethod); // ✅ pass correct method
    }, 2000);
  };

  const cancelDemoPayment = () => {
    setShowDemoPayment(false);
    alert("Payment cancelled.");
  };

  // ------------------ CHECKOUT ------------------
  const handleCheckout = async () => {
    if (paymentMethod === "COD") {
      await placeOrder("created", "COD");
    } else {
      handleDemoPayment();
    }
  };

  // ---------------------- JSX ----------------------
  return (
    <><FreshHuntNavbar/> 
    <div className="checkout-page">
      <div className="checkout-left">
        <h2>Checkout</h2>
        <div className="checkout-section">
          <h4>Delivering To:</h4>
          {user ? (
            <div className="user-info">
              <p>
                <strong>{user.username}</strong>{" "}
                <span className="points">(Loyalty Points: {loyaltyPoints.toFixed(2)})</span>
              </p>

              {addresses.length > 0 ? (
                <select
                  value={selectedAddress?._id || ""}
                  onChange={(e) =>
                    setSelectedAddress(
                      addresses.find((a) => a._id === e.target.value)
                    )
                  }
                >
                  {addresses.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.street}, {addr.city}, {addr.state}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="no-address">
                  <p className="warning">
                    ⚠️ No address found. Please add your delivery address.
                  </p>
                  <button
                    className="btn btn-outline-success"
                    onClick={() => navigate("/address")}
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p>
              Please{" "}
              <span className="link" onClick={() => navigate("/login")}>
                login
              </span>{" "}
              to continue.
            </p>
          )}
        </div>
      </div>

      <div className="checkout-right">
        <div className="cart-overview">
          <h4>Cart Overview</h4>
          {cart.length > 0 ? (
            <>
              <ul className="cart-items">
                {cart.map((item) => {
                  const product = getProductById(item.id);
                  if (!product) return null;
                  return (
                    <li key={item.id} className="cart-item">
                      <span>
                        {product.name} × {item.qty}
                      </span>
                      <span>₹{(product.price * item.qty).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="bill-summary">
                <h5>Bill Summary</h5>
                <p>Subtotal: <span>₹{subtotal.toFixed(2)}</span></p>
                <p>Delivery Fee: <span>₹{deliveryFee.toFixed(2)}</span></p>
                <p>Handling Fee: <span>₹{handlingFee.toFixed(2)}</span></p>
                {smallCartFee > 0 && <p>Small Cart Fee: <span>₹{smallCartFee.toFixed(2)}</span></p>}
                {discount > 0 && <p>Discount: <span>-₹{discount.toFixed(2)}</span></p>}

                {loyaltyPoints > 0 && (
                  <div className="loyalty-option mt-3">
                    <label>
                      <input
                        type="checkbox"
                        checked={useLoyalty}
                        onChange={(e) => setUseLoyalty(e.target.checked)}
                      />{" "}
                      Use Loyalty Points ({loyaltyPoints.toFixed(2)} available, max 20% of bill: ₹{maxLoyaltyUsage.toFixed(2)})
                    </label>
                  </div>
                )}

                {loyaltyPointsUsed > 0 && (
                  <p>Loyalty Points Used: <span>-₹{loyaltyPointsUsed.toFixed(2)}</span></p>
                )}

                <hr />
                <p className="total"><strong>Total: ₹{totalPrice.toFixed(2)}</strong></p>
              </div>

              {/* Payment Options */}
              {selectedAddress && (
                <>
                  <div className="payment-options mt-3">
                    <h5>Payment Method</h5>
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                      />{" "}
                      UPI / Wallet
                    </label>
                    <br />
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "CARD"}
                        onChange={() => setPaymentMethod("CARD")}
                      />{" "}
                      Credit / Debit Card
                    </label>
                    <br />
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                      />{" "}
                      Cash on Delivery
                    </label>
                  </div>

                  <button
                    className="btn btn-success w-100 mt-3"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing
                      ? "Processing..."
                      : paymentMethod === "COD"
                      ? "Place Order (COD)"
                      : "Pay (Demo Payment)"}
                  </button>
                </>
              )}
            </>
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>
      </div>

      {/* Demo Payment Modal */}
      {showDemoPayment && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}>
          <div style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            width: "320px",
            textAlign: "center",
          }}>
            <h4>💳 Demo Payment</h4>
            <p>Pay ₹{totalPrice.toFixed(2)}</p>

            <div style={{ textAlign: "left", marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  checked={demoMethod === "UPI"}
                  onChange={() => setDemoMethod("UPI")}
                /> UPI / Wallet
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  checked={demoMethod === "CARD"}
                  onChange={() => setDemoMethod("CARD")}
                /> Credit / Debit Card
              </label>
            </div>

            {demoMethod === "UPI" && (
              <input type="text" placeholder="Enter UPI ID" style={{
                width: "100%",
                padding: "6px",
                marginBottom: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}/>
            )}

            {demoMethod === "CARD" && (
              <>
                <input type="text" placeholder="Card Number" maxLength={16} style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}/>
                <input type="text" placeholder="Expiry (MM/YY)" maxLength={5} style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}/>
                <input type="text" placeholder="CVV" maxLength={3} style={{
                  width: "100%",
                  padding: "6px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc"
                }}/>
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="btn btn-secondary" onClick={cancelDemoPayment}>
                Cancel
              </button>
              <button className="btn btn-success" onClick={confirmDemoPayment} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Pay ₹" + totalPrice.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
   
  );
}

export default Checkout;
