import React, { useMemo } from 'react';

function ExplodingText({ text, phase, baseDelay = 0, totalLetters, startIndex }) {
  const letters = useMemo(() => {
    const radius = Math.min(window.innerWidth * 0.3, 140);

    return text.split('').map((char, i) => {
      const globalIndex = startIndex + i;
      const angleRad = ((globalIndex / totalLetters) * 2 * Math.PI) - Math.PI / 2;

      return {
        char,
        scatterX: (Math.random() - 0.5) * 400,
        scatterY: (Math.random() - 0.5) * 300,
        scatterRotate: (Math.random() - 0.5) * 720,
        circleX: Math.cos(angleRad) * radius,
        circleY: Math.sin(angleRad) * radius,
        delay: i * 30 + baseDelay,
      };
    });
  }, [text, baseDelay, totalLetters, startIndex]);

  return (
    <>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={`letter letter--${phase}`}
          style={{
            '--scatter-x': `${letter.scatterX}px`,
            '--scatter-y': `${letter.scatterY}px`,
            '--scatter-rotate': `${letter.scatterRotate}deg`,
            '--circle-x': `${letter.circleX}px`,
            '--circle-y': `${letter.circleY}px`,
            '--delay': `${letter.delay}ms`,
            '--orbit-delay': `${-i * 0.08}s`,
          }}
        >
          {letter.char === ' ' ? '\u00A0' : letter.char}
        </span>
      ))}
    </>
  );
}

export default ExplodingText;
