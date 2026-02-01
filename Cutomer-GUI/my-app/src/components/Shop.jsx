import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag } from "lucide-react";

const API_URL = "http://localhost:9000"; // ✅ your backend API base URL

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Fetch all products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(`${API_URL}/products`);
        setProducts(prodRes.data);
        const uniqueCats = [
          "All",
          ...new Set(prodRes.data.map((p) => p.category || "Others")),
        ];
        setCategories(uniqueCats);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((item) => item.category === selectedCategory);

  return (
    <div style={styles.shopPage}>
      {/* 🟢 Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <ShoppingBag size={28} style={{ marginRight: "10px" }} />
          FreshHunt Smart Grocery Store
        </h2>
        <p style={styles.subtitle}>Buy fresh. Eat healthy. Save smart.</p>
      </div>

      {/* 🟢 Category Tabs */}
      <div style={styles.categoryBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            style={{
              ...styles.categoryButton,
              backgroundColor:
                selectedCategory === cat ? "#16a34a" : "#bbf7d0",
              color: selectedCategory === cat ? "#fff" : "#065f46",
            }}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🟢 Product Grid */}
      <div style={styles.container}>
        {loading ? (
          <p style={styles.loading}>Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <p style={styles.loading}>No products found in this category.</p>
        ) : (
          <div style={styles.grid}>
            {filteredProducts.map((item) => (
              <div key={item._id} style={styles.card}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={styles.image}
                  loading="lazy"
                />
                <div style={styles.info}>
                  <h4 style={styles.name}>{item.name}</h4>
                  <p style={styles.category}>{item.category}</p>
                  <div style={styles.price}>₹{item.price}</div>
                  <button style={styles.button}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ================== STYLES ================== */
const styles = {
  shopPage: {
    backgroundColor: "#f0fdf4",
    minHeight: "100vh",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  title: {
    color: "#15803d",
    fontWeight: "700",
  },
  subtitle: {
    color: "#047857",
    fontSize: "1rem",
  },
  categoryBar: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "25px",
  },
  categoryButton: {
    border: "none",
    borderRadius: "20px",
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  container: {
    display: "flex",
    justifyContent: "center",
  },
  loading: {
    color: "#047857",
    fontWeight: "500",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "1.5rem",
    width: "100%",
    maxWidth: "1200px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #bbf7d0",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(34, 197, 94, 0.15)",
    transition: "transform 0.3s, box-shadow 0.3s",
  },
  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    backgroundColor: "#f0fdf4",
  },
  info: {
    padding: "1rem",
    textAlign: "center",
  },
  name: {
    color: "#14532d",
    fontWeight: "600",
    marginBottom: "5px",
  },
  category: {
    color: "#059669",
    fontSize: "0.9rem",
    marginBottom: "8px",
  },
  price: {
    color: "#047857",
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "25px",
    padding: "8px 16px",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
};

export default Shop;
