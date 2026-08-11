import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
];

export function useKonamiCode(onUnlock) {
  const callbackRef = useRef(onUnlock);
  callbackRef.current = onUnlock;

  useEffect(() => {
    let index = 0;

    const handleKeyDown = (e) => {
      index = e.code === SEQUENCE[index] ? index + 1 : 0;
      if (index === SEQUENCE.length) {
        index = 0;
        if (callbackRef.current) callbackRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
