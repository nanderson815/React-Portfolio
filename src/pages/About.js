import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function About() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content/about.json')
      .then(response => response.json())
      .then(data => {
        setContent(data.content);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching about content:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <main className="main">
        <h1 className="page-title">about</h1>
        {loading ? (
          <p className="coming-soon">loading<span className="cursor">_</span></p>
        ) : content ? (
          <div className="content">
            {typeof content === 'string' ? (
              <p>{content}</p>
            ) : Array.isArray(content) ? (
              content.map((section, index) => (
                <div key={index} className="section">
                  {section.heading && <h2>{section.heading}</h2>}
                  {section.text && <p>{section.text}</p>}
                </div>
              ))
            ) : null}
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

export default About;
