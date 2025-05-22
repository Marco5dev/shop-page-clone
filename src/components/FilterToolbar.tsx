import "@/styles/Header.css";
import "@/styles/FilterToolbar.css";
import { useEffect, useState, useRef, useCallback } from "react";

interface ProductData {
  id: number;
  title: string;
  image: string;
  link: string;
  price: string;
  salePrice?: string;
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
  inStock: boolean;
  dateAdded: string;
  categories: string[]; // Add categories field to match data.ts
}

interface FilterToolbarProps {
  products: ProductData[];
  onFilterChange: (filteredProducts: ProductData[]) => void;
  isWhiteMode: boolean;
  filteredCount?: number;
  setIsLoading: (isLoading: boolean) => void;
  activeCategory?: string; // Add activeCategory prop
}

export default function FilterToolbar({
  products,
  onFilterChange,
  isWhiteMode,
  filteredCount,
  setIsLoading,
  activeCategory = "All", // Default to "All"
}: FilterToolbarProps) {
  const [activeButtons, setActiveButtons] = useState<{
    [key: string]: boolean;
  }>({
    onSale: false,
    inStock: false,
  });
  const [sortOption, setSortOption] = useState("Best selling");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 250 });

  const [tempSortOption, setTempSortOption] = useState(sortOption);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [applyFilters, setApplyFilters] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const sortBtnRef = useRef<HTMLButtonElement>(null);
  const featuredBtnRef = useRef<HTMLButtonElement>(null);
  const priceBtnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const leftThumbRef = useRef<HTMLDivElement>(null);
  const rightThumbRef = useRef<HTMLDivElement>(null);
  const filledTrackRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState<"left" | "right" | null>(null);

  const sliderInitialized = useRef(false);

  const [hasActiveFilters, setHasActiveFilters] = useState({
    sort: false,
    price: false,
    featured: false,
  });

  const [productCount, setProductCount] = useState(products.length);

  const [featuredCollection, setFeaturedCollection] =
    useState<string>("Best-Sellers");
  const [tempFeaturedCollection, setTempFeaturedCollection] =
    useState<string>(featuredCollection);

  const previousDropdownRef = useRef<string | null>(null);

  const initialRenderRef = useRef(true);

  // Add a ref to track when activeCategory changes
  const prevCategoryRef = useRef<string>(activeCategory);

  const calculatePriceFromPosition = useCallback(
    (position: number, trackWidth: number) => {
      const maxPrice = 250;
      const minPrice = 0;
      const range = maxPrice - minPrice;

      const percentage = Math.max(0, Math.min(1, position / trackWidth));
      return Math.round(minPrice + percentage * range);
    },
    []
  );

  useEffect(() => {
    setHasActiveFilters({
      sort: sortOption !== "Best selling",
      price: priceRange.min > 0 || priceRange.max < 250,
      featured: featuredCollection !== "Best-Sellers",
    });
  }, [sortOption, priceRange, featuredCollection]);

  const updateSliderUI = useCallback(() => {
    if (
      !sliderTrackRef.current ||
      !leftThumbRef.current ||
      !rightThumbRef.current ||
      !filledTrackRef.current
    )
      return;

    const minPrice = 0;
    const maxPrice = 250;
    const range = maxPrice - minPrice;

    const leftPos = ((tempPriceRange.min - minPrice) / range) * 100;
    const rightPos = ((tempPriceRange.max - minPrice) / range) * 100;

    leftThumbRef.current.style.left = `${leftPos}%`;
    rightThumbRef.current.style.left = `${rightPos}%`;
    filledTrackRef.current.style.left = `${leftPos}%`;
    filledTrackRef.current.style.right = `${100 - rightPos}%`;
  }, [tempPriceRange.min, tempPriceRange.max]);

  useEffect(() => {
    if (previousDropdownRef.current === openDropdown) return;

    previousDropdownRef.current = openDropdown;

    if (openDropdown === "price") {
      setTempPriceRange({
        min: priceRange.min,
        max: priceRange.max,
      });

      setTimeout(() => {
        sliderInitialized.current = true;
        updateSliderUI();
      }, 50);
    } else {
      sliderInitialized.current = false;
    }
  }, [openDropdown, priceRange.min, priceRange.max, updateSliderUI]);

  useEffect(() => {
    if (openDropdown === "price" && sliderInitialized.current) {
      updateSliderUI();
    }
  }, [openDropdown, updateSliderUI]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sliderTrackRef.current) return;

      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const trackWidth = trackRect.width;
      const relativeX = Math.max(
        0,
        Math.min(trackWidth, e.clientX - trackRect.left)
      );

      const newPrice = calculatePriceFromPosition(relativeX, trackWidth);

      if (isDragging === "left") {
        setTempPriceRange((prev) => ({
          min: Math.min(newPrice, prev.max - 5),
          max: prev.max,
        }));
      } else {
        setTempPriceRange((prev) => ({
          min: prev.min,
          max: Math.max(newPrice, prev.min + 5),
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, calculatePriceFromPosition]);

  useEffect(() => {
    const leftThumb = leftThumbRef.current;
    const rightThumb = rightThumbRef.current;

    if (!leftThumb || !rightThumb) return;

    const handleLeftThumbTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging("left");
    };

    const handleRightThumbTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      setIsDragging("right");
    };

    leftThumb.addEventListener("touchstart", handleLeftThumbTouchStart, {
      passive: false,
    });
    rightThumb.addEventListener("touchstart", handleRightThumbTouchStart, {
      passive: false,
    });

    return () => {
      leftThumb.removeEventListener("touchstart", handleLeftThumbTouchStart);
      rightThumb.removeEventListener("touchstart", handleRightThumbTouchStart);
    };
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!sliderTrackRef.current) return;

      e.preventDefault();
      const touch = e.touches[0];
      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const relativeX = Math.max(
        0,
        Math.min(trackRect.width, touch.clientX - trackRect.left)
      );

      const newPrice = calculatePriceFromPosition(relativeX, trackRect.width);

      if (isDragging === "left") {
        setTempPriceRange((prev) => ({
          min: Math.min(newPrice, prev.max - 5),
          max: prev.max,
        }));
      } else {
        setTempPriceRange((prev) => ({
          min: prev.min,
          max: Math.max(newPrice, prev.min + 5),
        }));
      }
    };

    const handleTouchEnd = () => {
      setIsDragging(null);
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, calculatePriceFromPosition]);

  const extractPriceValue = (priceStr: string): number => {
    const match = priceStr.match(/(\d+\.\d+|\d+)/);
    return match ? parseFloat(match[0]) : 0;
  };

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;

      setApplyFilters(true);
    }
  }, []);

  // Add effect to filter when category changes
  useEffect(() => {
    if (prevCategoryRef.current !== activeCategory) {
      prevCategoryRef.current = activeCategory;
      setApplyFilters(true);
    }
  }, [activeCategory]);

  useEffect(() => {
    if (!applyFilters) return;

    // Set loading state to true when filtering starts
    setIsLoading(true);

    // Simulate network delay (remove this in production with real API calls)
    setTimeout(() => {
      // Start with products filtered by category
      let result = [...products];

      // Apply category filter first
      if (activeCategory !== "All") {
        if (activeCategory === "SALE") {
          result = result.filter((product) => product.isOnSale);
        } else {
          // Simply filter by category now that we know it exists
          result = result.filter((product) =>
            product.categories.includes(activeCategory)
          );
        }
      }

      // Apply price filter
      result = result.filter((product) => {
        const price = extractPriceValue(product.price);
        return price >= priceRange.min && price <= priceRange.max;
      });

      // Apply other filters and sorting
      if (activeButtons.onSale) {
        result = result.filter((product) => product.isOnSale);
      }

      if (activeButtons.inStock) {
        result = result.filter((product) => product.inStock);
      }

      if (featuredCollection !== "Best-Sellers") {
        if (featuredCollection === "New Arrivals") {
          result = result
            .sort((a, b) => {
              return (
                new Date(b.dateAdded).getTime() -
                new Date(a.dateAdded).getTime()
              );
            })
            .slice(0, Math.min(50, result.length));
        } else if (featuredCollection === "Sale Items") {
          result = result.filter((product) => product.isOnSale);
        }
      }

      switch (sortOption) {
        case "Newest":
          result.sort((a, b) => {
            const dateA = new Date(a.dateAdded);
            const dateB = new Date(b.dateAdded);
            return dateB.getTime() - dateA.getTime();
          });
          break;
        case "Price: Low - High":
          result.sort((a, b) => {
            const priceA = extractPriceValue(a.salePrice || a.price);
            const priceB = extractPriceValue(b.salePrice || b.price);
            return priceA - priceB;
          });
          break;
        case "Price: High - Low":
          result.sort((a, b) => {
            const priceA = extractPriceValue(a.salePrice || a.price);
            const priceB = extractPriceValue(b.salePrice || b.price);
            return priceB - priceA;
          });
          break;
        case "Best selling":
        default:
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }

      setProductCount(result.length);
      onFilterChange(result);
      setApplyFilters(false);

      // Set loading state to false when filtering is done
      setIsLoading(false);
    }, 800); // Add a small delay to showcase the skeleton (remove in production)
  }, [
    applyFilters,
    products,
    activeButtons,
    priceRange,
    sortOption,
    featuredCollection,
    onFilterChange,
    setIsLoading,
    activeCategory,
  ]);

  useEffect(() => {
    if (filteredCount !== undefined) {
      setProductCount(filteredCount);
    }
  }, [filteredCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        const isOnButton =
          (openDropdown === "sort" &&
            sortBtnRef.current?.contains(event.target as Node)) ||
          (openDropdown === "featured" &&
            featuredBtnRef.current?.contains(event.target as Node)) ||
          (openDropdown === "price" &&
            priceBtnRef.current?.contains(event.target as Node));

        if (!isOnButton) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  const toggleButton = (buttonKey: string) => {
    setActiveButtons((prev) => {
      const newState = {
        ...prev,
        [buttonKey]: !prev[buttonKey],
      };
      setApplyFilters(true);
      return newState;
    });
  };

  const toggleDropdown = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null);
    } else {
      if (dropdown === "sort") {
        setTempSortOption(sortOption);
      } else if (dropdown === "price") {
        setTempPriceRange({
          min: priceRange.min,
          max: priceRange.max,
        });
      } else if (dropdown === "featured") {
        setTempFeaturedCollection(featuredCollection);
      }
      setOpenDropdown(dropdown);
    }
  };

  const resetFilters = () => {
    if (openDropdown === "sort") {
      setTempSortOption("Best selling");
    } else if (openDropdown === "price") {
      setTempPriceRange({ min: 0, max: 250 });
    } else if (openDropdown === "featured") {
      setTempFeaturedCollection("Best-Sellers");
    } else {
      setActiveButtons({ onSale: false, inStock: false });
      setSortOption("Best selling");
      setPriceRange({ min: 0, max: 250 });
      setFeaturedCollection("Best-Sellers");
      setApplyFilters(true);
    }
  };

  const handleApplyFilters = () => {
    if (openDropdown === "sort") {
      setSortOption(tempSortOption);
      setApplyFilters(true);
    } else if (openDropdown === "price") {
      setPriceRange({ ...tempPriceRange });
      setApplyFilters(true);
    } else if (openDropdown === "featured") {
      setFeaturedCollection(tempFeaturedCollection);
      setApplyFilters(true);
    }

    setOpenDropdown(null);
  };

  const renderPriceDropdown = () => {
    return (
      <div
        className="dropdown-content p-3"
        style={{ width: "250px", userSelect: "none" }}
      >
        <div className="price-slider my-3" ref={sliderTrackRef}>
          <div className="slider-track"></div>
          <div
            className="slider-track-filled"
            ref={filledTrackRef}
            style={{
              position: "absolute",
              height: "100%",
              left: `${(tempPriceRange.min / 250) * 100}%`,
              right: `${100 - (tempPriceRange.max / 250) * 100}%`,
            }}
          ></div>
          <div
            className="slider-thumb left"
            ref={leftThumbRef}
            onMouseDown={(e) => {
              e.preventDefault();
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

        <div className="flex justify-content-between mt-4">
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
          <span className="text-center">-</span>
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

        <div className="mt-3 flex justify-content-between">
          <button className="reset-btn" onClick={resetFilters}>
            Reset
          </button>
          <button className="done-btn" onClick={handleApplyFilters}>
            Done
          </button>
        </div>
      </div>
    );
  };

  const renderDropdown = () => {
    if (!openDropdown) return null;

    let dropdownContent;
    let anchorRef;

    switch (openDropdown) {
      case "sort":
        dropdownContent = (
          <div
            className="dropdown-content p-3"
            style={{ width: "250px", userSelect: "none" }}
          >
            <div className="filter-options">
              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempSortOption("Best selling")}
              >
                <span>Best selling</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempSortOption === "Best selling" ? "radio-selected" : ""
                    }
                  ></div>
                </div>
              </div>

              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempSortOption("Newest")}
              >
                <span>Newest</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempSortOption === "Newest" ? "radio-selected" : ""
                    }
                  ></div>
                </div>
              </div>

              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempSortOption("Price: Low - High")}
              >
                <span>Price: Low - High</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempSortOption === "Price: Low - High"
                        ? "radio-selected"
                        : ""
                    }
                  ></div>
                </div>
              </div>

              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempSortOption("Price: High - Low")}
              >
                <span>Price: High - Low</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempSortOption === "Price: High - Low"
                        ? "radio-selected"
                        : ""
                    }
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-content-between">
              <button className="reset-btn" onClick={resetFilters}>
                Reset
              </button>
              <button className="done-btn" onClick={handleApplyFilters}>
                Done
              </button>
            </div>
          </div>
        );
        anchorRef = sortBtnRef;
        break;

      case "featured":
        dropdownContent = (
          <div
            className="dropdown-content p-3"
            style={{ width: "250px", userSelect: "none" }}
          >
            <div className="filter-options">
              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempFeaturedCollection("Best-Sellers")}
              >
                <span>Best-Sellers</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempFeaturedCollection === "Best-Sellers"
                        ? "radio-selected"
                        : ""
                    }
                  ></div>
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempFeaturedCollection("New Arrivals")}
              >
                <span>New Arrivals</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempFeaturedCollection === "New Arrivals"
                        ? "radio-selected"
                        : ""
                    }
                  ></div>
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-between py-2 cursor-pointer"
                onClick={() => setTempFeaturedCollection("Sale Items")}
              >
                <span>Sale Items</span>
                <div className="radio-circle">
                  <div
                    className={
                      tempFeaturedCollection === "Sale Items"
                        ? "radio-selected"
                        : ""
                    }
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-3 flex justify-content-between">
              <button className="reset-btn" onClick={resetFilters}>
                Reset
              </button>
              <button className="done-btn" onClick={handleApplyFilters}>
                Done
              </button>
            </div>
          </div>
        );
        anchorRef = featuredBtnRef;
        break;

      case "price":
        dropdownContent = renderPriceDropdown();
        anchorRef = priceBtnRef;
        break;

      default:
        return null;
    }

    const rect = anchorRef?.current?.getBoundingClientRect();

    if (!rect) return null;

    const buttonWidth = rect.width;
    const dropdownWidth = 250;
    const leftOffset = rect.left - (dropdownWidth - buttonWidth) / 2;

    return (
      <div
        ref={dropdownRef}
        className="dropdown-overlay"
        style={{
          position: "fixed",
          top: `${rect.bottom}px`,
          left: `${Math.max(10, leftOffset)}px`,
          zIndex: 1050,
          marginTop: "4px",
        }}
      >
        {dropdownContent}
      </div>
    );
  };

  return (
    <>
      <div
        className="lg:flex hidden w-full gap-2 justify-items-start position-relative"
        style={{ maxWidth: "1200px" }}
      >
        

        <button
          ref={sortBtnRef}
          className={`${
            openDropdown === "sort"
              ? isWhiteMode
                ? "bg-black-alpha-90 text-white"
                : "bg-white text-black"
              : hasActiveFilters.sort
              ? isWhiteMode
                ? "bg-black-alpha-90 text-white"
                : "bg-white text-black"
              : isWhiteMode
              ? "bg-black-alpha-90 text-white"
              : "bg-white text-black"
          } transition-colors duration-300 flex align-items-center justify-content-center gap-2 user-select-none`}
          style={{
            borderRadius: "8px",
            padding: " 0.25rem 0.8rem",
          }}
          onClick={() => toggleDropdown("sort")}
        >
          <p>{sortOption !== "Best selling" ? sortOption : "Sort by"}</p>
          <i
            className={`pi ${
              openDropdown === "sort" ? "pi-angle-up" : "pi-angle-down"
            }`}
          ></i>
        </button>

        <button
          ref={featuredBtnRef}
          className={`${
            openDropdown === "featured" || hasActiveFilters.featured
              ? isWhiteMode
                ? "bg-black text-white"
                : "bg-white text-black"
              : isWhiteMode
              ? "text-black"
              : "text-white"
          } px-3 py-1 flex align-items-center justify-content-center gap-2 hoverBackgroundButton transition-colors duration-300 user-select-none`}
          style={{
            border: `0.5px solid ${
              isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            borderRadius: "8px",
            backgroundColor:
              openDropdown === "featured" || hasActiveFilters.featured
                ? isWhiteMode
                  ? "black"
                  : "white"
                : "",
          }}
          onClick={() => toggleDropdown("featured")}
        >
          <p>
            {hasActiveFilters.featured
              ? featuredCollection
              : "Featured Collections"}
          </p>
          <i
            className={`pi ${
              openDropdown === "featured" ? "pi-angle-up" : "pi-angle-down"
            }`}
          ></i>
        </button>

        <button
          className={`${
            activeButtons.onSale
              ? isWhiteMode
                ? "bg-black text-white"
                : "bg-white text-black"
              : isWhiteMode
              ? "text-black"
              : "text-white"
          } px-3 py-1 hoverBackgroundButton transition-colors duration-300 user-select-none`}
          onClick={() => toggleButton("onSale")}
          style={{
            border: `0.5px solid ${
              isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            borderRadius: "8px",
            backgroundColor: activeButtons.onSale
              ? isWhiteMode
                ? "black"
                : "white"
              : "",
            fontWeight: activeButtons.onSale ? "bold" : "normal",
          }}
        >
          On sale {activeButtons.onSale ? "✓" : ""}
        </button>

        <button
          ref={priceBtnRef}
          className={`${
            openDropdown === "price" || hasActiveFilters.price
              ? isWhiteMode
                ? "bg-black text-white"
                : "bg-white text-black"
              : isWhiteMode
              ? "text-black"
              : "text-white"
          } px-3 py-1 flex align-items-center justify-content-center gap-2 hoverBackgroundButton transition-colors duration-300 user-select-none`}
          style={{
            border: `0.5px solid ${
              isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            borderRadius: "8px",
            backgroundColor:
              openDropdown === "price" || hasActiveFilters.price
                ? isWhiteMode
                  ? "black"
                  : "white"
                : "",
          }}
          onClick={() => toggleDropdown("price")}
        >
          <p>
            {hasActiveFilters.price
              ? `$${priceRange.min} - $${priceRange.max}`
              : "Price"}
          </p>
          <i
            className={`pi ${
              openDropdown === "price" ? "pi-angle-up" : "pi-angle-down"
            }`}
          ></i>
        </button>

        <button
          className={`${
            activeButtons.inStock
              ? isWhiteMode
                ? "bg-black text-white"
                : "bg-white text-black"
              : isWhiteMode
              ? "text-black"
              : "text-white"
          } px-3 py-1 hoverBackgroundButton transition-colors duration-300 user-select-none`}
          onClick={() => toggleButton("inStock")}
          style={{
            border: `0.5px solid ${
              isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
            }`,
            borderRadius: "8px",
            backgroundColor: activeButtons.inStock
              ? isWhiteMode
                ? "black"
                : "white"
              : "",
            fontWeight: activeButtons.inStock ? "bold" : "normal",
          }}
        >
          In-stock {activeButtons.inStock ? "✓" : ""}
        </button>

        <p
          className={`${
            isWhiteMode ? "text-black" : "text-white"
          } p-1 opacity-50 text-sm user-select-none`}
        >
          {productCount} products
        </p>
      </div>

      {renderDropdown()}
    </>
  );
}
