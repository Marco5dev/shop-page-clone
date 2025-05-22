import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import "../styles/FilterModal.css";

interface FilterModalProps {
  visible: boolean;
  onHide: () => void;
  isWhiteMode: boolean;
  initialFilters: {
    sort: string;
    priceRange: { min: number; max: number };
    onSale: boolean;
    inStock: boolean;
    featuredCollection: string;
  };
  onApplyFilters: (filters: {
    sort: string;
    priceRange: { min: number; max: number };
    onSale: boolean;
    inStock: boolean;
    featuredCollection: string;
  }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onHide,
  isWhiteMode,
  initialFilters,
  onApplyFilters,
}) => {
  const [sortOption, setSortOption] = useState(initialFilters.sort);
  const [priceRange, setPriceRange] = useState(initialFilters.priceRange);
  const [onSale, setOnSale] = useState(initialFilters.onSale);
  const [inStock, setInStock] = useState(initialFilters.inStock);
  const [featuredCollection, setFeaturedCollection] = useState(initialFilters.featuredCollection);

  const [tempPriceRange, setTempPriceRange] = useState({
    min: priceRange.min,
    max: priceRange.max,
  });

  const isUpdatingRef = useRef(false);
  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);

  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLDivElement>(null);
  const rightThumbRef = useRef<HTMLDivElement>(null);
  const filledTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      setTempPriceRange({
        min: initialFilters.priceRange.min,
        max: initialFilters.priceRange.max,
      });
      setPriceRange(initialFilters.priceRange);
      setSortOption(initialFilters.sort);
      setOnSale(initialFilters.onSale);
      setInStock(initialFilters.inStock);
      setFeaturedCollection(initialFilters.featuredCollection);
    }
  }, [visible, initialFilters]);

  // Disable body scrolling when modal is open
  useEffect(() => {
    if (visible) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      
      // Disable scrolling on body
      document.body.style.overflow = 'hidden';
      
      // Add padding to prevent layout shift when scrollbar disappears
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      return () => {
        // Restore original styles when modal closes
        document.body.style.overflow = originalStyle;
        document.body.style.paddingRight = '';
      };
    }
  }, [visible]);

  const resetFilters = () => {
    setSortOption("Best selling");
    setPriceRange({ min: 0, max: 250 });
    setTempPriceRange({ min: 0, max: 250 });
    setOnSale(false);
    setInStock(false);
    setFeaturedCollection("Best-Sellers");

    requestAnimationFrame(updateSliderUI);
  };

  const applyFilters = () => {
    const finalFilters = {
      sort: sortOption,
      priceRange: tempPriceRange,
      onSale,
      inStock,
      featuredCollection,
    };

    setPriceRange(tempPriceRange);

    onApplyFilters(finalFilters);
    onHide();
  };

  const updateSliderUI = useCallback(() => {
    if (!leftThumbRef.current || !rightThumbRef.current || !filledTrackRef.current) return;

    const minPrice = 0;
    const maxPrice = 250;
    const range = maxPrice - minPrice;

    const leftPos = ((tempPriceRange.min - minPrice) / range) * 100;
    const rightPos = ((tempPriceRange.max - minPrice) / range) * 100;

    leftThumbRef.current.style.left = `${leftPos}%`;
    rightThumbRef.current.style.left = `${rightPos}%`;
    filledTrackRef.current.style.left = `${leftPos}%`;
    filledTrackRef.current.style.right = `${100 - rightPos}%`;
  }, [tempPriceRange]);

  useEffect(() => {
    if (visible && !isUpdatingRef.current) {
      updateSliderUI();
    }
  }, [tempPriceRange, visible, updateSliderUI]);

  const calculatePriceFromPosition = useCallback((position: number, trackWidth: number) => {
    const percentage = Math.max(0, Math.min(1, position / trackWidth));
    return Math.round(percentage * 250);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: MouseEvent) => {
      if (!sliderTrackRef.current) return;

      isUpdatingRef.current = true;
      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const trackWidth = trackRect.width;
      const relativeX = Math.max(0, Math.min(trackWidth, e.clientX - trackRect.left));
      const newPrice = calculatePriceFromPosition(relativeX, trackWidth);

      if (isDragging === "left") {
        setTempPriceRange((prev) => ({
          ...prev,
          min: Math.min(newPrice, prev.max - 5),
        }));
      } else {
        setTempPriceRange((prev) => ({
          ...prev,
          max: Math.max(newPrice, prev.min + 5),
        }));
      }

      requestAnimationFrame(updateSliderUI);
      isUpdatingRef.current = false;
    };

    const handlePointerUp = () => {
      isUpdatingRef.current = false;
      setIsDragging(null);
    };

    document.addEventListener("mousemove", handlePointerMove);
    document.addEventListener("mouseup", handlePointerUp);

    return () => {
      document.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseup", handlePointerUp);
    };
  }, [isDragging, calculatePriceFromPosition, updateSliderUI]);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!sliderTrackRef.current) return;

      isUpdatingRef.current = true;
      const touch = e.touches[0];
      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const relativeX = Math.max(0, Math.min(trackRect.width, touch.clientX - trackRect.left));
      const newPrice = calculatePriceFromPosition(relativeX, trackRect.width);

      if (isDragging === "left") {
        setTempPriceRange((prev) => ({
          ...prev,
          min: Math.min(newPrice, prev.max - 5),
        }));
      } else {
        setTempPriceRange((prev) => ({
          ...prev,
          max: Math.max(newPrice, prev.min + 5),
        }));
      }

      requestAnimationFrame(updateSliderUI);
      isUpdatingRef.current = false;
    };

    const handleTouchEnd = () => {
      isUpdatingRef.current = false;
      setIsDragging(null);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, calculatePriceFromPosition, updateSliderUI]);

  const handleSliderClick = (e: React.MouseEvent) => {
    if (isDragging || !sliderTrackRef.current) return;

    const rect = sliderTrackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const trackWidth = rect.width;
    const clickedValue = calculatePriceFromPosition(clickX, trackWidth);

    const distToMin = Math.abs(clickedValue - tempPriceRange.min);
    const distToMax = Math.abs(clickedValue - tempPriceRange.max);

    isUpdatingRef.current = true;
    if (distToMin <= distToMax) {
      setTempPriceRange((prev) => ({
        ...prev,
        min: Math.min(clickedValue, prev.max - 5),
      }));
    } else {
      setTempPriceRange((prev) => ({
        ...prev,
        max: Math.max(clickedValue, prev.min + 5),
      }));
    }
    isUpdatingRef.current = false;
  };

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      dismissableMask
      header="Filters"
      className={`filter-modal ${isWhiteMode ? "light-mode" : "dark-mode"} ${
        visible ? "slide-in-bottom" : "slide-out-bottom"
      }`}
      contentStyle={{
        padding: "0",
        overflow: "auto",
        borderRadius: "0 0 20px 20px",
      }}
      headerStyle={{
        padding: "1rem 1.5rem",
        background: "#fff",
        color: "#000",
        borderBottom: "none",
        borderRadius: "20px 20px 0 0",
      }}
      style={{
        width: "92%",
        maxWidth: "400px",
        margin: "auto",
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        borderRadius: "20px",
      }}
      transitionOptions={{
        timeout: 300,
      }}
    >
      <div className="filter-sections">
        <div className="filter-section">
          <div className="section-header">
            <h3 className="section-title">Sort by</h3>
          </div>
          <div className="options-list">
            <div
              className="option-item"
              onClick={() => setSortOption("Best selling")}
            >
              <span>Best selling</span>
              <div className="radio-circle">
                {sortOption === "Best selling" && (
                  <div className="radio-selected"></div>
                )}
              </div>
            </div>
            <div
              className="option-item"
              onClick={() => setSortOption("Newest")}
            >
              <span>Newest</span>
              <div className="radio-circle">
                {sortOption === "Newest" && (
                  <div className="radio-selected"></div>
                )}
              </div>
            </div>
            <div
              className="option-item"
              onClick={() => setSortOption("Price: Low - High")}
            >
              <span>Price: Low - High</span>
              <div className="radio-circle">
                {sortOption === "Price: Low - High" && (
                  <div className="radio-selected"></div>
                )}
              </div>
            </div>
            <div
              className="option-item"
              onClick={() => setSortOption("Price: High - Low")}
            >
              <span>Price: High - Low</span>
              <div className="radio-circle">
                {sortOption === "Price: High - Low" && (
                  <div className="radio-selected"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="section-header">
            <h3 className="section-title">Featured Collections</h3>
          </div>
          <div className="options-list">
            <div
              className="option-item"
              onClick={() => setFeaturedCollection("Best-Sellers")}
            >
              <span>Best-Sellers</span>
              <div className="radio-circle">
                {featuredCollection === "Best-Sellers" && (
                  <div className="radio-selected"></div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="options-list">
            <div className="option-item" onClick={() => setOnSale(!onSale)}>
              <span>On sale</span>
              <Checkbox
                checked={onSale}
                onChange={() => setOnSale(!onSale)}
                className="custom-checkbox"
              />
            </div>
          </div>
        </div>

        <div className="filter-section">
          <div className="section-header">
            <h3 className="section-title">Price</h3>
            <button className="toggle-button">
              <span className="clear-button" onClick={resetFilters}>
                Clear
              </span>
            </button>
          </div>

          <div className="price-slider-container">
            <div
              className="price-slider"
              ref={sliderTrackRef}
              onClick={handleSliderClick}
            >
              <div className="slider-track"></div>
              <div className="slider-track-filled" ref={filledTrackRef}></div>
              <div
                className="slider-thumb left"
                ref={leftThumbRef}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging("left");
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDragging("left");
                }}
                style={{
                  touchAction: "none",
                  left: `${(tempPriceRange.min / 250) * 100}%`,
                }}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={250}
                aria-valuenow={tempPriceRange.min}
              ></div>
              <div
                className="slider-thumb right"
                ref={rightThumbRef}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging("right");
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  setIsDragging("right");
                }}
                style={{
                  touchAction: "none",
                  left: `${(tempPriceRange.max / 250) * 100}%`,
                }}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={250}
                aria-valuenow={tempPriceRange.max}
              ></div>
            </div>

            <div className="price-inputs-container">
              <input
                type="text"
                className="price-input"
                value={tempPriceRange.min}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setTempPriceRange((prev) => ({
                    ...prev,
                    min: Math.min(value, prev.max - 5),
                  }));
                }}
              />
              <span className="price-range-divider">-</span>
              <input
                type="text"
                className="price-input"
                value={tempPriceRange.max}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setTempPriceRange((prev) => ({
                    ...prev,
                    max: Math.max(value, prev.min + 5),
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="filter-modal-footer">
        <button className="reset-button" onClick={resetFilters}>
          Reset
        </button>
        <button className="done-button" onClick={applyFilters}>
          Done
        </button>
      </div>
    </Dialog>
  );
};

export default FilterModal;
