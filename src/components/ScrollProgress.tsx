import React, { useState, useEffect } from 'react';

export const ScrollProgress: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            const currentProgress = (window.scrollY / totalHeight) * 100;
            setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div 
      id="scroll-progress-track"
      className="fixed top-0 left-0 right-0 h-[3px] bg-neutral-900/40 z-50 pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page reading progress"
    >
      <div 
        id="scroll-progress-bar"
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all duration-75 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
