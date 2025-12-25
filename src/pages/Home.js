import React from 'react';
import { Link } from 'react-router-dom';
import ExplodingText from '../components/ExplodingText';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { useExplosion } from '../hooks/useExplosion';

function Home() {
  useEasterEgg();
  const { phase } = useExplosion();

  return (
    <div className="container">
      <main className="main">
        <h1 className="name">
          <ExplodingText text="Noah Anderson" phase={phase} />
        </h1>
        <nav className="nav">
          <Link to="/about" className="nav-link">about</Link>
          <span className="nav-separator">·</span>
          <Link to="/projects" className="nav-link">projects</Link>
        </nav>
      </main>
      <footer className="footer">
        <a href="mailto:nanderson815@gmail.com" className="link">say hello</a>
      </footer>
    </div>
  );
}

export default Home;
