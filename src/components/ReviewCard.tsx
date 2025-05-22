import { useState } from "react";

interface ReviewCardProps {
  username: string;
  daysAgo: number;
  productName: string;
  size: string;
  reviewText: string;
  rating: number;
  profileImage?: string;
  isWhiteMode: boolean;
}

export default function ReviewCard({
  username,
  daysAgo,
  productName,
  size,
  reviewText,
  rating,
  profileImage,
  isWhiteMode,
}: ReviewCardProps) {
  const [helpfulClicked, setHelpfulClicked] = useState(false);

  const handleHelpfulClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setHelpfulClicked(!helpfulClicked);
  };

  // Generate star rating based on the actual rating value
  const renderStars = () => {
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= rating) {
        // Full star
        stars.push(
          <span
            key={i}
            className="text-yellow-500"
            style={{ fontSize: "21px", fontWeight: "bold" }}
          >
            ★
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span
            key={i}
            style={{
              fontSize: "14px",
              color: isWhiteMode ? "#DDD" : "rgba(255, 255, 255, 0.3)",
            }}
          >
            ☆
          </span>
        );
      }
    }
    return stars;
  };

  const profileColor = profileImage
    ? undefined
    : username === "Ariana"
    ? "#F8E16C"
    : "#333333";

  return (
    <div className="review-card mb-4" style={{ maxWidth: "360px" }}>
      <div className="flex align-items-start mb-2">
        {/* Profile image or placeholder circle */}
        <div
          className="profile-image mr-2"
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "8px",
            backgroundColor: profileColor,
            overflow: "hidden",
          }}
        >
          {profileImage && (
            <img
              src={profileImage}
              alt={username}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Username and time */}
        <div className="flex flex-column justify-content-start align-items-start">
          <div className="flex align-items-center">
            {/* Stars */}
            <div className="flex">{renderStars()}</div>
          </div>
          <div
            className={`flex align-items-center ${
              isWhiteMode ? "text-black" : "text-white"
            }`}
          >
            <span className="text-sm opacity-50" style={{ fontSize: "14px" }}>
              {username} · {daysAgo} days ago
            </span>
          </div>
          {/* Product name and size */}
          <div
            className={` ${
              isWhiteMode ? "text-black" : "text-white"
            } font-medium`}
          >
            {productName}
          </div>
          <div
            className={` ${isWhiteMode ? "text-gray-700" : "text-gray-300"}`}
            style={{ fontSize: "14px" }}
          >
            {size}
          </div>
        </div>
      </div>

      {/* Review text */}
      <p
        className={`${isWhiteMode ? "text-gray-800" : "text-gray-200"} mb-2`}
        style={{ fontSize: "14px", lineHeight: "1.5" }}
      >
        {reviewText}
      </p>

      {/* Helpful button */}
      <button
        className={`flex align-items-center justify-content-center gap-2 px-3 py-1 ${
          isWhiteMode ? "text-gray-600" : "text-gray-300"
        } hover:bg-gray-200 bg-gray-100 ${
          helpfulClicked ? "bg-gray-200" : "bg-gray-100"
        }`}
        style={{
          border: "none",
          background: "transparent",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={handleHelpfulClick}
      >
        <i
          className={`pi pi-thumbs-up ${
            helpfulClicked ? "text-blue-500 font-medium" : ""
          }`}
        ></i>
        <span
          className={`${helpfulClicked ? "text-blue-500 font-medium" : ""}`}
        >
          {helpfulClicked ? "Helpful" : "Helpful"}
        </span>
      </button>
    </div>
  );
}
