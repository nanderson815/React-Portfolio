import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ExplodingText from '../components/ExplodingText';
import { useEasterEgg } from '../hooks/useEasterEgg';
import { useExplosion } from '../hooks/useExplosion';

function Home() {
  useEasterEgg();
  const { phase } = useExplosion();

  const separatorStyle = useMemo(() => ({
    '--x': `${(Math.random() - 0.5) * 400}px`,
    '--y': `${(Math.random() - 0.5) * 300}px`,
    '--rotate': `${(Math.random() - 0.5) * 720}deg`,
    '--delay': '180ms',
  }), []);

  return (
    <div className="container">
      <main className="main">
        <h1 className="name">
          <ExplodingText text="Noah Anderson" phase={phase} />
        </h1>
        <nav className="nav">
          <Link to="/about" className="nav-link">
            <ExplodingText text="about" phase={phase} baseDelay={150} />
          </Link>
          <span className={`nav-separator letter letter--${phase}`} style={separatorStyle}>·</span>
          <Link to="/projects" className="nav-link">
            <ExplodingText text="projects" phase={phase} baseDelay={200} />
          </Link>
        </nav>
      </main>
      <footer className="footer">
        <a href="mailto:nanderson815@gmail.com" className="footer-link">
          <ExplodingText text="say hello" phase={phase} baseDelay={300} />
        </a>
      </footer>
    </div>
  );
}

export default Home;
