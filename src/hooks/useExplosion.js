import { useState, useEffect, useCallback } from 'react';

export function useExplosion() {
  const [isExploding, setIsExploding] = useState(false);
  const [phase, setPhase] = useState('idle'); // idle, explode, dance, return

  const triggerExplosion = useCallback(() => {
    if (isExploding) return;

    setIsExploding(true);
    setPhase('explode');

    // Explode -> Dance (give time for scatter animation)
    setTimeout(() => setPhase('dance'), 800);

    // Dance -> Return (orbit for a while)
    setTimeout(() => setPhase('return'), 3200);

    // Return -> Idle (give time for return animation)
    setTimeout(() => {
      setPhase('idle');
      setIsExploding(false);
    }, 4200);
  }, [isExploding]);

  useEffect(() => {
    let clickTimes = [];
    let spaceTimes = [];
    const threshold = 500;
    const requiredCount = 3;

    const checkTrigger = (times) => {
      const now = Date.now();
      const recent = times.filter(t => now - t < threshold);
      return recent.length >= requiredCount;
    };

    const handleClick = () => {
      clickTimes.push(Date.now());
      clickTimes = clickTimes.slice(-requiredCount);
      if (checkTrigger(clickTimes)) {
        triggerExplosion();
        clickTimes = [];
      }
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        spaceTimes.push(Date.now());
        spaceTimes = spaceTimes.slice(-requiredCount);
        if (checkTrigger(spaceTimes)) {
          triggerExplosion();
          spaceTimes = [];
        }
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [triggerExplosion]);

  return { isExploding, phase };
}
