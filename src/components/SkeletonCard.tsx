import "@/styles/SkeletonCard.css";

interface SkeletonCardProps {
  isWhiteMode: boolean;
}

export default function SkeletonCard({ isWhiteMode }: SkeletonCardProps) {
  return (
    <a
      className="flex flex-column align-items-center justify-content-center text-decoration-none gap-1"
      style={{ width: "100%" }}
    >
      <div
        className="skeleton-image pulse"
        style={{
          overflow: "hidden",
          borderRadius: "8px",
          position: "relative",
          width: "100%",
          aspectRatio: "1/1",
          backgroundColor: isWhiteMode
            ? "#e0e0e0"
            : "rgba(255, 255, 255, 0.15)",
        }}
      ></div>

      {/* Title placeholder */}
      <div className="w-full text-left">
        <div
          className="skeleton-title pulse"
          style={{
            height: "18px",
            width: "90%",
            borderRadius: "4px",
            backgroundColor: isWhiteMode
              ? "#e0e0e0"
              : "rgba(255, 255, 255, 0.15)",
            marginTop: "4px",
          }}
        ></div>
      </div>

      {/* Rating placeholder */}
      <div className="w-full flex align-items-center">
        <div
          className="skeleton-rating pulse"
          style={{
            height: "14px",
            width: "70%",
            borderRadius: "4px",
            backgroundColor: isWhiteMode
              ? "#e0e0e0"
              : "rgba(255, 255, 255, 0.15)",
          }}
        ></div>
      </div>

      {/* Price placeholder */}
      <div className="w-full text-left flex align-items-center">
        <div
          className="skeleton-price pulse"
          style={{
            height: "16px",
            width: "30%",
            borderRadius: "4px",
            backgroundColor: isWhiteMode
              ? "#e0e0e0"
              : "rgba(255, 255, 255, 0.15)",
            marginTop: "4px",
          }}
        ></div>
      </div>
    </a>
  );
}
