import React, { useEffect, useRef, useState, useId } from 'react';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  threshold?: number;
  rootMargin?: string;
  scale?: number;
  blur?: boolean;
  as?: React.ElementType;
  id?: string;
  once?: boolean;
}

export function useIntersectionObserver({
  threshold = 0.12,
  rootMargin = '0px 0px -50px 0px',
  once = true,
}: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported or prefers-reduced-motion is enabled
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, once]);

  return { elementRef, isVisible };
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 650,
  direction = 'up',
  distance = 28,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  scale = 0.98,
  blur = true,
  as: Component = 'div',
  id,
  once = true,
}) => {
  const generatedId = useId();
  const elementId = id || `reveal-${generatedId.replace(/:/g, '')}`;
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold,
    rootMargin,
    once,
  });

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0) scale(1)';
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0) scale(${scale})`;
      case 'down':
        return `translate3d(0, -${distance}px, 0) scale(${scale})`;
      case 'left':
        return `translate3d(${distance}px, 0, 0) scale(${scale})`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0) scale(${scale})`;
      case 'none':
      default:
        return `scale(${scale})`;
    }
  };

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    filter: blur && !isVisible ? 'blur(4px)' : 'blur(0px)',
    transitionProperty: 'opacity, transform, filter',
    transitionDuration: `${duration}ms`,
    transitionDelay: `${delay}ms`,
    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'opacity, transform, filter',
  };

  return (
    <Component
      ref={elementRef}
      id={elementId}
      className={`${className}`}
      style={style}
    >
      {children}
    </Component>
  );
};
