import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import "./Header.css";
import Navbar from "./nevbar/navbar";


function Header() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // ✅ For mobile menu

  const popupContact_open = () => setIsPopupOpen(true);
  const popupContact_close = () => setIsPopupOpen(false);

  const handlePopupSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    emailjs
      .sendForm(
        "service_q5r4far",
        "template_8h0b6if",
        e.target,
        "AHrHKBB5iJ1ksH1I9"
      )
      .then(() => {
        alert("✅ Message sent successfully!");
        e.target.reset();
        setIsPopupOpen(false);
      })
      .catch((error) => {
        console.error("❌ EmailJS error:", error);
        alert("Failed to send message: " + error.text);
      })
      .finally(() => setIsSending(false));
  };

  return (
    <div>
      {/* Popup Contact */}
      {isPopupOpen && (
        <div className="popupContact_container">
          <div className="popupContact_content">
            <span className="popupContact_closeBtn" onClick={popupContact_close}>
              &times;
            </span>
        {isPopupOpen && (
  <div className="popupContact_container" id="popupContact_container">
    <div className="popupContact_content">
      <span
        className="popupContact_closeBtn"
        onClick={popupContact_close}
      >
        &times;
      </span>
      <p className="popupContact_title">CONTACT US</p>

      <form id="popupContact_form" onSubmit={handlePopupSubmit}>
        <div className="popupContact_formGroup">
          <label htmlFor="popupContact_name">Name</label>
          <input
            type="text"
            id="popupContact_name"
            name="name"
            className="popupContact_input"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="popupContact_formGroup">
          <label htmlFor="popupContact_email">Email</label>
          <input
            type="email"
            id="popupContact_email"
            name="email"
            className="popupContact_input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="popupContact_formGroup">
          <label htmlFor="popupContact_subject">Subject</label>
          <input
            type="text"
            id="popupContact_subject"
            name="subject"
            className="popupContact_input"
            placeholder="Enter subject"
            required
          />
        </div>

        <div className="popupContact_formGroup">
          <label htmlFor="popupContact_message">Message</label>
          <textarea
            id="popupContact_message"
            name="message"
            className="popupContact_input"
            rows="4"
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="popupContact_btn" disabled={isSending}>
          {isSending ? "Sending..." : "SEND MESSAGE"}
        </button>
      </form>
    </div>
  </div>
)}

          </div>
        </div>
      )}


      {/* Header */}
      <div className="container">
        {/*nav bar*/}
        <Navbar popupContact_open={popupContact_open} />


        {/* Hero Section */}
        <section className="hero-section">
<h1>
    <span class="icon github"></span>

    COMPUTER SCIENCE <br/>
    UNDERGRAD PASSIONATE <br/>
BUILDING REAL APPS    <span class="icon vscode"></span>
</h1>
          <p>
I focus on building user-friendly applications and improving my skills through hands-on projects, aiming to create simple and practical solutions for real-world use cases.     </p>

          <button className="delete-button" onClick={popupContact_open}>
            <span className="btn-text">Make a Request</span>
          </button>

          <div className="logos-row">
            <a href="https://www.linkedin.com/in/harshitonloop/" target="_blank" rel="noreferrer">
              <img src="linkdin.png" alt="LinkedIn" />
            </a>
            <a href="https://github.com/HarshitOnLoop" target="_blank" rel="noreferrer">
              <img src="github 2.png" alt="GitHub" />
            </a>
            <a href="https://x.com/HarshitOnLoop" target="_blank" rel="noreferrer">
              <img src="Untitled_design-removebg-preview.png" alt="X" />
            </a>
            <a href="https://leetcode.com/u/HarshitOnLoop/" target="_blank" rel="noreferrer">
              <img src="leetcode.png" alt="LeetCode" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Header;
