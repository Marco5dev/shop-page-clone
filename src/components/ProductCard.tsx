import { useState } from "react";

// Define a more comprehensive type for the card data
interface ProductCardData {
  id: number;
  title: string;
  image: string;
  link: string;
  price?: string;
  rating?: number; // 0-5 scale
  reviewCount?: number;
  isOnSale?: boolean;
  salePrice?: string;
}

export default function ProductCard({
  card,
  isWhiteMode,
}: {
  card: ProductCardData;
  isWhiteMode: boolean;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the heart
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  // Calculate discount percentage if item is on sale
  const calculateDiscount = () => {
    if (!card.isOnSale || !card.price || !card.salePrice) return null;

    // Extract numeric price values
    const originalPrice = parseFloat(
      card.price.match(/(\d+\.\d+|\d+)/)?.[0] || "0"
    );
    const discountPrice = parseFloat(
      card.salePrice.match(/(\d+\.\d+|\d+)/)?.[0] || "0"
    );

    if (originalPrice <= 0 || discountPrice <= 0) return null;

    // Calculate discount percentage and round to nearest integer
    const discountPercent = Math.round(
      ((originalPrice - discountPrice) / originalPrice) * 100
    );
    return discountPercent > 0 ? `${discountPercent}% OFF` : null;
  };

  // Get discount text to display
  const discountText = calculateDiscount();

  // Generate star rating based on the actual rating value
  const renderStars = () => {
    const rating = card.rating || 0;
    const stars = [];
    const totalStars = 5;

    for (let i = 1; i <= totalStars; i++) {
      if (i <= Math.floor(rating)) {
        // Full star
        stars.push(
          <i
            key={i}
            className="pi pi-star-fill"
            style={{
              color: "#FFC107",
              fontSize: "14px",
              marginRight: "2px",
            }}
          />
        );
      } else if (i === Math.ceil(rating) && rating % 1 >= 0.5) {
        // Half star (for ratings like 4.5)
        stars.push(
          <i
            key={i}
            className="pi pi-star-half"
            style={{
              color: "#FFC107",
              fontSize: "14px",
              marginRight: "2px",
            }}
          />
        );
      } else {
        // Empty star
        stars.push(
          <i
            key={i}
            className="pi pi-star"
            style={{
              color: isWhiteMode ? "#DDD" : "rgba(255,255,255,0.3)",
              fontSize: "14px",
              marginRight: "2px",
            }}
          />
        );
      }
    }

    return stars;
  };

  return (
    <a
      key={card.id}
      href={card.link}
      className="flex flex-column align-items-center justify-content-center text-decoration-none gap-1 product-card"
      style={{ 
        width: "100%",
        height: "100%"
      }}
    >
      <div
        className="card-image-container"
        style={{
          overflow: "hidden",
          borderRadius: "8px",
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
        }}
      >
        <img
          loading="lazy"
          src={card.image}
          alt={card.title}
          className="card-image"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Heart/like button */}
        <div
          className="heartButtonHover like-button flex align-items-center justify-content-center"
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            cursor: "pointer",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            backdropFilter: "blur(10px)",
            transition: "background-color 0.3s ease",
          }}
          onClick={handleFavoriteClick}
        >
          <i
            className={`${isFavorite ? "pi pi-heart-fill" : "pi pi-heart"}`}
            style={{
              color: isFavorite ? "#FE251B" : "rgba(255,255,255,0.5)",
              fontSize: "16px",
            }}
          ></i>
        </div>

        {/* Sale badge with discount percentage, only displayed if item is on sale */}
        {card.isOnSale && discountText && (
          <div
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              backgroundColor: "#FE251B",
              color: "white",
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            {discountText}
          </div>
        )}
      </div>

      {/* Product Title */}
      <div className="w-full text-left">
        <p
          className={`${
            isWhiteMode ? "text-black" : "text-white"
          } m-0 font-semibold`}
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {card.title}
        </p>
      </div>

      {/* Rating Stars - dynamically generated based on rating value */}
      <div className="w-full flex align-items-center">
        <div className="stars flex">{renderStars()}</div>
        <span
          className="review-count ml-1"
          style={{
            fontSize: "14px",
            color: isWhiteMode ? "#666" : "#ccc",
          }}
        >
          ({card.reviewCount || 0})
        </span>
      </div>

      {/* Price - with sale price handling */}
      <div className="w-full text-left flex align-items-center">
        <p
          className={`${
            isWhiteMode ? "text-black" : "text-white"
          } m-0 font-bold`}
          style={{ fontSize: "16px" }}
        >
          {card.isOnSale
            ? card.salePrice || "18.00 US$"
            : card.price || "22.00 US$"}
        </p>

        {/* Display original price if on sale */}
        {card.isOnSale && (
          <p
            style={{
              textDecoration: "line-through",
              marginLeft: "6px",
              fontSize: "14px",
              color: isWhiteMode ? "#888" : "#ccc",
            }}
          >
            {card.price || "22.00 US$"}
          </p>
        )}
      </div>
    </a>
  );
}
