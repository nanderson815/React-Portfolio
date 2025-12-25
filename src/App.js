import React, { useMemo } from 'react';
import { useEasterEgg } from './hooks/useEasterEgg';
import { useExplosion } from './hooks/useExplosion';

function ExplodingText({ text, phase, baseDelay = 0, totalLetters, startIndex }) {
  const letters = useMemo(() => {
    return text.split('').map((char, i) => {
      const globalIndex = startIndex + i;
      const angle = (globalIndex / totalLetters) * 360;
      return {
        char,
        // Random scatter positions
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 300,
        rotate: (Math.random() - 0.5) * 720,
        // Circle position
        angle,
        delay: i * 20 + baseDelay,
      };
    });
  }, [text, baseDelay, totalLetters, startIndex]);

  return (
    <>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`letter ${phase === 'explode' ? 'letter--scattered' : ''} ${phase === 'dance' ? 'letter--orbiting' : ''}`}
          style={{
            '--x': `${letter.x}px`,
            '--y': `${letter.y}px`,
            '--rotate': `${letter.rotate}deg`,
            '--angle': `${letter.angle}deg`,
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

  const name = "Noah Anderson";
  const tagline = "coming soon";
  const totalLetters = name.length + tagline.length;

  return (
    <div className={`container ${phase === 'dance' ? 'container--orbiting' : ''}`}>
      <main className="main">
        <h1 className="name">
          <ExplodingText
            text={name}
            phase={phase}
            totalLetters={totalLetters}
            startIndex={0}
          />
        </h1>
        <p className="tagline">
          <ExplodingText
            text={tagline}
            phase={phase}
            baseDelay={100}
            totalLetters={totalLetters}
            startIndex={name.length}
          />
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
