import React from "react";
import "../styles/Footer.css";

interface FooterProps {
  isWhiteMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isWhiteMode }) => {
  return (
    <footer
      className={`footer ${isWhiteMode ? "footer-light" : "footer-dark"}`}
    >
      <div className="footer-content">
        <div className="footer-sections-container">
          <div className="footer-section brand-section font-bold text-2xl" style={{ color: "#707070"}}>
            MARCO5DEV
            {/* This is a project by Mark Maher Eweida (marco5dev) */}
            <p className="footer-description">
              This is a concept website inspired by shop.app, created to demonstrate
              frontend development skills.
            </p>
            {/* Social links section with my portfolio link - Mark Maher Eweida */}
            <div className="app-links">
              <div className="mb-4 flex flex-column" style={{ gap: "10px" }}>
                <a 
                  href="https://marco5dev.me" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#707070" }}
                >
                  Visit My Portfolio
                </a>
                <a 
                  href="https://github.com/marco5dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#707070" }}
                >
                  GitHub
                </a>
                <a 
                  href="https://linkedin.com/in/marco5dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#707070" }}
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="footer-links-container">
            <div className="footer-section">
              {/* Mark Maher Eweida (marco5dev) - Links section */}
              <h3 className="footer-subtitle">Information</h3>
              <ul className="footer-links">
                <li>
                  <a href="https://marco5dev.me">My Portfolio</a>
                </li>
                <li>
                  <a href="https://marco5dev.me/projects">Projects</a>
                </li>
                <li>
                  <a href="https://marco5dev.me/contact">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              {/* Updated social links by Mark Maher Eweida */}
              <h3 className="footer-subtitle">Social</h3>
              <ul className="footer-links">
                <li>
                  <a href="https://instagram.com/marco5dev">Instagram</a>
                </li>
                <li>
                  <a href="https://github.com/marco5dev">GitHub</a>
                </li>
                <li>
                  <a href="https://linkedin.com/in/marco5dev">LinkedIn</a>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              {/* Legal links section updated by marco5dev */}
              <h3 className="footer-subtitle">Legal</h3>
              <ul className="footer-links">
                <li>
                  <a href="https://marco5dev.me/#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="https://marco5dev.me/#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="https://marco5dev.me">Portfolio Home</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="powered-by">
            <span
              style={{
                color: "#707070",
              }}
            >
              Developed by{" "}
            </span>
            <a
              href="https://marco5dev.me"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#707070", fontWeight: "bold" }}
            >
              Mark Maher Eweida (marco5dev)
            </a>
          </div>
          <div className="footer-right">
            <div className="language-selector">
              <span
                style={{
                  color: "#707070",
                }}
              >
                Language
              </span>
            </div>
            {/* Copyright notice with my name */}
            <div
              className="copyright"
              style={{
                color: "#707070",
              }}
            >
              © Mark Maher Eweida, 2023 - This is a clone of shop.app for front-end testing purposes
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
