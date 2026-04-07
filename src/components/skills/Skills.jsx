import React from "react";
import AboutMe from "./AboutMe";
import Experience from "./Experience";
import SkillsSection from "./SkillsSection";
import "./Skills.css";

function Skills({ popupContact_open }) {
  return (
    <section className="what-we-do">
      <div className="parent">
        
        {/* Component 1: About Me */}
        <AboutMe />

        {/* Component 2: Experience */}
        <Experience />

        {/* Component 3: Skills */}
        <SkillsSection popupContact_open={popupContact_open} />

      </div>
    </section>
  );
}

export default Skills;