import React from "react";

const AboutUs = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>About Us</h1>
      <p style={styles.text}>
        Welcome to FreshHunt! We are a smart grocery store dedicated to bringing fresh and
        high-quality products to your doorstep. Our mission is to make grocery shopping
        easy, convenient, and enjoyable for everyone.
      </p>
      <p style={styles.text}>
        We believe in freshness, sustainability, and excellent customer service. With FreshHunt,
        you can shop with confidence knowing you are getting the best products at the best prices.
      </p>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "#f9fdf7", // light theme background
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    color: "#4CAF50",
    textAlign: "center",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#333",
    marginBottom: "15px",
  },
};

export default AboutUs;
