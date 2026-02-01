import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../data/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();
  const cartItem = cart.find((item) => item.id === product.id);

  // ✅ Find only the "500g" variant (if it exists)
  const variant500g = product.variants?.find((v) => v.type === "500g");

  return (
    <div className="product-card" style={{ cursor: "pointer" }}>
      {/* Clickable product area */}
      <Link
        to={`/productdetails/${product.id}`}
        className="product-link"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {/* Product Image */}
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>

        {/* Product Title */}
        <h3 className="product-title">{product.name}</h3>

        {/* Price Section */}
        <div className="product-price">
          {product.oldPrice && <span className="old">₹{product.oldPrice}</span>}
          <span className="new">₹{product.price}</span>
          {product.discount && (
            <span className="discount-badge">{product.discount}% OFF</span>
          )}
        </div>

        {/* ✅ Show only 500g variant if available */}
        {variant500g && (
          <div className="product-variant">
            <p className="variant-item">{variant500g.type}</p>
          </div>
        )}
      </Link>
    
      {cartItem ? (
        <div className="cart-controls">
          <button
            className="decrease"
            onClick={() => decreaseQty(product.id)}
          >
            −
          </button>
          <span className="qty">{cartItem.qty}</span>
          <button
            className="increase"
            onClick={() => increaseQty(product.id)}
          >
            +
          </button>
        </div>
      ) : (
        <button
          className="add-to-cart"
          onClick={() => addToCart(product)}
        >
          + Add to Cart
        </button>
      )}
    </div>

  );
}

export default ProductCard;
