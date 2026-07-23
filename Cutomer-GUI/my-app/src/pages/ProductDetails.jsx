import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../data/CartContext";
import productsData from "../data/Product.json";
import { Star, ShieldCheck, Clock, CheckCircle2, ShoppingCart } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import ReviewSection from "../components/ReviewSection";
import RecommendedCarousel from "../components/RecommendedCarousel";

/** Utility function for merging Tailwind classes safely */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined); // Initial undefined to show loader
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviewSummary, setReviewSummary] = useState({ average: (5.0).toFixed(1), count: 0 });

  // Cart Context actions
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  // Derived state to find the product in all JSON data
  useEffect(() => {
    const allProducts = Object.values(productsData).flat();
    const found = allProducts.find((p) => p.id === parseInt(id, 10));

    if (found) {
      setProduct(found);
      const initialReviews = found.reviews || [];
      const total = initialReviews.reduce((acc, r) => acc + r.rating, 0);
      setReviewSummary({
        average: initialReviews.length ? (total / initialReviews.length).toFixed(1) : (5.0).toFixed(1),
        count: initialReviews.length
      });
      if (found.variants?.length) {
        setSelectedVariant(found.variants[0]);
      }
    } else {
      setProduct(null);
    }
  }, [id]);

  // Derived Values utilizing useMemo
  const cartItem = useMemo(() => {
    if (!product) return null;
    return cart.find((item) => item.id === product.id) || null;
  }, [cart, product]);



  // Calculate pricing based on variants if applicable
  const currentPrice = selectedVariant ? selectedVariant.price || product?.price : product?.price;
  const currentOldPrice = selectedVariant ? selectedVariant.oldPrice || product?.oldPrice : product?.oldPrice;

  const scrollToReviews = useCallback(() => {
    const section = document.getElementById("reviews-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Loading / Error States
  if (product === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Loading Product...</p>
        </div>
      </div>
    );
  }

  if (product === null) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The item you are looking for might have been removed or is temporarily unavailable.</p>
        <button onClick={() => window.history.back()} className="px-6 py-2 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-16 px-4 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="max-w-7xl mx-auto w-full">

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex text-sm text-gray-400 font-bold mb-8 mt-4 uppercase tracking-[0.1em]">
          <span className="hover:text-green-600 cursor-pointer transition-colors">Home</span>
          <span className="mx-3 text-gray-300">/</span>
          <span className="hover:text-green-600 cursor-pointer transition-colors">Shop</span>
          <span className="mx-3 text-gray-300">/</span>
          <span className="text-gray-900">{product.category}</span>
        </nav>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-12 gap-y-12 relative w-full items-start">

          {/* COLUMN 1: IMAGE */}
          <div className="lg:col-span-5 flex flex-col w-full h-auto">
            <div className="lg:sticky lg:top-24 w-full">
              <div className="relative w-full aspect-square bg-white rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center p-8 overflow-hidden">
                {product.discount && (
                  <span className="absolute top-6 left-6 bg-red-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg z-10 shadow-lg shadow-red-100 uppercase tracking-widest leading-none">
                    {product.discount}% OFF
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain filter drop-shadow-xl hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* COLUMN 2: INFO */}
          <div className="lg:col-span-4 flex flex-col w-full">
            <div className="mb-2">
              <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg border border-green-100 uppercase tracking-widest leading-none">
                {product.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 leading-none mb-4 tracking-tighter">
              {product.name}
            </h1>

            <button
              onClick={scrollToReviews}
              className="flex items-center gap-3 mb-8 w-max transition-all hover:translate-x-1"
            >
              <div className="flex items-center bg-amber-400 text-white px-3 py-1.5 rounded-xl text-sm font-black shadow-lg shadow-amber-100">
                <span>{reviewSummary.average}</span>
                <Star className="w-3.5 h-3.5 ml-1 fill-white text-white" />
              </div>
              <span className="text-sm text-gray-400 font-bold border-b-2 border-transparent hover:border-gray-200 transition-all">
                {reviewSummary.count} Ratings & Reviews
              </span>
            </button>

            <div className="flex items-end gap-3 mb-8">
              <span className="text-5xl font-black text-gray-900 tracking-tighter">
                ₹{currentPrice}
              </span>
              {currentOldPrice && (
                <span className="text-xl text-gray-300 line-through font-bold mb-1">
                  ₹{currentOldPrice}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-[#fff8e1]/50 text-[#b47a00] px-4 py-2.5 rounded-2xl text-[11px] font-black border border-[#ffe082]/30 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-500" />
                15 mins delivery
              </div>
              <div className="flex items-center gap-2 bg-green-50/50 text-green-700 px-4 py-2.5 rounded-2xl text-[11px] font-black border border-green-200/30 uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                In Stock
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-black text-gray-900 mb-4 uppercase tracking-[0.2em]">Product Details</h3>
              <p className="text-gray-500 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            {product.variants?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-[10px] font-black text-gray-400 mb-4 uppercase tracking-[0.2em]">Select Pack Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {product.variants.map((v, i) => {
                    const isSelected = selectedVariant ? v.type === selectedVariant.type : i === 0;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedVariant(v)}
                        className={cn(
                          "px-6 py-3 rounded-2xl font-black text-xs transition-all uppercase tracking-widest",
                          isSelected
                            ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                            : "bg-white text-gray-400 border-2 border-gray-100 hover:border-gray-200"
                        )}
                      >
                        {v.type}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* COLUMN 3: BUY BOX */}
          <div className="lg:col-span-3 w-full">
            <div className="lg:sticky lg:top-24 bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-100">
              <div className="text-center mb-8">
                <span className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">Subtotal</span>
                <span className="text-5xl font-black text-gray-900 tracking-tighter">
                  ₹{cartItem ? (currentPrice * cartItem.qty).toFixed(2) : parseFloat(currentPrice).toFixed(2)}
                </span>
              </div>

              {cartItem ? (
                <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 mb-4 border border-gray-100">
                  <button
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-gray-800 hover:bg-gray-100 active:scale-90 transition-all"
                    onClick={() => decreaseQty(product.id)}
                  >
                    <span className="w-4 h-0.5 bg-gray-800 rounded-full block" />
                  </button>
                  <span className="text-xl font-black text-gray-900">
                    {cartItem.qty}
                  </span>
                  <button
                    className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-green-600 hover:bg-green-50 active:scale-90 transition-all"
                    onClick={() => increaseQty(product.id)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              ) : (
                <button
                  className="w-full h-16 mb-4 bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-green-100 hover:bg-green-700 hover:shadow-green-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              )}

              <button className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all mb-8 active:scale-[0.98]">
                Instant Checkout
              </button>

              <div className="space-y-6 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Safe Payment</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">SSL Encrypted</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-widest">Zero Adultery</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">100% Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REVIEW SECTION */}
        <ReviewSection
          initialReviews={product.reviews || []}
          productId={product.id}
          category={product.category}
          onSummaryUpdate={setReviewSummary}
        />

        {/* RELATED RECOMMENDATIONS */}
        <div className="mt-16">
          <RecommendedCarousel currentItem={product.name} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
