import React, { useState } from "react";
import "./Exp.css";

const Experience = () => {
  // Default to 'seo' (the first item) so the box isn't empty on load
  const [activeDetail, setActiveDetail] = useState("seo");

  const experiences = [
    { 
      id: "seo", 
      role: "SEO Specialist", 
      company: "Freelance",
      date: "2020 - Present (6 yrs)",
      text: "Specialized in Search Engine Optimization and WordPress Development to maximize organic reach." 
    },
    { 
      id: "blogger", 
      role: "WP Blogger", 
      company: "Self-Employed",
      text: "Created SEO-optimized content, managed Facebook Ads, and handled end-to-end WordPress site management." 
    },
    { 
      id: "wpdev", 
      role: "WP Developer", 
      company: "Internship",
      date: "Dec 2024 - Apr 2025",
      text: "Assisted in developing custom themes, plugins, and maintaining site architecture for clients." 
    },
    { 
      id: "fund", 
      role: "Fundraising", 
      company: "Muskurahat Foundation",
      date: "Nov 2024 - Dec 2024",
      text: "Remote internship focused on fundraising campaigns, marketing strategies, and donor outreach." 
    },
    { 
      id: "video", 
      role: "Video Editor", 
      company: "SM Digital Technologies",
      date: "Nov 2024 - Dec 2024",
      text: "Edited professional video content using industry-standard tools for digital marketing channels." 
    },
  ];

  return (
    <div className="div3">
      <div className="stripe">
        <p>"It works… ship it!" 🚀</p>
      </div>

      <div id="star">
        <img src="star.png" alt="star" />
        <h1>Experience</h1>
      </div>

      <div className="experience-container">
        <div className="button-row">
          {experiences.map((btn) => (
            <button
              key={btn.id}
              // Add 'active' class if this button is the one selected
              className={`exp-btn ${activeDetail === btn.id ? "btn-active" : ""}`}
              // SWITCHED TO CLICK HERE
              onClick={() => setActiveDetail(btn.id)}
            >
              {btn.role}
            </button>
          ))}
        </div>

        <div className="content-area">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              id={exp.id}
              className={`experience-detail ${activeDetail === exp.id ? "active" : ""}`}
            >
              <div className="detail-header">
                <h3>{exp.role}</h3>
                <span className="company-tag">@ {exp.company}</span>
              </div>
              <div className="detail-date">{exp.date}</div>
              <p className="detail-desc">{exp.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
