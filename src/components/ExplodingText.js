import React, { useMemo } from 'react';

function ExplodingText({ text, phase, baseDelay = 0 }) {
  const letters = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      rotate: (Math.random() - 0.5) * 720,
      delay: i * 25 + baseDelay,
    }));
  }, [text, baseDelay]);

  return (
    <>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`letter letter--${phase}`}
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

export default ExplodingText;
