import React from "react";
import FreshHuntNavbar from "../components/FreshHuntNavbar"; // ✅ Navbar import
import ProductCarousel from "../components/ProductCarousel";
import productsData from "../data/Product.json"; // 
import "../index.css";
import HeroBannerSwiper from "../components/HeroBannerSwiper";
import FreshHuntFooter from "../components/FreshHuntFooter";
function Home() {
  return (<>
    <FreshHuntNavbar />

    <HeroBannerSwiper/>
    
    <div className="home-page">
      <ProductCarousel products={productsData} />
    </div>
    
    <FreshHuntFooter/>

  </>
   
  );
}

export default Home;
