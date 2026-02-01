// src/context/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import productsData from "../data/Product.json"; // adjust path

const CartContext = createContext();

// ✅ Helper: Find image for a product ID from Product.json
function getProductImageById(id) {
  // Flatten all categories (vegetables, fruits, meat...)
  const allProducts = Object.values(productsData).flat();
  const product = allProducts.find((item) => item.id === id);
  return product ? product.image : null;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      // ✅ Only keep ID, qty, and image
      return [
        ...prev,
        {
          id: product.id,
          qty: 1,
          image: getProductImageById(product.id),
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

const decreaseQty = (id) => {
  setCart((prev) =>
    prev
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(item.qty - 1, 0) } : item
      )
      .filter((item) => item.qty > 0)
  );
};
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext); 