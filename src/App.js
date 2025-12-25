import React, { useMemo } from 'react';
import { useEasterEgg } from './hooks/useEasterEgg';
import { useExplosion } from './hooks/useExplosion';

function ExplodingText({ text, phase, baseDelay = 0 }) {
  const letters = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      rotate: (Math.random() - 0.5) * 720,
      delay: i * 20 + baseDelay,
    }));
  }, [text, baseDelay]);

  return (
    <>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`letter ${phase !== 'idle' ? 'letter--active' : ''} ${phase === 'dance' ? 'letter--dancing' : ''}`}
          style={{
            '--x': `${letter.x}px`,
            '--y': `${letter.y}px`,
            '--rotate': `${letter.rotate}deg`,
            '--delay': `${letter.delay}ms`,
          }}
        >
          {letter.char === ' ' ? '\u00A0' : letter.char}
        </span>
      ))}
    </>
  );
}

function App() {
  useEasterEgg();
  const { phase } = useExplosion();

  return (
    <div className="container">
      <main className="main">
        <h1 className="name">
          <ExplodingText text="Noah Anderson" phase={phase} />
        </h1>
        <p className="tagline">
          <ExplodingText text="coming soon" phase={phase} baseDelay={100} />
          <span className={`cursor ${phase !== 'idle' ? 'cursor--hidden' : ''}`}>_</span>
        </p>
      </main>
      <footer className="footer">
        <a href="mailto:nanderson815@gmail.com" className="link">say hello</a>
      </footer>
    </div>
  );
}

export default App;
