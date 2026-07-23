import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "./ProductCard";
import productsData from "../data/Product.json";
import "swiper/css";
import "swiper/css/navigation";

function RecommendedCarousel({ currentItem = "", username = "" }) {
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // Use props if provided, otherwise fallback to localStorage
                const activeUsername = username || localStorage.getItem("username") || "";

                const response = await axios.post("http://localhost:5000/api/recommend", {
                    username: activeUsername,
                    item: currentItem
                });

                const recNames = response.data.recommendations || [];

                // Find full product objects from Product.json based on names
                let foundProducts = [];
                const allProducts = Object.values(productsData).flat();

                recNames.forEach(name => {
                    const prod = allProducts.find(p => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase()));
                    if (prod && !foundProducts.find(fp => fp.id === prod.id)) {
                        foundProducts.push(prod);
                    }
                });

                // If exact matches are scarce or it's the current product, fallback
                if (foundProducts.length === 0) {
                    foundProducts = allProducts
                        .filter(p => p.name !== currentItem)
                        .slice(0, 5);
                }

                setRecommendedProducts(foundProducts);
            } catch (err) {
                console.error("Failed to load recommendations", err);
                const allProducts = Object.values(productsData).flat();
                setRecommendedProducts(allProducts.filter(p => p.name !== currentItem).slice(0, 5));
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [currentItem, username]);

    if (loading) return null;

    return (
        <div className="product-section" style={{ marginTop: '20px' }}>
            <div className="category-section">
                <h3 className="section-title" style={{ color: "var(--red)" }}>
                    ✨ Recommended For You
                </h3>

                {recommendedProducts.length > 0 ? (
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
                        {recommendedProducts.map((p, i) => (
                            <SwiperSlide key={p.id || `rec-${i}`}>
                                <ProductCard product={p} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p className="no-products">No recommendations available</p>
                )}
            </div>
        </div>
    );
}

export default RecommendedCarousel;
