import React, { useEffect } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

const Contact = () => {
  useEffect(() => {
    emailjs.init("AHrHKBB5iJ1ksH1I9"); // Your Public Key
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm("service_q5r4far", "template_8h0b6if", e.target)
      .then(() => {
        alert("🚀 Message sent!");
        e.target.reset();
      })
      .catch(() => alert("❌ Error sending message."));
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        {/* Left Side: Branding */}
        <div className="contact-info">
          <h1>Let's build <br />something.</h1>
          <p>Have a question or a project? Drop me a message and I'll get back to you soon.</p>
          <div className="contact-links">
            <div className="link-item">📧 harshit1232.be23@chitkarauniversity.edu.in</div>
            <div className="link-item">📍 Chandigarh , India</div>
          </div>
        </div>

        {/* Right Side: Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" name="user_name" required />
            <label>Name</label>
          </div>
          <div className="input-box">
            <input type="email" name="user_email" required />
            <label>Email</label>
          </div>
          <div className="input-box">
            <textarea name="message" required rows="4"></textarea>
            <label>Your Message</label>
          </div>
          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;