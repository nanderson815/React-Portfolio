import React from 'react';
import { Link } from 'react-router-dom';
import content from '../content/projects.json';

function Projects() {
  const { projects } = content;

  return (
    <div className="container container--content">
      <main className="main main--content">
        <h1 className="page-title">projects</h1>
        {projects ? (
          <div className="projects-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                {project.slug ? (
                  <Link to={`/projects/${project.slug}`}>
                    <h2>{project.title}</h2>
                  </Link>
                ) : (
                  <h2>{project.title}</h2>
                )}
                {project.description && <p>{project.description}</p>}
                <div className="project-links">
                  {project.slug && (
                    <Link to={`/projects/${project.slug}`} className="link">
                      read more →
                    </Link>
                  )}
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
