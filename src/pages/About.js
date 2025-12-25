import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="container">
      <main className="main">
        <h1 className="page-title">about</h1>
        <p className="coming-soon">coming soon<span className="cursor">_</span></p>
      </main>
      <footer className="footer">
        <Link to="/" className="link">← back</Link>
      </footer>
    </div>
  );
}

export default About;
