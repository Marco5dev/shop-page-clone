import Logo from "@/assets/Logo";
import Input from "./Input";
import "@/styles/Header.css";
import { useEffect, useState } from "react";

export default function Header() {
  const [isWhiteMode, setIsWhiteMode] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      // Change header style when scroll position reaches transition point
      const scrollY = window.scrollY;
      const TRANSITION_POINT = 360;

      if (scrollY >= TRANSITION_POINT) {
        setIsWhiteMode(true);
      } else {
        setIsWhiteMode(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Call once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <header
        className={`flex top-0 w-full justify-content-between align-items-center py-3 px-3 ${
          isWhiteMode ? "header-white-mode" : "text-white"
        }`}
        style={{
          backdropFilter: "blur(35px)",
          backgroundColor: isWhiteMode
            ? "rgba(255, 255, 255, 0.9)"
            : "rgba(0, 0, 0, 0.3)",
          zIndex: 20,
          position: "sticky",
        }}
      >
        <nav className="flex align-items-center gap-5">
          <div className={isWhiteMode ? "logo-white-mode" : ""}>
            <Logo />
          </div>
          <ul className="lg:flex hidden gap-5">
            <li>
              <a
                href="/"
                className={`${
                  isWhiteMode ? "text-black" : "text-white"
                } opacity-50`}
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/categories"
                className={`${
                  isWhiteMode ? "text-black" : "text-white"
                } opacity-50`}
              >
                Explore
              </a>
            </li>
          </ul>
        </nav>

        <div className="lg:block hidden">
          <Input
            width={500}
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
                : "rgba(255, 255, 255, 0.2)"
            }
            textColor={isWhiteMode ? "#333" : "#fff"}
          />
        </div>

        <div className="flex gap-2">
          <button
            className={`pi pi-heart lg:flex hidden ${
              isWhiteMode ? "text-black" : "text-white"
            } px-3 py-1 hoverBackgroundButton transition-colors duration-300`}
            style={{
              border: `0.5px solid ${
                isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }`,
              borderRadius: "8px",
            }}
          ></button>
          <button
            className={`pi pi-shopping-cart lg:flex hidden ${
              isWhiteMode ? "text-black" : "text-white"
            } px-3 py-1 hoverBackgroundButton transition-colors duration-300`}
            style={{
              border: `0.5px solid ${
                isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }`,
              borderRadius: "8px",
            }}
          ></button>
          <button
            className={`${
              isWhiteMode ? "text-black" : "text-white"
            } px-3 py-1 hoverBackgroundButton transition-colors duration-300`}
            style={{
              border: `0.5px solid ${
                isWhiteMode ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }`,
              borderRadius: "8px",
            }}
          >
            Sign in
          </button>
        </div>
      </header>
    </>
  );
}
