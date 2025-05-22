import React, { useEffect, useRef } from "react";
import "../styles/SearchModal.css";
import Input from "./Input";

interface SearchModalProps {
  isVisible: boolean;
  onHide: () => void;
  isWhiteMode: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSelect?: (item: string) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  isVisible,
  onHide,
  isWhiteMode,
  suggestions = [],
  onSelect,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const searchSuggestions = [
    "Summer Collection 2023",
    "Winter Sale Items",
    "New Arrivals",
  ];

  const searchPlaceholders = [
    "Search for products...",
    "Try 'Summer Collection'...",
    "Looking for hoodies?",
    "Find your perfect fit...",
    "Discover new arrivals...",
  ];

  const handleSelect = (item: string) => {
    console.log(`Selected: ${item}`);
    // Handle selected item (e.g., navigate to search results, etc.)
  };

  // Focus the input when the modal opens
  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchTerm("");
    }
  }, [isVisible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() && onSelect) {
      onSelect(searchTerm.trim());
      onHide();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`search-modal ${isWhiteMode ? "light-mode" : "dark-mode"}`}>
      <div className="search-modal-container">
        <form onSubmit={handleSubmit} className="search-form">
          <Input
            width={300}
            placeholder={searchPlaceholders}
            suggestions={searchSuggestions}
            onSelect={handleSelect}
            isWhiteMode={isWhiteMode}
            backgroundColor="#e5e5e5"
            focusBackgroundColor="#e5e5e5"
            textColor="#111"
            borderColor={"#dadada"}
            placeholderColor="111"
            suggestionsBackgroundColor="rgba(228, 228, 228, 1)"
          />
          <button type="button" className="cancel-button" onClick={onHide}>
            Cancel
          </button>
        </form>

        {searchTerm && suggestions.length > 0 && (
          <div className="suggestions-container">
            {suggestions
              .filter((item) =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((item, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => {
                    if (onSelect) onSelect(item);
                    onHide();
                  }}
                >
                  {item}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
