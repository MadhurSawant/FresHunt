import { useCart } from "../data/CartContext";
import { useNavigate } from "react-router-dom";
import productsData from "../data/Product.json"; // ✅ import products
import "./CartPage.css";
import FreshHuntNavbar from "../components/FreshHuntNavbar";
import FreshHuntFooter from "../components/FreshHuntFooter";

// ✅ helper: find full product info by ID
function getProductById(id) {
  const allProducts = Object.values(productsData).flat();
  return allProducts.find((item) => item.id === id);
}

function CartPage() {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) return <h2>Your cart is empty 🛒</h2>;

  // 🧮 Calculate totals using product data
  const subtotal = cart.reduce((total, item) => {
    const product = getProductById(item.id);
    return product ? total + product.price * item.qty : total;
  }, 0);

  const deliveryFee = 25;
  const handlingFee = 2;
  const smallCartFee = subtotal < 200 ? 20 : 0;
  const discount = 10;
  const totalPrice =
    subtotal + deliveryFee + handlingFee + smallCartFee - discount;

  return (
    <> 
    <FreshHuntNavbar/>
    <div className="cart-page">
      {/* 🛍️ Left Section - Items */}
      <div className="cart-items-section">
        <h2>Shopping Cart</h2>
        <p>{cart.length} items in your cart</p>

        {cart.map((item) => {
          const product = getProductById(item.id);
          if (!product) return null; // safeguard

          return (
            <div key={item.id} className="cart-item">
              <img src={product.image} alt={product.name} />
              <div className="item-details">
                <h4>{product.name}</h4>
                <p className="item-price">₹{product.price}</p>
                <div className="counter-btn">
                  <button onClick={() => decreaseQty(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => increaseQty(item.id)}>+</button>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
              <p className="item-total">₹{product.price * item.qty}</p>
            </div>
          );
        })}
      </div>

      {/* 📦 Right Section - Bill Summary */}
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="summary-row">
          <span>Handling Fee</span>
          <span>₹{handlingFee}</span>
        </div>
        {smallCartFee > 0 && (
          <div className="summary-row">
            <span>Small Cart Charge</span>
            <span>₹{smallCartFee}</span>
          </div>
        )}
        <div className="summary-row saving">
          <span>You’re Saving</span>
          <span>-₹{discount}</span>
        </div>
        <hr />
        <div className="summary-row total">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>

        {/* ✅ Navigate to Checkout */}
        <button
          className="payment-btn"
          onClick={() => navigate("/checkout", { state: { totalPrice, cart } })}
        >
          Proceed to Checkout
        </button>

        {/* ✅ Navigate back to Home */}
        <button className="continue-btn" onClick={() => navigate("/")}>
          Continue Shopping
        </button>

        <p className="secure-text">Secure checkout with 256-bit SSL encryption</p>
      </div>
    </div>

    <FreshHuntFooter/>
    </>
   
  );
}

export default CartPage;
