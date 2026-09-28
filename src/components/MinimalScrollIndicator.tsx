import React, { useState, useEffect } from 'react';

export const MinimalScrollIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none select-none mix-blend-difference"
      aria-hidden="true"
    >
      {/* Hairline track with moving indicator */}
      <div className="w-[1.5px] h-20 sm:h-28 bg-white/20 rounded-full relative overflow-hidden">
        <div 
          className="w-full bg-amber-400 rounded-full transition-all duration-150"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {/* Tiny subtle percentage mark */}
      <span className="text-[9px] font-mono text-white/50 tracking-tighter">
        {Math.round(scrollProgress)}%
      </span>
    </div>
  );
};
