import React, { useState, useEffect, useCallback, useContext } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion } from "framer-motion";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

const ProductReviews = ({ productId, onReviewAdded }) => {
  const { baseUrl } = useContext(userDataContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingDistribution, setRatingDistribution] = useState({});
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    reviewText: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/api/v1/reviews/${productId}/reviews?page=${currentPage}&sortBy=${sortBy}`,
        { withCredentials: true }
      );

      const data = response.data;
      setReviews(data.reviews);
      setAverageRating(data.averageRating);
      setTotalReviews(data.totalReviews);
      setRatingDistribution(data.ratingDistribution);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy, currentPage, baseUrl]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleStarClick = (rating) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!newReview.rating || !newReview.reviewText.trim()) {
      alert("Please provide both rating and review text");
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `${baseUrl}/api/v1/reviews/${productId}/review`,
        newReview,
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        setNewReview({ rating: 0, reviewText: "" });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
        if (onReviewAdded) onReviewAdded();
        alert("Review submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert(error.response?.data?.message || "An error occurred while submitting the review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false, onClick = null) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => onClick(star) : undefined}
            className={interactive ? "cursor-pointer" : "cursor-default"}
            disabled={!interactive}
          >
            {star <= rating ? (
              <AiFillStar className="text-yellow-400 w-5 h-5" />
            ) : (
              <AiOutlineStar className="text-gray-300 w-5 h-5" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#262626]">
          Customer Reviews ({totalReviews})
        </h3>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-[#e4a4bd] hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium organic-btn"
        >
          {showReviewForm ? "Cancel" : "Write Review"}
        </button>
      </div>

      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="bg-[#fdf8f3] p-4 rounded-lg organic-card">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#262626]">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating))}
              <div className="text-sm text-gray-600 mt-1">{totalReviews} reviews</div>
            </div>

            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm w-3">{rating}</span>
                  <AiFillStar className="text-yellow-400 w-3 h-3" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[rating] / totalReviews) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-[#fdf8f3] p-4 rounded-lg organic-card"
        >
          <h4 className="text-md font-semibold mb-4">Write Your Review</h4>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderStars(newReview.rating, true, handleStarClick)}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.reviewText}
                onChange={(e) => setNewReview(prev => ({ ...prev, reviewText: e.target.value }))}
                rows="4"
                className="organic-input w-full"
                placeholder="Share your thoughts about this product..."
                required
              />
            </div>


        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          type="button"
          onClick={() => setShowReviewForm(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all-slow"
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          whileTap={{ scale: 0.97, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
          type="submit"
          disabled={submitting}
          className="organic-btn bg-[#e4a4bd] text-white hover:bg-[#d494ad] disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </motion.button>
          </form>
        </motion.div>
      )}

      {/* Sort Options */}
      {totalReviews > 0 && (
        <div className="flex items-center justify-between">
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#e4a4bd]/30 rounded-lg p-4 organic-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#f5f0eb] rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-[#d494ad]">
                    {review.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-[#262626]">{review.userName}</div>
                  <div className="text-sm text-[#7a6b54]">{formatDate(review.createdAt)}</div>
                </div>
              </div>

               <div className="flex items-center space-x-2">
                 {renderStars(review.rating)}
                 {review.verifiedPurchase && (
                   <span className="text-xs bg-[#f3efe8] text-[#6b7d56] px-2 py-1 rounded-full organic-badge">
                     Verified Purchase
                   </span>
                 )}
               </div>
            </div>

            <p className="text-gray-700 mb-3">{review.reviewText}</p>

            <div className="flex items-center justify-between">
              <button className="text-sm text-[#7a6b54] hover:text-gray-700 flex items-center space-x-1">
                <span>👍 Helpful ({review.helpful})</span>
              </button>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && totalReviews === 0 && (
          <div className="text-center py-8 text-[#7a6b54]">
            <p>No reviews yet. Be the first to review this product!</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <motion.button
            whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-[#e4a4bd]/30 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f3efe8] transition-all-slow organic-btn"
          >
            Previous
          </motion.button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <motion.button
              key={page}
              whileHover={{ scale: 1.05, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              whileTap={{ scale: 0.95, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 border rounded-md organic-btn transition-all-slow ${
                currentPage === page
                  ? "bg-[#e4a4bd] text-white border-[#e4a4bd]"
                  : "border-[#e4a4bd]/30 hover:bg-[#f3efe8]"
              }`}
            >
              {page}
            </motion.button>
          ))}

          <motion.button
            whileHover={{ scale: 1.02, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            whileTap={{ scale: 0.98, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-[#e4a4bd]/30 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f3efe8] transition-all-slow organic-btn"
          >
            Next
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
