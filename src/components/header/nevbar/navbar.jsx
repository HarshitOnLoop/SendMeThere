import React, { useState, useEffect } from "react";
import "./Navbar.css";

function Navbar({ popupContact_open }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideMenuToggle, setHideMenuToggle] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        !event.target.closest(".nav-menu") &&
        !event.target.closest(".menu-toggle")
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleHireMeClick = () => {
    popupContact_open();
    setHideMenuToggle(true); // hide spans when button clicked
    setMenuOpen(false); // optional: close the menu
  };

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <div className="text">HarshitOnLoop</div>
      </div>

      {/* Mobile Menu Toggle */}
  <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
  {!hideMenuToggle && (
    <>
      <span style={{ backgroundColor: "#fff" }}></span>
      <span style={{ backgroundColor: "#fff" }}></span>
      <span style={{ backgroundColor: "#fff" }}></span>
    </>
  )}
</div>


      {/* Navigation */}
      <nav>
        <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
          <li>
            <a href="#home" onClick={() => setMenuOpen(false)}>HOME</a>
          </li>
          <li>
            <a href="#skills" onClick={() => setMenuOpen(false)}>ABOUT</a>
          </li>
          <li>
            <a href="#skills" onClick={() => setMenuOpen(false)}>SKILLS</a>
          </li>
          <li>
            <a href="#skills" onClick={() => setMenuOpen(false)}>PROJECTS</a>
          </li>
          <li>
            <a href="#skills" onClick={() => setMenuOpen(false)}>EXPERIENCE</a>
          </li>
          <li>
            <a href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a>
          </li>

          {/* Hire Me Button inside menu */}
          <li>
            <button
              className="mobile-hire-btn"
              type="button"
              onClick={handleHireMeClick}
            >
              HIRE ME
            </button>
          </li>
        </ul>
      </nav>

      {/* Hire Me Button outside menu */}
      <button
        className="btn cube cube-hover"
        type="button"
        onClick={popupContact_open}
      >
        <div className="bg-top">
          <div className="bg-inner"></div>
        </div>
        <div className="bg-right">
          <div className="bg-inner"></div>
        </div>
        <div className="bg">
          <div className="bg-inner"></div>
        </div>
        <div className="text">HIRE ME</div>
      </button>
    </header>
  );
}

export default Navbar;
