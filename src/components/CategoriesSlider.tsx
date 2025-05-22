import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import FilterModal from "./FilterModal";

interface Category {
  id: number;
  name: string;
  link: string;
}

interface FilterOptions {
  sort: string;
  priceRange: { min: number; max: number };
  onSale: boolean;
  inStock: boolean;
  featuredCollection: string;
}

interface CategoriesSliderProps {
  categories: Category[];
  activeCategory: string;
  isWhiteMode?: boolean;
  onCategoryChange: (category: string) => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export default function CategoriesSlider({
  categories,
  activeCategory,
  isWhiteMode = false,
  onCategoryChange,
  onApplyFilters,
  currentFilters,
}: CategoriesSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleFilterButtonClick = () => {
    if (isMobile) {
      setFilterModalVisible(true);
    }
  };

  const checkArrowVisibility = () => {
    if (!sliderRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;

    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("scroll", checkArrowVisibility);
      checkArrowVisibility();
      window.addEventListener("resize", checkArrowVisibility);

      return () => {
        slider.removeEventListener("scroll", checkArrowVisibility);
        window.removeEventListener("resize", checkArrowVisibility);
      };
    }
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (sliderRef.current) {
      const activeEl = sliderRef.current.querySelector(
        `.category-item[data-category="${activeCategory}"]`
      ) as HTMLElement;

      if (activeEl) {
        const containerWidth = sliderRef.current.offsetWidth;
        const elemLeft = activeEl.offsetLeft;
        const elemWidth = activeEl.offsetWidth;
        const scrollPos = elemLeft - containerWidth / 2 + elemWidth / 2;

        sliderRef.current.scrollTo({
          left: Math.max(0, scrollPos),
          behavior: "smooth",
        });
      }
    }
  }, [activeCategory]);

  return (
    <div
      className="categories-slider-container relative w-full"
      style={{ maxWidth: "1200px" }}
    >
      {showLeftArrow && (
        <Button
          icon="pi pi-chevron-left"
          className="lg:flex hidden categories-arrow categories-arrow-left p-button-rounded p-button-text"
          onClick={scrollLeft}
          style={{
            position: "absolute",
            left: "0px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            backgroundColor: isWhiteMode
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.1)",
            color: isWhiteMode ? "#333" : "rgba(255, 255, 255, 0.8)",
            width: "36px",
            height: "36px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          size="small"
        />
      )}

      <div
        ref={sliderRef}
        className="categories-slider overflow-auto flex no-scrollbar gap-5"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          paddingLeft: "10px",
          paddingRight: "10px",
          position: "relative",
          maskImage:
            "linear-gradient(to right, transparent, white 80px, white calc(100% - 80px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, white 80px, white calc(100% - 80px), transparent)",
        }}
      >
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            data-category={category.name}
            className={`category-item flex-shrink-0 text-center no-underline`}
            style={{
              whiteSpace: "nowrap",
              transition: "opacity 0.3s ease, font-weight 0.2s ease",
              color: isWhiteMode ? "#333" : "#fff",
              opacity: activeCategory === category.name ? 1 : 0.5,
              fontWeight: activeCategory === category.name ? 600 : 400,
            }}
            onClick={(e) => {
              e.preventDefault();
              onCategoryChange(category.name);
            }}
            onMouseEnter={(e) => {
              if (activeCategory !== category.name) {
                e.currentTarget.style.opacity = "1";
              }
            }}
            onMouseLeave={(e) => {
              if (activeCategory !== category.name) {
                e.currentTarget.style.opacity = "0.5";
              }
            }}
          >
            {category.name}
          </a>
        ))}
      </div>

      {isMobile && (
        <button
          className="filter-button border-circle align-items-center md:hidden flex justify-content-center hoverBackgroundButton transition-colors duration-300 user-select-none"
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            border: `0.5px solid ${
              isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            width: "32px",
            height: "32px",
            color: isWhiteMode ? "black" : "white",
            backgroundColor: isWhiteMode
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.1)",
            zIndex: 5,
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          }}
          aria-label="Filter options"
          onClick={handleFilterButtonClick}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-text"
            data-testid="icon-filter"
            stroke="none"
            style={{
              width: "16px",
              height: "16px",
            }}
          >
            <path
              d="M10 17L20 17M10 17C10 18.6575 8.6575 20 7 20C5.3425 20 4 18.6575 4 17C4 15.3425 5.3425 14 7 14C8.6575 14 10 15.3425 10 17ZM4 7L12 7M12 7C12 5.3425 13.3425 4 15 4C16.6575 4 18 5.3425 18 7M12 7C12 8.6575 13.3425 10 15 10C16.6575 10 18 8.6575 18 7M18 7L20 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </button>
      )}

      {isMobile && (
        <FilterModal
          visible={filterModalVisible}
          onHide={() => setFilterModalVisible(false)}
          isWhiteMode={isWhiteMode}
          initialFilters={currentFilters}
          onApplyFilters={onApplyFilters}
        />
      )}

      {showRightArrow && (
        <Button
          icon="pi pi-chevron-right"
          className="lg:flex hidden categories-arrow categories-arrow-right p-button-rounded p-button-text"
          onClick={scrollRight}
          style={{
            position: "absolute",
            right: "0px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 5,
            backgroundColor: isWhiteMode
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.1)",
            color: isWhiteMode ? "#333" : "rgba(255, 255, 255, 0.8)",
            width: "36px",
            height: "36px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          size="small"
        />
      )}
    </div>
  );
}
