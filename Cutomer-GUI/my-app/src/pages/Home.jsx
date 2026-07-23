import React from "react";
import FreshHuntNavbar from "../components/FreshHuntNavbar"; // ✅ Navbar import
import ProductCarousel from "../components/ProductCarousel";
import RecommendedCarousel from "../components/RecommendedCarousel"; // ✅ Added RecommendedCarousel
import productsData from "../data/Product.json";
import "../index.css";
import HeroBannerSwiper from "../components/HeroBannerSwiper";
import FreshHuntFooter from "../components/FreshHuntFooter";

function Home() {
  return (<>
    <FreshHuntNavbar />

    <HeroBannerSwiper />

    <div className="home-page">
      <RecommendedCarousel />
      <ProductCarousel products={productsData} />
    </div>

    <FreshHuntFooter />

  </>

  );
}

export default Home;
