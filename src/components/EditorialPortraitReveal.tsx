import React, { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'motion/react';
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

  // Scroll tracking to provide subtle organic light displacement during scrolling
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Track scroll-linked parallax and light drift
  const lightParallaxX = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const portraitScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1.0, 1.03]);

  // Track when portrait enters viewport on scroll with comfortable margin
  const isInView = useInView(containerRef, {
    amount: 0.12,
    once: false,
  });

  // Increment sweepCycle when entering viewport on scroll to trigger the directional light sweep
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
      {/* Editorial Mask Reveal Container powered by CSS clip-path */}
      <motion.div
        key={`mask-${sweepCycle > 0 ? 'active' : 'idle'}`}
        initial={
          prefersReducedMotion
            ? { opacity: 0 }
            : {
                clipPath: 'polygon(0% 100%, 100% 94%, 100% 100%, 0% 100%)',
                opacity: 0.75,
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
                clipPath: 'polygon(0% 100%, 100% 94%, 100% 100%, 0% 100%)',
                opacity: 0.75,
              }
        }
        transition={{
          clipPath: {
            duration: 1.45,
            ease: [0.19, 1, 0.22, 1],
          },
          opacity: {
            duration: 0.85,
            ease: 'easeOut',
          },
        }}
        style={{
          WebkitClipPath: isInView
            ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
            : 'polygon(0% 100%, 100% 94%, 100% 100%, 0% 100%)',
        }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Counter-scaling portrait with subtle ambient parallax */}
        <motion.div
          style={{
            scale: prefersReducedMotion ? 1 : portraitScale,
            backgroundImage: `url("${baseImage}")`,
          }}
          className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat transition-transform duration-700 ease-out"
        />

        {/* Subterranean/Architecture Spotlight Reveal Layer */}
        <RevealLayer
          image={revealImage}
          cursorX={cursorX}
          cursorY={cursorY}
          spotlightRadius={spotlightRadius}
        />

        {/* Directional Light Sweep: An angled, multi-stop specular light beam traversing diagonally across portrait on scroll */}
        {!prefersReducedMotion && (
          <motion.div
            key={`light-sweep-${sweepCycle}`}
            initial={{ x: '-160%', opacity: 0 }}
            animate={
              isInView
                ? {
                    x: '260%',
                    opacity: [0, 0.2, 0.95, 0.95, 0.25, 0],
                  }
                : { x: '-160%', opacity: 0 }
            }
            transition={{
              duration: 1.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-y-0 w-[110%] pointer-events-none z-35 -skew-x-15"
            style={{
              x: lightParallaxX,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.02) 15%, rgba(251, 191, 36, 0.18) 32%, rgba(255, 255, 255, 0.65) 50%, rgba(251, 191, 36, 0.28) 64%, rgba(255, 255, 255, 0.08) 80%, transparent 100%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Secondary soft luminous highlight bloom following the light sweep */}
        {!prefersReducedMotion && (
          <motion.div
            key={`bloom-${sweepCycle}`}
            initial={{ x: '-120%', opacity: 0 }}
            animate={
              isInView
                ? {
                    x: '220%',
                    opacity: [0, 0.1, 0.7, 0.7, 0.12, 0],
                  }
                : { x: '-120%', opacity: 0 }
            }
            transition={{
              duration: 1.7,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 pointer-events-none z-36"
            style={{
              background:
                'radial-gradient(ellipse 75% 55% at 50% 50%, rgba(251, 191, 36, 0.35) 0%, rgba(255, 255, 255, 0.25) 28%, transparent 70%)',
              mixBlendMode: 'screen',
            }}
          />
        )}

        {/* Editorial Leading-Edge Hairline Sweep Accent */}
        {!prefersReducedMotion && isInView && (
          <motion.div
            key={`hairline-${sweepCycle}`}
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: '-5%', opacity: 0 }}
            transition={{
              duration: 1.45,
              ease: [0.19, 1, 0.22, 1],
            }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-300/80 to-transparent pointer-events-none z-37 shadow-[0_0_12px_rgba(251,191,36,0.6)]"
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
