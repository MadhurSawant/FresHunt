import React, { useState, useMemo, useEffect } from "react";
import { Star, MessageSquare, ChevronDown, ChevronUp, CheckCircle2, Trash2, Edit3, X, Send } from "lucide-react";
import axios from "axios";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const ReviewSection = ({ initialReviews = [], productId, category, onSummaryUpdate }) => {
    const [reviews, setReviews] = useState(initialReviews);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [sortBy, setSortBy] = useState("latest");

    // Form State
    const [formData, setFormData] = useState({
        userName: "",
        rating: 5,
        comment: ""
    });

    // Calculations
    const averageRating = useMemo(() => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((acc, rev) => acc + (rev.rating || 0), 0);
        return (total / reviews.length).toFixed(1);
    }, [reviews]);

    const sortedReviews = useMemo(() => {
        if (!reviews) return [];
        let result = [...reviews];
        if (sortBy === "latest") {
            result.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        } else if (sortBy === "highest") {
            result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === "lowest") {
            result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        }
        return result;
    }, [reviews, sortBy]);

    const ratingBreakdown = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        if (reviews) {
            reviews.forEach(rev => {
                if (counts[rev.rating] !== undefined) counts[rev.rating]++;
            });
        }
        const total = (reviews?.length) || 1;
        return Object.keys(counts).reverse().map(star => ({
            star: parseInt(star),
            count: counts[star],
            percentage: Math.round((counts[star] / total) * 100)
        }));
    }, [reviews]);

    // Sync with initialReviews if product changes
    useEffect(() => {
        if (initialReviews) {
            setReviews(initialReviews);
        }
    }, [initialReviews]);

    // Notify parent of changes to update average rating in main product header
    useEffect(() => {
        if (onSummaryUpdate) {
            onSummaryUpdate({
                average: averageRating,
                count: (reviews?.length) || 0
            });
        }
    }, [averageRating, reviews?.length, onSummaryUpdate]);

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "rating" ? parseInt(value) : value
        }));
    };

    const resetForm = () => {
        setFormData({ userName: "", rating: 5, comment: "" });
        setShowReviewForm(false);
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.userName.trim() || !formData.comment.trim()) return;

        setIsSubmitting(true);
        try {
            if (editingId) {
                const response = await axios.put(`http://localhost:9000/products/${category}/${productId}/reviews/${editingId}`, {
                    ...formData,
                    date: new Date().toISOString().split('T')[0]
                });
                setReviews(response.data.reviews);
            } else {
                const newReview = {
                    ...formData,
                    date: new Date().toISOString().split('T')[0]
                };
                const response = await axios.post(`http://localhost:9000/products/${category}/${productId}/reviews`, newReview);
                setReviews(response.data.reviews);
            }
            resetForm();
        } catch (error) {
            console.error("Error saving review:", error);
            alert("Failed to save review. Please check if backend is running.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const startEdit = (review) => {
        setEditingId(review.reviewId);
        setFormData({
            userName: review.userName,
            rating: review.rating,
            comment: review.comment
        });
        setShowReviewForm(true);
        // Scroll to form
        document.getElementById("review-form-anchor")?.scrollIntoView({ behavior: "smooth" });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                const response = await axios.delete(`http://localhost:9000/products/${category}/${productId}/reviews/${id}`);
                setReviews(response.data.reviews);
            } catch (error) {
                console.error("Error deleting review:", error);
                alert("Failed to delete review.");
            }
        }
    };

    return (
        <section id="reviews-section" className="w-full mt-16 bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8 mb-8">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-green-600" />
                        Customer Reviews
                    </h2>
                    <p className="text-gray-500 mt-1 font-medium">Read what others say about this product</p>
                </div>

                <button
                    onClick={() => {
                        if (showReviewForm && editingId) {
                            resetForm();
                        } else {
                            setShowReviewForm(!showReviewForm);
                        }
                    }}
                    className={cn(
                        "flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-2xl transition-all shadow-sm active:scale-95",
                        showReviewForm
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-green-600 text-white hover:bg-green-700 hover:shadow-green-100 shadow-md"
                    )}
                >
                    {showReviewForm ? (editingId ? "Cancel Editing" : "Cancel Review") : "Write a Review"}
                    {showReviewForm ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Column: Summary & Breakdown */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-gray-50/50 rounded-[2rem] p-8 border border-gray-100 text-center">
                        <div className="text-6xl font-black text-gray-900 mb-2">{averageRating}</div>
                        <div className="flex justify-center gap-1 mb-4">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={cn(
                                        "w-6 h-6",
                                        s <= Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"
                                    )}
                                />
                            ))}
                        </div>
                        <p className="text-gray-500 font-bold bg-white inline-block px-4 py-1.5 rounded-full border border-gray-100 shadow-sm">
                            {reviews.length} Global Ratings
                        </p>
                    </div>

                    {/* Breakdown Bars */}
                    <div className="space-y-4 px-2">
                        {ratingBreakdown.map((item) => (
                            <div key={item.star} className="flex items-center gap-4 group">
                                <span className="text-sm font-bold text-gray-600 w-12 flex items-center gap-1">
                                    {item.star} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                </span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-amber-400 rounded-full transition-all duration-1000"
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm font-bold text-gray-400 w-10 text-right">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Form & List */}
                <div className="lg:col-span-8 space-y-8">
                    <div id="review-form-anchor" />

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="bg-green-50/40 p-6 md:p-8 rounded-[2rem] border border-green-100 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                {editingId ? "Update your review" : "Rate this product"}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Your Name</label>
                                        <input
                                            type="text"
                                            name="userName"
                                            required
                                            placeholder="Enter your name"
                                            className="w-full p-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium"
                                            value={formData.userName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Rating</label>
                                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-2.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setFormData(p => ({ ...p, rating: s }))}
                                                    className="p-1 hover:scale-110 transition-transform"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "w-7 h-7 transition-colors",
                                                            s <= formData.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Your Experience</label>
                                    <textarea
                                        name="comment"
                                        required
                                        placeholder="What did you like or dislike?"
                                        className="w-full p-4 bg-white border border-gray-200 rounded-2xl min-h-[120px] focus:ring-2 focus:ring-green-500 outline-none transition-all font-medium resize-none"
                                        value={formData.comment}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !formData.userName.trim() || !formData.comment.trim()}
                                        className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
                                    >
                                        {isSubmitting ? "Saving..." : (editingId ? "Update Review" : "Submit Review")}
                                        {!isSubmitting && <Send className="w-4 h-4" />}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Sort & List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-bold text-gray-900">
                                All Reviews <span className="text-gray-400 ml-1">({reviews.length})</span>
                            </h3>
                            <select
                                className="bg-transparent font-bold text-sm text-gray-600 outline-none cursor-pointer"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="latest">Most Recent</option>
                                <option value="highest">Highest Rated</option>
                                <option value="lowest">Lowest Rated</option>
                            </select>
                        </div>

                        {sortedReviews.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 font-bold">No reviews yet.</p>
                                <p className="text-gray-400 text-sm mt-1">Be the first to share your experience!</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {sortedReviews.map((rev) => (
                                    <div
                                        key={rev.reviewId}
                                        className="group bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-green-100">
                                                    {rev.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-gray-900 text-lg">{rev.userName}</h4>
                                                        <span className="flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-lg border border-green-100">
                                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <div className="flex">
                                                            {[1, 2, 3, 4, 5].map((s) => (
                                                                <Star
                                                                    key={s}
                                                                    className={cn(
                                                                        "w-3.5 h-3.5",
                                                                        s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"
                                                                    )}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-medium">
                                                            {rev.date}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => startEdit(rev)}
                                                    className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-green-50 hover:text-green-600 transition-colors border border-transparent hover:border-green-100"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(rev.reviewId)}
                                                    className="p-2.5 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors border border-transparent hover:border-red-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 font-medium leading-relaxed pl-1 md:ml-[72px]">
                                            {rev.comment}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
