import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productsData from "../data/Product.json"; // ✅ import local JSON
import "./ProductDetails.css";
import { useCart } from "../data/CartContext"; // ✅ import CartContext

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // ✅ Destructure all cart actions from CartContext
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  // ✅ Find the product in the combined list
  useEffect(() => {
    const allProducts = [
      ...productsData.vegetables,
      ...productsData.fruits,
      ...productsData.meat,
    ];

    const found = allProducts.find((p) => p.id === parseInt(id));
    setProduct(found || null);
  }, [id]);

  if (!product) return <h2>Product not found</h2>;

  // ✅ Find product in the cart
  const cartItem = cart.find((item) => item.id === product.id);

  return (
    <div className="product-details-page">
      {/* Left Section - Image */}
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.name}
          className="product-image"
        />
      </div>

      {/* Right Section - Details */}
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>

        <div className="product-tags">
          <span className="category">{product.category}</span>
         
        </div>

        <p className="product-description">
          {product.description ||
            `Fresh and high-quality ${product.name}. Perfect for your meals.`}
        </p>

        <div className="price-section">
          {product.oldPrice && (
            <p className="old-price">MRP: ₹{product.oldPrice}</p>
          )}
          <p className="price">₹{product.price}</p>
          {product.discount && (
            <p className="discount">{product.discount}% OFF</p>
          )}
        </div>

        {/* Variants Section */}
        {product.variants && product.variants.length > 0 && (
          <div className="variants">
            <ul>
              {product.variants.map((variant, i) => (
                <li key={i}>
                  {variant.type}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ✅ Cart Controls */}
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
    </div>
  );
}

export default ProductDetails;
