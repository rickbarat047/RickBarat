import { RefObject, useState, useEffect } from 'react';
import { 
  useScroll, 
  useTransform, 
  useSpring, 
  MotionValue 
} from 'framer-motion';

export interface UsePrmptScrollScaleOptions {
  index?: number;
  bidirectional?: boolean;
  staggerColumns?: number;
  smooth?: boolean;
  springConfig?: {
    stiffness?: number;
    damping?: number;
    mass?: number;
    restDelta?: number;
  };
}

export interface UsePrmptScrollScaleReturn {
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
  prefersReducedMotion: boolean;
  rawScale: MotionValue<number>;
}

/**
 * Custom hook implementing the PRMPT archive-style entrance animation.
 * Uses Framer Motion to map the container's vertical scroll position
 * dynamically to scale (0 -> 1 on entrance, and optionally 1 -> 0 on exit).
 */
export function usePrmptScrollScale(
  targetRef: RefObject<HTMLElement>,
  options: UsePrmptScrollScaleOptions = {}
): UsePrmptScrollScaleReturn {
  const {
    index = 0,
    bidirectional = true,
    staggerColumns = 3,
    smooth = true,
    springConfig = {
      stiffness: 240,
      damping: 26,
      mass: 0.5,
      restDelta: 0.001,
    },
  } = options;

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Compute column offset for natural cascading archival entrance wave
  const colIndex = index % staggerColumns;
  // Offset ranges from when the card starts entering from viewport bottom ("start end")
  // to when it exits through the viewport top ("end start")
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  // Staggered thresholds based on horizontal position in the grid
  const enterThreshold = 0.16 + colIndex * 0.04; // e.g. col 0: 0.16, col 1: 0.20, col 2: 0.24
  const exitThreshold = 0.84 - colIndex * 0.04;  // e.g. col 0: 0.84, col 1: 0.80, col 2: 0.76

  // Map scroll progress dynamically to scale: 0 -> 1 entering the viewport
  const rawScale = useTransform(
    scrollYProgress,
    bidirectional
      ? [0, enterThreshold, exitThreshold, 1]
      : [0, enterThreshold, 1, 1],
    bidirectional
      ? [0, 1, 1, 0]
      : [0, 1, 1, 1],
    { clamp: true }
  );

  // Smooth out trackpad and wheel scroll increments with spring physics
  const springScale = useSpring(rawScale, springConfig);

  // Accompanying opacity ramp (0 -> 1)
  const rawOpacity = useTransform(
    scrollYProgress,
    bidirectional
      ? [0, enterThreshold * 0.85, exitThreshold + (1 - exitThreshold) * 0.35, 1]
      : [0, enterThreshold * 0.85, 1, 1],
    bidirectional
      ? [0, 1, 1, 0]
      : [0, 1, 1, 1],
    { clamp: true }
  );

  const springOpacity = useSpring(rawOpacity, springConfig);

  return {
    scale: smooth ? springScale : rawScale,
    opacity: smooth ? springOpacity : rawOpacity,
    scrollYProgress,
    prefersReducedMotion,
    rawScale,
  };
}
