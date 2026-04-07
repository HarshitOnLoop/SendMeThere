import React from "react";
import "./Projects.css"; 
import projectsData from "./projectsData"; 

function Projects() {
  return (
    <div className="prj-section">
      {/* --- Background Elements --- */}
      <img src="macbook.png" className="prj-laptop-img" alt="Laptop" />

      <div className="prj-header-wrapper">
        <div className="prj-paper-note">
          <div className="prj-pin-assembly">
            <div className="prj-pin-shadow"></div>
            <div className="prj-pin-metal"></div>
            <div className="prj-pin-head"></div>
          </div>
          <h1 className="prj-main-title">projects</h1>
        </div>
      </div>

      {/* --- Card Grid --- */}
      <div className="prj-grid-container">
        {projectsData.map((project) => (
          
          <div key={project.id} className="prj-card">
            
            {/* Image Container */}
            <div className="prj-card-img-wrapper">
              <img className="prj-card-img" src={project.img} alt={project.title} />
              <div className="prj-card-overlay"></div> 
            </div>

            {/* Content Container */}
            <div className="prj-card-content">
              <h3 className="prj-card-title">{project.title}</h3>
              
              {/* Short Description */}
              <p className="prj-card-subtitle">{project.desc}</p>
              
              {/* Long Description */}
              <p className="prj-card-desc">{project.longDesc}</p>

              {/* Footer with Buttons */}
              <div className="prj-card-footer">
                <a 
                  href={project.demoLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="prj-btn prj-btn-primary"
                >
                  Live Demo
                </a>
                <a 
                  href={project.codeLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="prj-btn prj-btn-outline"
                >
                  View Code
                </a>
              </div>
            </div>

          </div>

        ))}
      </div>

      <div className="prj-spacer"></div>
    </div>
  );
}

export default Projects;
