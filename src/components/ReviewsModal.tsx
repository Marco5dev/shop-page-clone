import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import ReviewCard from "./ReviewCard";
import "../styles/ReviewsModal.css";

interface Review {
  id: number;
  username: string;
  daysAgo: number;
  productName: string;
  size: string;
  reviewText: string;
  rating: number;
  profileImage?: string;
}

interface ReviewsModalProps {
  visible: boolean;
  onHide: () => void;
  reviews: Review[];
  overallRating: number;
  totalReviews: number;
  isWhiteMode: boolean;
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  visible,
  onHide,
  reviews,
  overallRating,
  totalReviews,
  isWhiteMode,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Generate star rating
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className="text-yellow-500" style={{ fontSize: "24px" }}>
          {i < rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      dismissableMask
      header="Ratings and reviews"
      className={`reviews-modal ${isWhiteMode ? "light-mode" : "dark-mode"} ${
        isMobile ? "mobile-fullscreen" : ""
      }`}
      style={{
        width: isMobile ? "100vw" : "90vw",
        maxWidth: isMobile ? "100vw" : "800px",
        height: isMobile ? "100vh" : "auto",
        maxHeight: isMobile ? "100vh" : "90vh",
        margin: isMobile ? 0 : undefined,
        position: isMobile ? "fixed" : undefined,
        top: isMobile ? 0 : undefined,
        left: isMobile ? 0 : undefined,
        borderRadius: isMobile ? 0 : "20px",
        overflow: "hidden",
      }}
      contentStyle={{
        padding: "0",
        height: isMobile ? "calc(100vh - 60px)" : "auto",
        overflow: "auto",
        border: "none",
      }}
      headerStyle={{
        padding: isMobile ? "1rem" : "1.5rem",
        background: isWhiteMode ? "#fff" : "#8b7f78",
        color: isWhiteMode ? "#000" : "#fff",
        borderRadius: isMobile ? 0 : undefined,
        borderBottom: "none", // Remove border bottom
      }}
    >
      <div className={`${isMobile ? "p-3" : "p-4"}`}>
        <div
          className="ratings-summary flex align-items-center mb-4 p-3"
          style={{
            borderRadius: "20px",
            background: isWhiteMode ? "#f0f0f0" : "rgba(255,255,255,0.1)",
          }}
        >
          <div className="rating-number text-4xl font-bold mr-3">
            {overallRating}
          </div>
          <div className="rating-details">
            <div className="stars-container mb-1">
              {renderStars(Math.round(overallRating))}
            </div>
            <div className="review-count text-sm">{totalReviews} ratings</div>
          </div>
        </div>

        <div className="reviews-list">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              username={review.username}
              daysAgo={review.daysAgo}
              productName={review.productName}
              size={review.size}
              reviewText={review.reviewText}
              rating={review.rating}
              isWhiteMode={isWhiteMode}
              profileImage={review.profileImage}
            />
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default ReviewsModal;
