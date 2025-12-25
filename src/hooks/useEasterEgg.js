import { useEffect } from 'react';

export function useEasterEgg() {
  useEffect(() => {
    // Console greeting for curious devs
    console.log(
      '%c👋 Hey there, curious one.',
      'font-family: monospace; font-size: 14px; color: #666;'
    );
    console.log(
      '%cYou found the console. Easter eggs coming soon...',
      'font-family: monospace; font-size: 12px; color: #999;'
    );

    // Konami code listener (up up down down left right left right b a)
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e) => {
      if (e.code === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          // Easter egg triggered!
          console.log('%c🎮 Konami code activated!', 'font-size: 20px;');
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
