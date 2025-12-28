import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Projects() {
  const [projects, setProjects] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content/projects.json')
      .then(response => response.json())
      .then(data => {
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <main className="main">
        <h1 className="page-title">projects</h1>
        {loading ? (
          <p className="coming-soon">loading<span className="cursor">_</span></p>
        ) : projects ? (
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <h2>{project.title}</h2>
                {project.description && <p>{project.description}</p>}
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="link">
                    view project →
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="link">
                    github →
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="coming-soon">coming soon<span className="cursor">_</span></p>
        )}
      </main>
      <footer className="footer">
        <Link to="/" className="link">← back</Link>
      </footer>
    </div>
  );
}

export default Projects;
