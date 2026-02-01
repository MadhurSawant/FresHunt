import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Link, useNavigate } from "react-router-dom";
import { Store, User, MapPin, Search, Home } from "lucide-react";
import CartPopup from "./CartPopup";
import "./FreshHuntNavbar.css";
import { useCart } from "../data/CartContext";
import { useUser } from "../data/UserContext";
import productsData from "../data/Product.json"; // ✅ import your product data

function FreshHuntNavbar() {
  const [showCart, setShowCart] = useState(false);
  const { cart } = useCart();
  const { user } = useUser();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // ✅ SEARCH BAR STATES
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // ✅ Combine all category arrays
  const allProducts = [
    ...(productsData.vegetables || []),
    ...(productsData.fruits || []),
    ...(productsData.meat || []),
  ];

  // 🔍 Handle typing for search
  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Filter products by name, category, or description
    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value) ||
        p.description.toLowerCase().includes(value)
    );

    setSuggestions(filtered);
  };

  // 🔎 Search button or Enter key
  const handleSearch = () => {
    if (query.trim() === "") return;

    const filtered = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );

    navigate("/search", { state: { results: filtered, query } });
    setSuggestions([]);
  };

  const handleShow = () => setShowCart(true);
  const handleClose = () => setShowCart(false);

  return (
    <>
      <Navbar expand="lg" className="freshhunt-navbar shadow-sm" sticky="top">
        <div className="navbar-wrapper">
          <Container fluid className="navbar-container">
            {/* LEFT: Brand + Location */}
            <div className="nav-left d-flex align-items-center">
              <Navbar.Brand as={Link} to="/" className="freshhunt-brand">
                FRESHHUNT
              </Navbar.Brand>
              <div className="location-dropdown d-flex align-items-center ms-3">
                <MapPin size={16} className="me-1 text-success" />
                <select className="location-select">
                  <option value="mumbai">Mumbai</option>
                  <option value="pune">Pune</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                </select>
              </div>
            </div>

            {/* CENTER: Search Bar with Live Suggestions */}
            <div className="nav-search flex-grow-1 mx-4 position-relative">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search for fresh groceries"
                  value={query}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  className="btn btn-success search-btn"
                  type="button"
                  onClick={handleSearch}
                >
                  <Search size={16} />
                </button>
              </div>

              {/* 🔽 Suggestion Dropdown */}
              {suggestions.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 mt-1"
                  style={{
                    zIndex: 1000,
                    maxHeight: "250px",
                    overflowY: "auto",
                  }}
                >
                  {suggestions.slice(0, 6).map((item) => (
                    <li
                      key={item.id}
                      className="list-group-item list-group-item-action d-flex align-items-center"
                      onClick={() => {
                        setQuery(item.name);
                        setSuggestions([]);
                        navigate(`/productdetails/${item.id}`, {
                          state: { product: item },
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginRight: "10px",
                        }}
                      />
                      <div>
                        <div>{item.name}</div>
                        <small className="text-muted">{item.category}</small>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* RIGHT: Nav Links */}
            <div className="nav-right d-flex align-items-center">
              <Nav className="d-flex align-items-center">
                {/* 🏠 Home */}
                <Nav.Item>
                  <Link to="/" className="nav-item nav-link">
                    <Home size={16} className="me-1" /> Home
                  </Link>
                </Nav.Item>

                {/* 🏬 Stores */}
                <Nav.Item>
                  <Link to="/stores" className="nav-item nav-link">
                    <Store size={16} className="me-1" /> Stores
                  </Link>
                </Nav.Item>

                {/* 👤 Account or Login */}
                <Nav.Item>
                  {user ? (
                    <Link to="/account" className="nav-item nav-link">
                      <User size={16} className="me-1" /> Account
                    </Link>
                  ) : (
                    <Link to="/login" className="nav-item nav-link">
                      <User size={16} className="me-1" /> Login
                    </Link>
                  )}
                </Nav.Item>

                {/* 🛒 Cart */}
                <Nav.Item>
                  <Link to="/cart" className="cart-btn">
                    🛒 Cart ({totalItems})
                  </Link>
                </Nav.Item>



                {/* <Nav.Item>
                  <Link to="/chatbot" className="nav-item nav-link">
                    <Home size={16} className="me-1" /> Chatbot
                  </Link>
                </Nav.Item> */}

              
              </Nav>
            </div>
          </Container>
        </div>
      </Navbar>

      {/* ✅ Cart Popup */}
      <CartPopup show={showCart} handleClose={handleClose} />
    </>
  );
}

export default FreshHuntNavbar;
