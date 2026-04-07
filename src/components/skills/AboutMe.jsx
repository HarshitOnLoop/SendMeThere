import React from "react";
import "./AboutMe.css";

const AboutMe = () => {
  return (
    <div className="div1">
      {/* BACKGROUND LAYERS (For Texture & Depth) */}
      <div className="bg-pattern"></div>
      <div className="glow-effect"></div>

      <div id="cssportal-grid">
        <div id="cdiv1">
          <section id="intro">
            
            {/* Status Badge */}
            <div className="status-badge">
              <span className="pulse-dot"></span> 
              <span>Available for Projects</span>
            </div>

            <h1>
              Hi, I am <br />
              <span className="highlight-text">Harshit Sharma</span>
            </h1>

            <p className="mhide">
              I’m a 3rd-year BE student at Chitkara University with a passion for
              Web Development, SEO, and React JS. Currently mastering DSA and 
              building modern digital experiences.
            </p>
            
            <p className="phide">
              3rd-year BE Student @ Chitkara. Web Dev & SEO Enthusiast.
            </p>

            {/* Tech Stack Pills */}
            <div className="tech-tags">
              <span>#ReactJS</span>
              <span>#SEO</span>
              <span>#DSA</span>
            </div>
          </section>
        </div>

        <div id="cdiv2">
          {/* Image */}
          <img src="a.png" alt="Harshit Sharma" />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;