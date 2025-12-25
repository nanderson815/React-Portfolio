import React, { useMemo, useRef, useEffect, useState } from 'react';

function ExplodingText({ text, phase, baseDelay = 0 }) {
  const lettersRef = useRef([]);
  const [frozenTransforms, setFrozenTransforms] = useState({});

  const letters = useMemo(() => {
    return text.split('').map((char, i) => ({
      char,
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 300,
      rotate: (Math.random() - 0.5) * 720,
      delay: i * 25 + baseDelay,
    }));
  }, [text, baseDelay]);

  // Capture current transforms when transitioning from dance to settle
  useEffect(() => {
    if (phase === 'settle') {
      const transforms = {};
      lettersRef.current.forEach((el, i) => {
        if (el) {
          const computed = window.getComputedStyle(el);
          transforms[i] = computed.transform;
        }
      });
      setFrozenTransforms(transforms);
    } else if (phase === 'idle') {
      setFrozenTransforms({});
    }
  }, [phase]);

  return (
    <>
      {letters.map((letter, i) => {
        const isFrozen = phase === 'settle' || phase === 'return';
        const frozenStyle = frozenTransforms[i] ? { transform: frozenTransforms[i] } : {};

        return (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            className={`letter letter--${phase}`}
            style={{
              '--x': `${letter.x}px`,
              '--y': `${letter.y}px`,
              '--rotate': `${letter.rotate}deg`,
              '--delay': `${letter.delay}ms`,
              ...(isFrozen && phase === 'settle' ? frozenStyle : {}),
            }}
          >
            {letter.char === ' ' ? '\u00A0' : letter.char}
          </span>
        );
      })}
    </>
  );
}

export default ExplodingText;
