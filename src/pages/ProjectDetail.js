import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

function ProjectDetail() {
  const { slug } = useParams();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/content/projects/${slug}.md`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Project not found');
        }
        return response.text();
      })
      .then(markdown => {
        setContent(markdown);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching project:', err);
        setError(true);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="container container--content">
      <main className="main main--content">
        {loading ? (
          <p className="coming-soon">loading<span className="cursor">_</span></p>
        ) : error ? (
          <>
            <h1 className="page-title">404</h1>
            <p className="coming-soon">project not found<span className="cursor">_</span></p>
          </>
        ) : (
          <div className="project-detail">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </main>
      <footer className="footer">
        <Link to="/projects" className="link">← back to projects</Link>
      </footer>
    </div>
  );
}

export default ProjectDetail;
