import { useEffect, useRef } from "react";
import "../styles/MoreOptionsMenu.css";

interface MoreOptionsMenuProps {
  isVisible: boolean;
  onHide: () => void;
  isWhiteMode: boolean;
  isMobile: boolean;
}

export default function MoreOptionsMenu({
  isVisible,
  onHide,
  isWhiteMode,
  isMobile,
}: MoreOptionsMenuProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside to close the menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isVisible &&
        contentRef.current &&
        !contentRef.current.contains(e.target as Node)
      ) {
        onHide();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, onHide]);

  // Handle swipe down to close on mobile
  useEffect(() => {
    if (!isMobile || !contentRef.current) return;

    let startY = 0;
    let currentY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      if (diff > 0 && contentRef.current) {
        contentRef.current.style.transform = `translateY(${diff}px)`;
      }
    };

    const handleTouchEnd = () => {
      if (currentY - startY > 50) {
        onHide();
      }

      if (contentRef.current) {
        contentRef.current.style.transform = "";
      }
    };

    const element = contentRef.current;
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchmove", handleTouchMove);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isVisible, onHide]);

  // Fixed touch handling to prevent page refresh
  useEffect(() => {
    if (!isMobile || !headerRef.current) return;

    let startY = 0;
    let currentY = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      // Only handle touches starting on the header/handle
      if (e.target && headerRef.current?.contains(e.target as Node)) {
        startY = e.touches[0].clientY;
        isDragging = true;
        // Prevent default to avoid page scrolling/refreshing
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;

      currentY = e.touches[0].clientY;
      const diff = currentY - startY;

      // Only move down, not up
      if (diff > 0 && contentRef.current) {
        contentRef.current.style.transform = `translateY(${diff}px)`;
        // Prevent default to avoid page scrolling/refreshing
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isDragging) return;

      isDragging = false;
      if (currentY - startY > 50) {
        onHide();
      }

      if (contentRef.current) {
        contentRef.current.style.transform = "";
      }

      // Prevent default for this event too
      e.preventDefault();
    };

    // Add passive: false to tell browser we'll call preventDefault()
    const header = headerRef.current;
    header.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      header.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, isVisible, onHide]);

  // Updated menu items with personal portfolio links - Mark Maher Eweida (marco5dev)
  const menuItems = [
    { icon: "pi pi-link", text: "marco5dev.me", href: "https://marco5dev.me" },
    {
      icon: "pi pi-refresh",
      text: "Projects",
      href: "https://marco5dev.me/projects",
    },
    {
      icon: "pi pi-github",
      text: "GitHub",
      href: "https://github.com/marco5dev",
    },
    {
      icon: "pi pi-comments",
      text: "Contact Me",
      href: "https://marco5dev.me/#contact",
    },
  ];

  if (isMobile) {
    // Mobile view (modal from bottom)
    return (
      <>
        {/* Overlay background */}
        <div
          className={`more-options-overlay ${isVisible ? "visible" : ""}`}
          onClick={onHide}
        />

        {/* Modal content */}
        <div
          ref={contentRef}
          className={`more-options-modal ${isVisible ? "visible" : ""} ${
            !isWhiteMode ? "dark-mode" : ""
          }`}
        >
          <div className="more-options-header" ref={headerRef}>
            <div className="pull-indicator" />
          </div>

          <div className="more-options-content">
            {menuItems.map((item, index) => (
              <a key={index} href={item.href} className="more-options-item">
                <i className={`${item.icon} icon`}></i>
                <span className="text">{item.text}</span>
              </a>
            ))}
          </div>
        </div>
      </>
    );
  }

  // Desktop view (dropdown)
  return (
    <>
      {isVisible && (
        <div
          className="more-options-overlay"
          onClick={onHide}
          style={{ backgroundColor: "transparent" }}
        />
      )}
      <div
        ref={contentRef}
        className={`more-options-dropdown ${isVisible ? "visible" : ""} ${
          !isWhiteMode ? "dark-mode" : ""
        }`}
      >
        {menuItems.map((item, index) => (
          <a key={index} href={item.href} className="more-options-item">
            <i className={`${item.icon} icon`}></i>
            <span className="text">{item.text}</span>
          </a>
        ))}
      </div>
    </>
  );
}
