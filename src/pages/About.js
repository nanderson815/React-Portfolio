import React from 'react';
import { Link } from 'react-router-dom';
import about from '../content/about.json';

function About() {
  const { content } = about;

  return (
    <div className="container container--content">
      <main className="main main--content">
        <h1 className="page-title">about</h1>
        {content ? (
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
