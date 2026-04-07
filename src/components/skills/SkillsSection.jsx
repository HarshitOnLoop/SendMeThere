import React, { useState } from "react";
import "./SkillsSection.css";

const SkillsSection = ({ popupContact_open }) => {
  const [activeCategory, setActiveCategory] = useState("Frontend");

  // Skills extracted from your Resume
  const skillsData = {
    Frontend: [
      "React JS",
      "HTML5",
      "css3",
      "JavaScript",
      "WordPress",

    ],
    Backend: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "MySQL",
    ],
    Languages: [
      "Java",
      "C++",
      "DSA",
      "Git / GitHub"
    ],
    Marketing: [
      "SEO Specialist",
      "Google Ads",
      "Content Strategy",
      "Social Media",
      "Blogging",
      "Facebook Ads"
    ]
  };

  // Modern color palette for the cards
  const colors = [
    "#040000", // Black
    "#0055ff", // Blue
    "#ff0095", // Pink
    "#009f4d", // Green
    "#e60023", // Red
    "#00d2d3"  // Cyan
  ];

  return (
    <div className="div4">
      {/* Header Section */}
      <div className="skill">
        <h1>skills</h1>
        <button className="button" onClick={popupContact_open}>
          <p className="button__text">
            {"Open to Work dev".split("").map((ch, idx) => (
              <span key={idx} style={{ "--index": idx }}>
                {ch}
              </span>
            ))}
          </p>
          <div className="button__circle">
            <svg viewBox="0 0 14 15" fill="none" width="14" className="button__icon">
              <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"/>
            </svg>
          </div>
        </button>
      </div>

      {/* Category Tabs (New Functionality) */}
      <div className="category-tabs">
        {Object.keys(skillsData).map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic Skills Grid */}
      <div className="skillsgrid">
        {skillsData[activeCategory].map((skill, index) => (
          <div
            key={skill}
            className="sall"
            style={{
              backgroundColor: colors[index % colors.length], // Cycle through colors
              zIndex: skillsData[activeCategory].length - index, // Stack order
              marginTop: index === 0 ? "0" : "-15px" // Overlap effect
            }}
          >
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
