import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import "swiper/css";
import "swiper/css/navigation";

const categoryTitles = {
  vegetables: "🥦 Fresh Vegetables",
  fruits: "🍎 Fresh Fruits",
  meat: "🥩 Meat & Eggs",
};

function ProductCarousel({ products = {} }) {
  return (
    <div className="product-section">
      {Object.keys(products).map((category) => (
        <div key={category} className="category-section">
          <h3 className="section-title">
            {categoryTitles[category] || category}
          </h3>

          {products[category]?.length > 0 ? (
            <Swiper
              modules={[Navigation]}
              spaceBetween={10}
              slidesPerView={5}
              navigation
              breakpoints={{
                320: { slidesPerView: 1.2 },
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {products[category].map((p, i) => (
                <SwiperSlide key={p._id || `${category}-${i}`}>
                  <ProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <p className="no-products">No products in {category}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductCarousel;
