import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook that tracks scroll velocity.
 * Computes instantaneous scroll deltas, smoothly dampens with requestAnimationFrame,
 * and provides a normalized scroll velocity value that decays to 0 when idle.
 */
export function useScrollVelocity(): number {
  const [scrollVelocity, setScrollVelocity] = useState<number>(0);
  const lastScrollY = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();

    const decayVelocity = () => {
      velocityRef.current *= 0.88;

      if (Math.abs(velocityRef.current) < 0.002) {
        velocityRef.current = 0;
        setScrollVelocity(0);
        rafId.current = null;
        return;
      }

      setScrollVelocity(parseFloat(velocityRef.current.toFixed(4)));
      rafId.current = requestAnimationFrame(decayVelocity);
    };

    const handleScroll = () => {
      const now = performance.now();
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY.current;
      const deltaTime = Math.max(now - lastTime.current, 10);

      lastScrollY.current = currentScrollY;
      lastTime.current = now;

      const instantVelocity = (deltaY / deltaTime) * 0.9;
      velocityRef.current = velocityRef.current * 0.35 + instantVelocity * 0.65;
      velocityRef.current = Math.max(-3.5, Math.min(3.5, velocityRef.current));

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(decayVelocity);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return scrollVelocity;
}
