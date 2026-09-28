import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on fine pointer (desktop)
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement;
      const isInteractive = Boolean(
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor-hover]') ||
        target.closest('#orb')
      );
      setIsHovered(isInteractive);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const loop = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden md:block ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`rounded-full border border-amber-400/90 transition-all duration-300 ${
          isHovered
            ? 'w-10 h-10 bg-amber-400/20 scale-125'
            : 'w-4 h-4 bg-amber-400/40'
        }`}
      />
    </div>
  );
};
