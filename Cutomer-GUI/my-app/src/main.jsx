import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CartProvider } from "./data/CartContext.jsx";
import { UserProvider } from "./data/UserContext.jsx"; // ✅ import UserProvider
import "@fortawesome/fontawesome-free/css/all.min.css";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>      {/* ✅ User context first */}
      <CartProvider>    {/* ✅ Cart context inside */}
        <App />
      </CartProvider>
    </UserProvider>
  </StrictMode>
);
