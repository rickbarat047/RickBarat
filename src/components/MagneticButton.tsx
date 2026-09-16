import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  title?: string;
  'aria-label'?: string;
  /**
   * Magnetic attraction strength multiplier (0.1 to 1.0).
   * Default: 0.35
   */
  strength?: number;
  /**
   * Whether to apply subtle parallax attraction to inner content for high-end tactile feel.
   * Default: true
   */
  innerParallax?: boolean;
  /**
   * Content parallax multiplier.
   * Default: 0.15
   */
  innerStrength?: number;
  style?: React.CSSProperties;
}

/**
 * MagneticButton
 * 
 * Replaces standard static button hover effects with a fluid, cursor-attracted
 * physics-based magnetic interaction using Framer Motion springs.
 * 
 * Features:
 * - Spring-damped magnetic pull tracking cursor coordinates relative to button center
 * - Dual-layer inner parallax for premium visual depth
 * - Automatic prefers-reduced-motion and touch device detection
 * - Flexible rendering as an interactive <button> or <a> anchor
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  id,
  onClick,
  onMouseEnter,
  onMouseLeave,
  type = 'button',
  disabled = false,
  href,
  target,
  rel,
  title,
  'aria-label': ariaLabel,
  strength = 0.35,
  innerParallax = true,
  innerStrength = 0.15,
  style,
}) => {
  const containerRef = useRef<HTMLButtonElement & HTMLAnchorElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect accessibility preference & pointer capabilities
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const pointerQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(pointerQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    const handlePointerChange = (e: MediaQueryListEvent) => setIsTouchDevice(e.matches);

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
      pointerQuery.addEventListener('change', handlePointerChange);
      return () => {
        motionQuery.removeEventListener('change', handleMotionChange);
        pointerQuery.removeEventListener('change', handlePointerChange);
      };
    }
  }, []);

  // Motion values for raw offsets
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Silky physics spring configuration
  const springConfig = {
    damping: 18,
    stiffness: 160,
    mass: 0.15,
  };

  // Outer button container displacement
  const springX = useSpring(rawX, springConfig);
  const springY = useSpring(rawY, springConfig);

  // Inner content parallax displacement
  const innerX = useTransform(springX, (val) => (innerParallax ? val * (innerStrength / strength) : 0));
  const innerY = useTransform(springY, (val) => (innerParallax ? val * (innerStrength / strength) : 0));

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || prefersReducedMotion || isTouchDevice || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Relative offset from button center
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    rawX.set(distanceX * strength);
    rawY.set(distanceY * strength);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setIsHovered(true);
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    setIsHovered(false);
    rawX.set(0);
    rawY.set(0);
    onMouseLeave?.(e);
  };

  const commonProps = {
    id,
    title,
    'aria-label': ariaLabel,
    style: {
      ...style,
      x: springX,
      y: springY,
      touchAction: 'manipulation',
    },
    onMouseMove: handleMouseMove,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    whileTap: disabled ? undefined : { scale: 0.96 },
    className: `relative inline-flex items-center justify-center transition-shadow select-none ${className}`,
  };

  const renderInnerContent = () => (
    <motion.span
      style={{
        x: innerX,
        y: innerY,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: 'inherit',
        pointerEvents: 'none',
      }}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <motion.a
        ref={containerRef}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        {...commonProps}
      >
        {renderInnerContent()}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={containerRef}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...commonProps}
    >
      {renderInnerContent()}
    </motion.button>
  );
};
