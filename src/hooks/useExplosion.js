import { useState, useEffect, useRef, useCallback } from 'react';

const TIMELINE = [
  { phase: 'dance', at: 600 },
  { phase: 'settle', at: 2800 },
  { phase: 'return', at: 3000 },
  { phase: 'idle', at: 3800 },
];

const BURST_WINDOW = 500;
const BURST_COUNT = 3;

export function useExplosion() {
  const [isExploding, setIsExploding] = useState(false);
  const [phase, setPhase] = useState('idle');
  const timeoutsRef = useRef([]);

  const triggerExplosion = useCallback(() => {
    if (isExploding) return;

    setIsExploding(true);
    setPhase('explode');

    timeoutsRef.current = TIMELINE.map(({ phase: next, at }) =>
      setTimeout(() => {
        setPhase(next);
        if (next === 'idle') setIsExploding(false);
      }, at)
    );
  }, [isExploding]);

  useEffect(() => () => timeoutsRef.current.forEach(clearTimeout), []);

  useEffect(() => {
    let clickTimes = [];
    let spaceTimes = [];

    const isBurst = (times) => {
      const now = Date.now();
      return times.filter(t => now - t < BURST_WINDOW).length >= BURST_COUNT;
    };

    const handleClick = () => {
      clickTimes = [...clickTimes, Date.now()].slice(-BURST_COUNT);
      if (isBurst(clickTimes)) {
        triggerExplosion();
        clickTimes = [];
      }
    };

    const handleKeyDown = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      spaceTimes = [...spaceTimes, Date.now()].slice(-BURST_COUNT);
      if (isBurst(spaceTimes)) {
        triggerExplosion();
        spaceTimes = [];
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerExplosion]);

  return { isExploding, phase, triggerExplosion };
}
