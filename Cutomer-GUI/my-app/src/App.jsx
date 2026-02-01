import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ✅ Page Imports
import Home from "./pages/Home";
import Login from "./pages/Login";
import Stores from "./pages/Stores";
import Categories from "./pages/Categories";
import Signup from "./pages/Signup";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import AddressPage from "./pages/AddressPage";
import OrdersPage from "./pages/OrdersPage";
import SettingsPage from "./pages/SettingsPage";
import LoyaltyPage from "./pages/LoyaltyPage";
import AccountPage from "./pages/AccountPage";
import Checkout from "./pages/Checkout";
import OrderDetails from "./pages/OrderDetails";
import ForgetPassword from "./pages/ForgetPassword";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
// import Chatbot from "./pages/Chatbot";

// ✅ Component Imports
import Shop from "./components/Shop";
import FreshHuntNavbar from "./components/FreshHuntNavbar";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar visible on all pages */}
     

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/productdetails/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/address" element={<AddressPage />} />
        <Route path="/loyalty" element={<LoyaltyPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order/:orderId" element={<OrderDetails />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/shop" element={<Shop />} />
        {/* <Route path="/chatbot" element={<Chatbot />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
