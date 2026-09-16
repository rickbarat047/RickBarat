import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { RevealLayer } from './RevealLayer';

interface EditorialPortraitRevealProps {
  baseImage: string;
  revealImage: string;
  cursorX: number;
  cursorY: number;
  spotlightRadius?: number;
  className?: string;
}

export const EditorialPortraitReveal: React.FC<EditorialPortraitRevealProps> = ({
  baseImage,
  revealImage,
  cursorX,
  cursorY,
  spotlightRadius = 260,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();
  
  // Track when portrait enters viewport on scroll
  const isInView = useInView(containerRef, {
    amount: 0.15,
    once: false,
  });

  // Track sweep key to trigger fresh directional sweep animation on each viewport entry
  const [sweepCycle, setSweepCycle] = useState(0);

  useEffect(() => {
    if (isInView) {
      setSweepCycle((prev) => prev + 1);
    }
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      id="editorial-portrait-container"
      className={`absolute inset-0 overflow-hidden select-none pointer-events-none z-10 ${className}`}
      aria-label="Editorial Portrait - Rick Barat"
    >
      {/* Editorial Mask Reveal Container */}
      <motion.div
        key={`mask-${sweepCycle > 0 ? 'active' : 'idle'}`}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
                clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
                opacity: 0.7,
              }
        }
        animate={
          isInView
            ? prefersReducedMotion
              ? { opacity: 1 }
              : {
                  clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  opacity: 1,
                }
            : prefersReducedMotion
            ? { opacity: 0.5 }
            : {
                clipPath: 'polygon(0% 15%, 100% 15%, 100% 100%, 0% 100%)',
                opacity: 0.7,
              }
        }
        transition={{
          clipPath: {
            duration: 1.35,
            ease: [0.16, 1, 0.3, 1],
          },
          opacity: {
            duration: 0.8,
            ease: 'easeOut',
          },
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Counter-scaling portrait with subtle ambient parallax */}
        <motion.div
          initial={prefersReducedMotion ? false : { scale: 1.08 }}
          animate={isInView ? { scale: 1.0 } : { scale: 1.06 }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: `url("${baseImage}")`,
          }}
        />

        {/* Subterranean/Architecture Spotlight Reveal Layer */}
        <RevealLayer
          image={revealImage}
          cursorX={cursorX}
          cursorY={cursorY}
          spotlightRadius={spotlightRadius}
        />

        {/* Directional Light Sweep: Beveled angled beam traversing diagonally across portrait */}
        {!prefersReducedMotion && (
          <motion.div
            key={`light-sweep-${sweepCycle}`}
            initial={{ x: '-160%', opacity: 0 }}
            animate={
              isInView
                ? {
                    x: '240%',
                    opacity: [0, 0.15, 0.9, 0.9, 0.2, 0],
                  }
                : { x: '-160%', opacity: 0 }
            }
            transition={{
              duration: 1.65,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-y-0 w-[95%] pointer-events-none z-35 -skew-x-12"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.02) 18%, rgba(251, 191, 36, 0.15) 36%, rgba(255, 255, 255, 0.48) 50%, rgba(251, 191, 36, 0.25) 62%, rgba(255, 255, 255, 0.06) 78%, transparent 100%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Secondary soft luminous highlight bloom */}
        {!prefersReducedMotion && (
          <motion.div
            key={`bloom-${sweepCycle}`}
            initial={{ x: '-120%', opacity: 0 }}
            animate={
              isInView
                ? {
                    x: '200%',
                    opacity: [0, 0.1, 0.65, 0.65, 0.1, 0],
                  }
                : { x: '-120%', opacity: 0 }
            }
            transition={{
              duration: 1.65,
              delay: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 pointer-events-none z-36"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(251, 191, 36, 0.3) 0%, rgba(255, 255, 255, 0.2) 30%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Editorial Architectural Vignette & Contrast Tuning */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/50 pointer-events-none z-20" />
        <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/60 pointer-events-none z-20" />

        {/* Fine Editorial Corner Registration Crosshairs & Hairline Accents */}
        <div className="absolute inset-4 sm:inset-8 border border-white/[0.08] pointer-events-none z-25">
          {/* Top-Left Registration Mark */}
          <div className="absolute -top-1.5 -left-1.5 text-white/40 font-mono text-[10px] leading-none select-none">
            +
          </div>
          {/* Top-Right Registration Mark */}
          <div className="absolute -top-1.5 -right-1.5 text-white/40 font-mono text-[10px] leading-none select-none">
            +
          </div>
          {/* Bottom-Left Registration Mark */}
          <div className="absolute -bottom-1.5 -left-1.5 text-white/40 font-mono text-[10px] leading-none select-none">
            +
          </div>
          {/* Bottom-Right Registration Mark */}
          <div className="absolute -bottom-1.5 -right-1.5 text-white/40 font-mono text-[10px] leading-none select-none">
            +
          </div>

          {/* Micro Editorial Metadata Labels */}
          <div className="hidden md:flex absolute top-3 left-4 items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/35">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
            <span>PORTRAIT SPEC // ARCHIVE ED. 2026</span>
          </div>

          <div className="hidden md:flex absolute top-3 right-4 items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-white/35">
            <span>RICK BARAT // 22°34'N 88°21'E</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
