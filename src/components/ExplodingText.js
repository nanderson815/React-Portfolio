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

  // Must read the mid-animation transforms before the browser paints the
  // settle frame, otherwise the letters snap to origin instead of easing back.
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
        let inlineTransform = {};
        if (phase === 'settle' && frozenTransforms[i]) {
          inlineTransform = { transform: frozenTransforms[i] };
        } else if (phase === 'return') {
          inlineTransform = { transform: 'translate(0px, 0px) rotate(0deg)' };
        }

        // Keep dancing until the frozen transform for this letter is captured.
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
