import { useEffect, useRef } from 'react';

const COUNT = 3;
const WITHIN_MS = 600;

// Three taps in quick succession, ignoring anything that looks like the
// visitor trying to do something else with the page.
export function useTripleTap(onTrigger) {
  const callback = useRef(onTrigger);
  callback.current = onTrigger;

  useEffect(() => {
    let times = [];

    const handleClick = (event) => {
      const target = event.target;
      if (target && target.closest && target.closest('a, button')) return;

      // Deliberately no check for an existing selection: a third click is
      // exactly what the browser uses to select a paragraph, so the gesture
      // and the guard would fight each other. The caller clears it instead.
      const now = Date.now();
      times = times.filter(t => now - t < WITHIN_MS);
      times.push(now);
      if (times.length >= COUNT) {
        times = [];
        callback.current();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
}
