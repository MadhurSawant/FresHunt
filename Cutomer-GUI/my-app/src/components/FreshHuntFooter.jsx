import React from "react";
import { Link } from "react-router-dom"; // ✅ Import Link

const FreshHuntFooter = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* About */}
        <div style={styles.section}>
          <h2 style={styles.heading}>FreshHunt</h2>
          <p>Your smart grocery store for fresh and healthy products delivered fast and easy.</p>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={styles.list}>
            <li><Link style={styles.link} to="/">Home</Link></li>
            {/* <li><Link style={styles.link} to="/shop">Shop</Link></li> */}
            <li><Link style={styles.link} to="/about">About Us</Link></li>
            <li><Link style={styles.link} to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact Us</h3>
          <p>Email: support@freshhunt.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Market Street, Your City</p>
        </div>

        {/* Social */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Follow Us</h3>
          <div style={styles.social}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <img style={styles.icon} src="/icons/facebook.svg" alt="Facebook" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <img style={styles.icon} src="/icons/instagram.svg" alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <img style={styles.icon} src="/icons/twitter.svg" alt="Twitter" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div style={styles.bottom}>
        <p>© {new Date().getFullYear()} FreshHunt. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#d9f99d", // light green background
    color: "#065f46",           // dark green text
    padding: "40px 20px 20px",
    fontFamily: "'Arial', sans-serif",
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
  },
  section: {
    flex: "1 1 200px",
    minWidth: "200px",
  },
  heading: {
    color: "#22c55e",  // medium green accent
    marginBottom: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  link: {
    color: "#065f46",
    textDecoration: "none",
    display: "block",
    marginBottom: "8px",
    transition: "color 0.3s",
  },
  social: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  icon: {
    width: "24px",
    height: "24px",
    filter: "invert(25%) sepia(40%) saturate(600%) hue-rotate(85deg) brightness(95%) contrast(90%)", 
  },
  bottom: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "14px",
    borderTop: "1px solid #a3e635", // light green border
    paddingTop: "15px",
  },
};

export default FreshHuntFooter;
