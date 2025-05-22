/**
 * Custom Input component with search suggestions
 * This component is part of a shop.app clone UI project
 * Created by Mark Maher Eweida (marco5dev)
 */
import { useState, useRef, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { CSSTransition } from "react-transition-group";
import "@/styles/Input.css";

// Define props interface for our reusable component
interface InputProps {
  width?: string | number; // Width of the input (e.g., "500px", 500, "100%")
  placeholder?: string | string[]; // Single placeholder or array for animation
  placeholderInterval?: number; // Interval for placeholder animation in ms
  suggestions?: string[]; // Array of suggestion items
  onSelect?: (item: string) => void; // Callback when an item is selected
  className?: string; // Additional class names
  suggestionTitle?: string; // Title shown above suggestions
  isWhiteMode?: boolean; // Determines if white mode is enabled
  style?: React.CSSProperties;

  // Color customization options
  borderColor?: string; // Border color
  textColor?: string; // Text color
  backgroundColor?: string; // Default background color
  hoverBackgroundColor?: string; // Background color on hover
  placeholderColor?: string; // Placeholder text color
  focusBackgroundColor?: string; // Background color when input is focused
  suggestionsBackgroundColor?: string; // Background color for the suggestions dropdown
  suggestionsTextColor?: string; // Text color for suggestions
  suggestionsTitleColor?: string; // Text color for the suggestions title
  iconsColor?: string; // Color for icons (search icon)
}

export default function Input({
  width = "500px",
  placeholder = "Search...",
  placeholderInterval = 2000,
  suggestions = [],
  onSelect = () => {},
  className = "",
  suggestionTitle = "Suggested Searches",
  isWhiteMode = false,
  style = {},

  // Default colors based on isWhiteMode
  borderColor,
  textColor = isWhiteMode ? "#333" : "white",
  backgroundColor = isWhiteMode
    ? "rgba(240, 240, 240, 0.5)"
    : "rgba(255, 255, 255, 0.1)",
  placeholderColor = isWhiteMode ? "#757575" : "#cccccc",
  focusBackgroundColor,
  suggestionsBackgroundColor = "#ffffff",
  suggestionsTextColor = "#000000",
  suggestionsTitleColor = "#666666",
  iconsColor,
}: InputProps) {
  // State variables for component functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activePlaceholder, setActivePlaceholder] = useState<string>(
    Array.isArray(placeholder) ? placeholder[0] : (placeholder as string)
  );
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isPlaceholderTransitioning, setIsPlaceholderTransitioning] =
    useState(false);

  // Refs for DOM elements
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle placeholder animation if it's an array
  // By Mark Maher Eweida (marco5dev)
  useEffect(() => {
    if (!Array.isArray(placeholder) || placeholder.length <= 1 || searchTerm)
      return;

    const animationInterval = setInterval(() => {
      setIsPlaceholderTransitioning(true);

      // Change placeholder after exit animation
      setTimeout(() => {
        setPlaceholderIndex((prev) => {
          const nextIndex = (prev + 1) % placeholder.length;
          setActivePlaceholder(placeholder[nextIndex]);
          return nextIndex;
        });
        setIsPlaceholderTransitioning(false);
      }, 500); // Half the animation duration for smooth transition

    }, placeholderInterval);

    return () => clearInterval(animationInterval);
  }, [placeholder, placeholderInterval, searchTerm]);

  // Reset placeholder when search term is cleared
  useEffect(() => {
    if (!searchTerm && Array.isArray(placeholder)) {
      setActivePlaceholder(placeholder[placeholderIndex]);
    }
  }, [searchTerm, placeholder, placeholderIndex]);

  // Filter suggestions based on user input - smart filtering
  const filteredSuggestions = suggestions.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Enhanced closing with animations - Properly sequenced
  // Created by Mark Maher Eweida (marco5dev) - Animation improvements
  const handleCloseSuggestions = () => {
    setIsClosing(true);

    // PHASE 1: First animate items out with staggered exit animations
    const items = document.querySelectorAll(".suggestion-item");
    const lastItemIndex = items.length - 1;
    items.forEach((item, i) => {
      const reverseIndex = lastItemIndex - i;
      (item as HTMLElement).style.setProperty(
        "--reverse-index",
        reverseIndex.toString()
      );
      item.classList.add("suggestion-item-exit");
    });

    // Calculate time needed for all items to disappear
    // Base time (150ms) + staggered time for the last item (lastItemIndex * 30ms)
    const itemsAnimationTime = 150 + lastItemIndex * 30;

    // PHASE 2: Then collapse the container AFTER items have disappeared
    // This creates a smooth transition effect as the container shrinks
    setTimeout(() => {
      const suggestionsContainer = suggestionsRef.current;
      if (suggestionsContainer) {
        suggestionsContainer.classList.add("suggestions-container-collapse");
      }
    }, itemsAnimationTime + 50); // Add 50ms buffer after items finish

    // PHASE 3: Finally change the border radius AFTER container collapses
    // This completes the animation sequence with border restoration
    setTimeout(() => {
      const container = document.querySelector(".search-input-container");
      if (container) container.classList.add("unfocus");
    }, itemsAnimationTime + 250); // Items time + container time (200ms) + small buffer

    // Delay actual closing to allow all animations to play
    // This ensures the animations are complete before state changes
    setTimeout(() => {
      setShowSuggestions(false);
      setIsClosing(false);

      // Clean up animation classes to reset for next usage
      items.forEach((item) => item.classList.remove("suggestion-item-exit"));
      const suggestionsContainer = suggestionsRef.current;
      if (suggestionsContainer) {
        suggestionsContainer.classList.remove("suggestions-container-collapse");
      }
      const container = document.querySelector(".search-input-container");
      if (container) container.classList.remove("unfocus");
    }, itemsAnimationTime + 450); // Total animation time with buffer
  };

  // Handle item selection when a suggestion is clicked
  // By Marco5dev - Selection logic with animation cleanup
  const handleSelectItem = (item: string) => {
    setSearchTerm(item);
    handleCloseSuggestions();
    onSelect(item); // Call the callback provided by parent
  };

  // Handle focus events with interactive feedback
  const handleFocus = () => {
    setIsFocused(true);
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Don't hide suggestions here, let the click outside handler manage that
  };

  // Handle click outside to close suggestions
  // Mark Maher Eweida (marco5dev) - Improved user interaction handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !isClosing
      ) {
        handleCloseSuggestions();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isClosing]);

  // Convert width to string with px if it's a number for consistent styling
  const formattedWidth = typeof width === "number" ? `${width}px` : width;

  // Combined style with custom colors and passed style props
  const containerStyle = {
    color: textColor,
    ...style,
  };

  // Get current background color based on focus state
  const currentBackgroundColor = isFocused
    ? focusBackgroundColor || backgroundColor
    : backgroundColor;

  const inputContainerStyle = {
    width: formattedWidth,
    height: "50px",
    borderRadius: showSuggestions ? "1.25rem 1.25rem 0 0" : "1.25rem",
    transition: "border-radius 200ms ease, background-color 200ms ease",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    overflow: "hidden",
    backgroundColor: currentBackgroundColor,
    border: borderColor ? `1px solid ${borderColor}` : undefined,
  };

  // Set placeholder color in style
  const placeholderStyle = {
    opacity: 0.7,
    marginLeft: "0.25rem",
    display: "flex",
    alignItems: "center",
    height: "100%",
    color: placeholderColor,
  };

  // Create CSS for placeholder color within input
  useEffect(() => {
    // Apply placeholder color to custom styling
    document.documentElement.style.setProperty(
      "--placeholder-color",
      placeholderColor
    );
  }, [placeholderColor]);

  // Apply placeholder color directly to the input's style
  const inputStyle = {
    width: "100%",
    height: "100%",
    padding: "0.5rem 0.5rem 0.5rem 0.25rem",
    border: "none",
    outline: "none",
    boxShadow: "none",
    background: "transparent",
    position: "relative" as const,
    zIndex: 2,
    color: textColor,
  };

  const suggestionsContainerStyle = {
    width: formattedWidth,
    color: suggestionsTextColor,
    borderRadius: "0 0 1.25rem 1.25rem",
    marginTop: "-2px",
    paddingTop: "0",
    transformOrigin: "top center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    overflow: "hidden",
    borderLeft: borderColor ? `1px solid ${borderColor}` : undefined,
    borderRight: borderColor ? `1px solid ${borderColor}` : undefined,
    borderBottom: borderColor ? `1px solid ${borderColor}` : undefined,
    backgroundColor: suggestionsBackgroundColor,
    zIndex: 10,
  };

  return (
    <div
      className={`relative text-0 ${className} custom-input-container`}
      ref={containerRef}
      style={containerStyle}
    >
      <div
        className={`flex items-center search-input-container ${
          showSuggestions ? "focus" : ""
        }`}
        style={inputContainerStyle}
      >
        <div className="flex align-items-center justify-content-center ml-3 mr-1">
          <i
            className="pi pi-search"
            style={{
              color: iconsColor || placeholderColor,
              fontSize: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          />
        </div>

        {Array.isArray(placeholder) ? (
          <div className="flex-1 h-full relative">
            {/* Single stable input that always stays in place */}
            <InputText
              ref={inputRef}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              style={inputStyle}
              className="border-none placeholder-transparent" // Hide the actual placeholder
            />

            {/* Animated placeholder text (only visible when input is empty) */}
            {!searchTerm && (
              <div
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none flex items-center"
                style={{
                  zIndex: 1,
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  className={`animated-placeholder ${
                    isPlaceholderTransitioning ? "exiting" : ""
                  }`}
                  style={placeholderStyle}
                >
                  {activePlaceholder}
                </span>
              </div>
            )}
          </div>
        ) : (
          <InputText
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={typeof placeholder === "string" ? placeholder : ""}
            style={
              {
                ...inputStyle,
                "--placeholder-color": placeholderColor,
              } as React.CSSProperties
            }
            className="border-none custom-placeholder"
          />
        )}
      </div>

      <CSSTransition
        in={showSuggestions}
        timeout={200}
        classNames="suggestions"
        unmountOnExit
        nodeRef={suggestionsRef}
      >
        <div
          ref={suggestionsRef}
          className="absolute left-0 right-0 p-2 suggestions-container"
          style={suggestionsContainerStyle}
        >
          {suggestionTitle && (
            <div className="font-bold text-sm mb-2 opacity-50 suggestion-item">
              <p style={{ color: suggestionsTitleColor }}>{suggestionTitle}</p>
            </div>
          )}
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((item, index) => (
              <div
                key={index}
                className="flex align-items-center p-2 cursor-pointer hover:surface-hover border-round suggestion-item"
                style={
                  {
                    color: suggestionsTextColor,
                    "--item-index": index,
                  } as React.CSSProperties
                }
                onClick={() => handleSelectItem(item)}
              >
                <div
                  className="flex align-items-center justify-content-center mr-2"
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "4px",
                    border: "1px solid #e0e0e0",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  <i
                    className="pi pi-search"
                    style={{ fontSize: "14px", color: iconsColor || "#6c757d" }}
                  />
                </div>
                <span style={{ color: suggestionsTextColor }}>{item}</span>
              </div>
            ))
          ) : (
            <div
              className="p-2 suggestion-item"
              style={
                {
                  color: suggestionsTextColor,
                  opacity: 0.6,
                  "--item-index": 0,
                } as React.CSSProperties
              }
            >
              No results found
            </div>
          )}
        </div>
      </CSSTransition>
    </div>
  );
}
// End of Input component - Styled search input with dynamic suggestions
// This is part of a shop.app concept build for front-end testing
// Implemented by Mark Maher Eweida (marco5dev)
