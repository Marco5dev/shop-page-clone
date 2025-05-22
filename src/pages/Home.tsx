/**
 * Home component - Main page of the application
 * This is a clone/concept build of shop.app for front-end testing purposes
 * Created by Mark Maher Eweida (marco5dev)
 * 
 * This project demonstrates front-end implementation skills including:
 * - Responsive design
 * - Component architecture
 * - State management
 * - Animations and transitions
 */
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/Home.css";
import mainLogo from "../assets/MAINLOGO.avif";
import bgImage from "../assets/background.png";
import mostSallersImage from "../assets/most-sales.png";
import { useEffect, useState, useRef } from "react";
import Input from "@/components/Input";
import CategoriesSlider from "@/components/CategoriesSlider";
import FilterToolbar from "@/components/FilterToolbar";
import ProductCard from "@/components/ProductCard";
import SkeletonCard from "@/components/SkeletonCard";
import ReviewCard from "@/components/ReviewCard";
import ReviewsModal from "@/components/ReviewsModal";
import MoreOptionsMenu from "@/components/MoreOptionsMenu";
import SearchModal from "@/components/SearchModal";
import { productData } from "./data.ts";
import rateProductImage from "../assets/product.png";

// Define the interface for card data
interface CardData {
  id: number;
  title: string;
  image: string;
  link: string;
}

interface ProductDataTypes {
  id: number;
  title: string;
  image: string;
  link: string;
  price: string;
  salePrice?: string;
  rating: number;
  reviewCount: number;
  isOnSale: boolean;
  inStock: boolean; // Add inStock property
  dateAdded: string; // Added dateAdded field
}

interface FilterOptions {
  sort: string;
  priceRange: { min: number; max: number };
  onSale: boolean;
  inStock: boolean;
  featuredCollection: string;
}

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isWhiteMode, setIsWhiteMode] = useState(false);
  const heroSectionRef = useRef<HTMLElement>(null);

  // State for filtered products
  const [filteredProducts, setFilteredProducts] =
    useState<ProductDataTypes[]>(productData);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24); // Changed from 8 to 30 (5 columns × 6 rows)

  // Add loading state
  const [isLoading, setIsLoading] = useState(true);

  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Add state for the reviews modal
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  // Add state for filter settings
  const [filterSettings, setFilterSettings] = useState({
    sort: "Best selling",
    priceRange: { min: 0, max: 250 },
    onSale: false,
    inStock: false,
    featuredCollection: "Best-Sellers",
  });

  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const moreOptionsButtonRef = useRef<HTMLButtonElement>(null);

  const [showSearchModal, setShowSearchModal] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768); // md breakpoint
    };

    checkMobileView();
    window.addEventListener("resize", checkMobileView);
    return () => window.removeEventListener("resize", checkMobileView);
  }, []);

  // Add handler for category change
  const handleCategoryChange = (category: string) => {
    setIsLoading(true);
    setSelectedCategory(category);
  };

  // Handler for applying filters from FilterModal
  const handleApplyFilters = (filters: FilterOptions) => {
    setFilterSettings(filters);
    setIsLoading(true);

    // Apply the filters to the products
    setTimeout(() => {
      let result = [...productData];

      // Apply category filter
      if (selectedCategory !== "All") {
        if (selectedCategory === "SALE") {
          result = result.filter((product) => product.isOnSale);
        } else {
          result = result.filter((product) =>
            "categories" in product
              ? product.categories.includes(selectedCategory)
              : true
          );
        }
      }

      // Apply price filter
      result = result.filter((product) => {
        const price = extractPriceValue(product.price);
        return (
          price >= filters.priceRange.min && price <= filters.priceRange.max
        );
      });

      // Apply other filters
      if (filters.onSale) {
        result = result.filter((product) => product.isOnSale);
      }

      if (filters.inStock) {
        result = result.filter((product) => product.inStock);
      }

      // Apply featured collection filter
      if (filters.featuredCollection !== "Best-Sellers") {
        if (filters.featuredCollection === "New Arrivals") {
          result = result
            .sort((a, b) => {
              return (
                new Date(b.dateAdded).getTime() -
                new Date(a.dateAdded).getTime()
              );
            })
            .slice(0, 50);
        } else if (filters.featuredCollection === "Sale Items") {
          result = result.filter((product) => product.isOnSale);
        }
      }

      // Apply sorting
      switch (filters.sort) {
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

      setFilteredProducts(result);
      setIsLoading(false);
    }, 800);
  };

  // Helper function to extract price value
  const extractPriceValue = (priceStr: string): number => {
    const match = priceStr.match(/(\d+\.\d+|\d+)/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  // Add useEffect to initialize data
  useEffect(() => {
    // Simulate initial data loading
    setIsLoading(true);
    setTimeout(() => {
      // Pre-sort data by "Best selling" (review count) before setting it
      const sortedData = [...productData].sort(
        (a, b) => b.reviewCount - a.reviewCount
      );

      // Initial filtering ensures categories work from the start
      let initialData = sortedData;
      if (selectedCategory !== "All") {
        if (selectedCategory === "SALE") {
          initialData = initialData.filter((product) => product.isOnSale);
        } else {
          initialData = initialData.filter((product) =>
            "categories" in product
              ? product.categories.includes(selectedCategory)
              : true
          );
        }
      }

      setFilteredProducts(initialData);
      setIsLoading(false);
    }, 800); // Add a small delay to showcase the skeleton (remove in production)
  }, [selectedCategory]);

  // Sample data for best sellers cards
  const bestSellersData: CardData[] = [
    {
      id: 1,
      title: "Best Sellers",
      image: mostSallersImage,
      link: "/best-sellers",
    },
    {
      id: 2, // Changed from 1 to 2 to make it unique
      title: "Best Sellers",
      image: mostSallersImage,
      link: "/best-sellers",
    },
    // Add more cards as needed
  ];

  const searchSuggestions = [
    "Summer Collection 2023",
    "Winter Sale Items",
    "New Arrivals",
  ];

  const searchPlaceholders = "Search for Little Trouble...";

  const handleSelect = (item: string) => {
    console.log(`Selected: ${item}`);
    // Handle selected item (e.g., navigate to search results, etc.)
  };

  // Categories data for the slider
  const categories = [
    { id: 1, name: "All", link: "#all" },
    { id: 2, name: "Joggers", link: "#joggers" },
    { id: 3, name: "t-shirts", link: "#tshirts" },
    { id: 4, name: "Jackets", link: "#jackets" },
    { id: 5, name: "Sweatshirts", link: "#sweatshirts" },
    { id: 6, name: "SWIM", link: "#swim" },
    { id: 7, name: "Adults", link: "#adults" },
    { id: 8, name: "Best-Sellers", link: "#best-sellers" },
    { id: 9, name: "BABY", link: "#baby" },
    { id: 10, name: "Sweet Dreams Shop", link: "#sweet-dreams" },
    { id: 11, name: "Shorts", link: "#shorts" },
    { id: 12, name: "Mom Stuff", link: "#mom" },
    { id: 13, name: "SALE", link: "#sale" },
  ];

  // Review data based on the image
  const reviewsData = [
    {
      id: 1,
      username: "Ariana",
      daysAgo: 14,
      productName: "Never Grow Up T-Shirt",
      size: "5T",
      reviewText:
        "Love the quality of little trouble shirts so much! they run very true to size but we order up for an oversized look and room to grow! the colors and vibrant and the print is high quality.",
      rating: 5,
      profileImage: rateProductImage,
    },
    {
      id: 2,
      username: "Ariana",
      daysAgo: 14,
      productName: "Lords Of Gastown T-Shirt",
      size: "4T",
      reviewText:
        "Love the quality of little trouble shirts so much! they run very true to size but we order up for an oversized look and room to grow! the colors and vibrant and the print is high quality.",
      rating: 5,
      profileImage: rateProductImage,
    },
    {
      id: 3,
      username: "Joanna",
      daysAgo: 7,
      productName: "Checker Smile Squad Mechanic Suit",
      size: "2T",
      reviewText:
        "My son has the solid black ones and of course I had to get him these for a concert we are going to next month. Love!!",
      rating: 5,
      profileImage: rateProductImage,
    },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Get current products for the page
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Previous and next page handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    // Set up scroll detection
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Toggle white mode when reaching 360px
      if (currentScrollY >= 360) {
        setIsWhiteMode(true);
      } else {
        setIsWhiteMode(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Calculate blur amount based on scroll position (fixed calculation)
  const blurAmount = Math.min(scrollY / 36, 10); // Max 10px blur at 360px

  return (
    <main
      className="flex flex-column align-items-center"
      style={{
        backgroundColor: "#8b7f78", // Always keep the base background color
        position: "relative",
      }}
    >
      <Header />

      {/* Single white overlay that covers EVERYTHING */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          opacity: isWhiteMode ? 1 : 0,
          zIndex: 1, // Always present but transparent when not active
          transition: "opacity 0.5s ease",
          pointerEvents: "none", // Let clicks pass through
        }}
      />

      {/* Background section with blur effect fixed */}
      <section
        ref={heroSectionRef}
        className="flex widthVHDynamic flex-column align-items-center justify-content-start"
        style={{
          minHeight: "50vh",
          overflow: "hidden",
          position: "fixed",
          top: 0,
          zIndex: 0,
          filter: `blur(${blurAmount * 4}px)`,
          willChange: "filter", // Improve performance for blur animations
        }}
      >
        <div
          className="flex widthVHDynamic heightVHDynamic align-items-center justify-content-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <img
            loading="lazy"
            src={bgImage}
            alt="bg image"
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Base layer - Gradient overlay */}
        <div
          className="heightVHDynamic sidesFadeing"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* Content section with higher z-index */}
      <section
        className="floating-elements w-full align-items-center flex flex-column"
        style={{
          position: "relative",
          zIndex: 2, // Always above the white overlay
        }}
      >
        {/* Logo container */}
        <div
          className="logo-container md:h-19rem h-8rem flex align-items-center justify-content-center w-full"
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <img
            loading="lazy"
            src={mainLogo}
            alt="Little Trouble"
            className="main-logo"
          />
        </div>

        <div className="w-full align-items-center flex flex-column gap-3">
          <div className="w-full align-items-center flex flex-column">
            <div
              className="brand-info flex w-full align-items-center justify-content-between px-5"
              style={{ maxWidth: "1200px" }}
            >
              <div className="brand-details">
                <h2
                  className={`md:text-2xl text-sm ${
                    isWhiteMode
                      ? "text-black font-bold m-0"
                      : "text-white font-bold m-0"
                  }`}
                >
                  Little Trouble
                </h2>
                <div className="rating-container">
                  <span
                    className={`md:text-xl text-sm ${
                      isWhiteMode
                        ? "rating-score text-black"
                        : "rating-score text-white"
                    }`}
                  >
                    4.9{" "}
                    <span
                      className={isWhiteMode ? "text-yellow-500" : "text-white"}
                    >
                      ★
                    </span>
                  </span>
                  <span
                    className={`md:text-xl text-sm ${
                      isWhiteMode
                        ? "rating-count text-black opacity-50"
                        : "rating-count text-white opacity-50"
                    }`}
                  >
                    (3.6K)
                  </span>
                </div>
              </div>
              <div className="action-buttons flex gap-2">
                <button
                  className={
                    isWhiteMode
                      ? "follow-btn bg-black-alpha-90 text-white border-none"
                      : "follow-btn bg-white text-black border-none"
                  }
                  style={{ borderRadius: "8px" }}
                >
                  Follow
                </button>
                <button
                  className={`pi pi-search md:hidden ${
                    isWhiteMode ? "text-black surface-200" : "text-white"
                  } moreHoverBackgroundButton transition-colors duration-300`}
                  style={{ width: "36px", height: "36px", borderRadius: "8px" }}
                  onClick={() => setShowSearchModal(true)}
                ></button>
                <div style={{ position: "relative" }}>
                  <button
                    ref={moreOptionsButtonRef}
                    className={`pi pi-ellipsis-h ${
                      isWhiteMode ? "text-black surface-200" : "text-white"
                    } moreHoverBackgroundButton transition-colors duration-300`}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                    }}
                    onClick={() => setShowMoreOptions(!showMoreOptions)}
                  ></button>

                  <MoreOptionsMenu
                    isVisible={showMoreOptions}
                    onHide={() => setShowMoreOptions(false)}
                    isWhiteMode={isWhiteMode}
                    isMobile={isMobileView}
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="best-sellers-cards flex align-items-center justify-content-center flex-wrap gap-3"
            style={{
              maxWidth: "1200px",
              width: "100%",
              padding: "0 1rem",
            }}
          >
            {bestSellersData.map((card) => (
              <a
                key={card.id}
                href={card.link}
                className="flex flex-column align-items-center justify-content-center text-decoration-none md:gap-2 gap-1"
              >
                <div
                  className="card-image-container"
                  style={{
                    overflow: "hidden",
                    borderRadius: "8px",
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/7", // Keep the aspect ratio for these cards
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
                </div>
                <p className={isWhiteMode ? "text-black" : "text-white"}>
                  {card.title}
                </p>
              </a>
            ))}
          </div>

          <div className="w-full align-items-center md:flex hidden flex-column">
            <div
              className="brand-info flex w-full align-items-center justify-content-between px-5"
              style={{ maxWidth: "1200px" }}
            >
              <div className="brand-details">
                <h2
                  className={
                    isWhiteMode
                      ? "text-black text-xl m-0"
                      : "text-white text-xl m-0"
                  }
                >
                  Products
                </h2>
              </div>
              <div className="action-buttons">
                <Input
                  width={300}
                  placeholder={searchPlaceholders}
                  suggestions={searchSuggestions}
                  onSelect={handleSelect}
                  isWhiteMode={isWhiteMode}
                  backgroundColor={
                    isWhiteMode
                      ? "rgba(228, 228, 228, 0.5)"
                      : "rgba(255, 255, 255, 0.1)"
                  }
                  focusBackgroundColor={
                    isWhiteMode
                      ? "rgba(228, 228, 228, 1)"
                      : "rgba(255, 255, 255, 0.3)"
                  }
                  textColor={isWhiteMode ? "#111" : "rgba(255, 255, 255, 0.2)"}
                  borderColor={"rgba(255, 255, 255, 0.2)"}
                  placeholderColor={isWhiteMode ? "#111" : "#fff"}
                  suggestionsBackgroundColor="rgba(228, 228, 228, 1)"
                />
              </div>
            </div>
          </div>

          <div className="w-full align-items-center flex flex-column">
            <div className="w-full px-4" style={{ maxWidth: "1200px" }}>
              <CategoriesSlider
                categories={categories}
                activeCategory={selectedCategory}
                isWhiteMode={isWhiteMode}
                onCategoryChange={handleCategoryChange}
                onApplyFilters={handleApplyFilters}
                currentFilters={filterSettings}
              />
            </div>
          </div>

          <div className="px-5 w-full" style={{ maxWidth: "1200px" }}>
            <FilterToolbar
              products={productData}
              onFilterChange={setFilteredProducts}
              isWhiteMode={isWhiteMode}
              filteredCount={filteredProducts.length} // Pass the filtered count to the component
              setIsLoading={setIsLoading}
              activeCategory={selectedCategory}
            />
          </div>

          {/* Products Grid with Pagination - Updated to use flex instead of grid */}
          <div
            className="products-grid w-full px-3"
            style={{
              maxWidth: "1200px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {isLoading
              ? // Display skeleton cards while loading
                Array.from({ length: itemsPerPage }).map((_, index) => (
                  <SkeletonCard
                    key={`skeleton-${index}`}
                    isWhiteMode={isWhiteMode}
                  />
                ))
              : // Display actual products when loaded
                currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    isWhiteMode={isWhiteMode}
                    card={product}
                  />
                ))}
          </div>

          {/* Only show pagination when not loading */}
          {!isLoading && (
            <div className="pagination-container flex justify-content-center my-4 gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`pagination-btn ${
                  isWhiteMode ? "text-black" : "text-white"
                }`}
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${
                    isWhiteMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
                  }`,
                  borderRadius: "8px",
                  background: "transparent",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                <i className="pi pi-chevron-left"></i>
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={`pagination-btn ${
                    isWhiteMode ? "text-black" : "text-white"
                  }`}
                  style={{
                    padding: "0.5rem 1rem",
                    border: `1px solid ${
                      isWhiteMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
                    }`,
                    borderRadius: "8px",
                    background:
                      currentPage === i + 1
                        ? isWhiteMode
                          ? "black"
                          : "white"
                        : "transparent",
                    color:
                      currentPage === i + 1
                        ? isWhiteMode
                          ? "white"
                          : "black"
                        : isWhiteMode
                        ? "black"
                        : "white",
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`pagination-btn ${
                  isWhiteMode ? "text-black" : "text-white"
                }`}
                style={{
                  padding: "0.5rem 1rem",
                  border: `1px solid ${
                    isWhiteMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
                  }`,
                  borderRadius: "8px",
                  background: "transparent",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
              >
                <i className="pi pi-chevron-right"></i>
              </button>
            </div>
          )}

          <div
            className="flex flex-column align-items-center justify-content-center w-full"
            style={{
              maxWidth: "1200px",
              width: "100%",
              padding: "0 1rem",
            }}
          >
            <h2
              className={`w-full flex justify-content-start ${
                isWhiteMode
                  ? "text-black text-xl m-0"
                  : "text-white text-xl m-0"
              }`}
            >
              Ratings and reviews
            </h2>

            <div className="w-full flex flex-wrap gap-4 py-4">
              {reviewsData.map((review) => (
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

            <div className="w-full flex justify-content-center mt-2 mb-4">
              <button
                onClick={() => setShowReviewsModal(true)}
                className={`flex align-items-center px-4 py-2 ${
                  isWhiteMode ? "text-black" : "text-white"
                }`}
                style={{
                  borderRadius: "8px",
                  border: `1px solid ${
                    isWhiteMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"
                  }`,
                  background: "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.2s, box-shadow 0.2s",
                  fontSize: "14px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = isWhiteMode
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "0 2px 5px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                Read more reviews
              </button>
            </div>
          </div>

          {/* Add the Reviews Modal */}
          <ReviewsModal
            visible={showReviewsModal}
            onHide={() => setShowReviewsModal(false)}
            reviews={reviewsData}
            overallRating={4.9}
            totalReviews={3600}
            isWhiteMode={isWhiteMode}
          />

          {/* Add the Footer component */}
          <Footer isWhiteMode={isWhiteMode} />
        </div>
      </section>

      {/* Search modal */}
      <SearchModal
        isVisible={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        isWhiteMode={isWhiteMode}
        suggestions={searchSuggestions}
        onSelect={handleSelect}
      />
    </main>
  );
}
