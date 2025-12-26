import React, { useMemo, useRef, useLayoutEffect, useState } from 'react';

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

  // Capture transforms synchronously before browser paints
  useLayoutEffect(() => {
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
        // Determine inline transform based on phase
        let inlineTransform = {};
        if (phase === 'settle' && frozenTransforms[i]) {
          inlineTransform = { transform: frozenTransforms[i] };
        } else if (phase === 'return') {
          // Transition TO origin - CSS transition will animate from frozen position
          inlineTransform = { transform: 'translate(0px, 0px) rotate(0deg)' };
        }

        // Keep dancing until we have frozen transforms
        let effectivePhase = phase;
        if (phase === 'settle' && !frozenTransforms[i]) {
          effectivePhase = 'dance';
        }

        return (
          <span
            key={i}
            ref={el => lettersRef.current[i] = el}
            className={`letter letter--${effectivePhase}`}
            style={{
              '--x': `${letter.x}px`,
              '--y': `${letter.y}px`,
              '--rotate': `${letter.rotate}deg`,
              '--delay': `${letter.delay}ms`,
              ...inlineTransform,
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
