import React, { useMemo } from 'react';
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
          <ExplodingText text="about" phase={phase} baseDelay={150} />
          <span className={`nav-separator letter letter--${phase}`} style={separatorStyle}>·</span>
          <ExplodingText text="projects" phase={phase} baseDelay={200} />
        </nav>
      </main>
      <footer className="footer">
        <ExplodingText text="say hello" phase={phase} baseDelay={300} />
      </footer>
    </div>
  );
}

export default Home;
