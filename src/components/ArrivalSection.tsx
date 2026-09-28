import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_DATA } from '../data/personalData';
import { useUISounds } from '../hooks/useUISounds';

export const ArrivalSection: React.FC = () => {
  const { playClick, playPop, playHover } = useUISounds();
  const [interacted, setInteracted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTouchSecret = () => {
    playPop();
    setInteracted(true);
  };

  const scrollToNext = () => {
    playClick(1000);
    const target = document.getElementById('who-am-i');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Parallax subtle shifts
  const shiftY = Math.min(scrollY * 0.15, 60);

  return (
    <section 
      id="arrival"
      className="relative min-h-[96svh] sm:min-h-screen flex flex-col justify-between px-6 sm:px-12 md:px-16 pt-24 pb-12 w-full max-w-5xl mx-auto select-none overflow-hidden"
    >
      {/* Editorial Top Meta Track */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-mono text-neutral-400 tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-neutral-300">RICK BARAT</span>
          <span className="text-neutral-600">/</span>
          <span>2026</span>
        </div>
        <div className="text-neutral-400 hidden sm:block">
          PERSONAL CORNER
        </div>
      </div>

      {/* Hero Typography Centerpiece */}
      <div className="my-auto py-12 sm:py-16 space-y-6">
        
        {/* Monumental Editorial Headline */}
        <div 
          className="space-y-1 sm:space-y-2"
          style={{ transform: `translateY(-${shiftY}px)` }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col"
          >
            <span className="text-[17vw] sm:text-[13vw] md:text-[11vw] font-display font-extrabold text-white tracking-tighter leading-[0.88] uppercase block">
              HEY,
            </span>
            <span className="text-[17vw] sm:text-[13vw] md:text-[11vw] font-display font-extrabold text-white tracking-tighter leading-[0.88] uppercase block">
              I&apos;M
            </span>
            <span className="text-[19vw] sm:text-[14vw] md:text-[12vw] font-display font-black text-white tracking-tighter leading-[0.85] uppercase block text-amber-400">
              RICK.
            </span>
          </motion.div>
        </div>

        {/* Secondary Editorial Sentence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="pt-2 max-w-xl"
        >
          <p className="text-2xl sm:text-4xl md:text-5xl font-serif italic text-neutral-300 leading-snug tracking-tight">
            &ldquo;welcome to my little corner of the internet.&rdquo;
          </p>
        </motion.div>

        {/* Small Handcrafted Detail & Touch Interaction */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-4 flex items-center gap-3"
        >
          <button
            type="button"
            onClick={handleTouchSecret}
            onMouseEnter={() => playHover(1400)}
            className="group inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer py-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-600 group-hover:bg-amber-400 transition-colors" />
            <span>
              {interacted 
                ? "Glad you stopped by · Made with curiosity" 
                : "A personal space · Tap for a smile"}
            </span>
          </button>
        </motion.div>

      </div>

      {/* Bottom Editorial Coordinates & Scroll Indicator */}
      <div className="flex items-end justify-between border-t border-neutral-900 pt-6 text-xs font-mono text-neutral-400">
        <div>
          <span>WEST BENGAL, IN</span>
        </div>

        <button
          type="button"
          onClick={scrollToNext}
          className="hover:text-white transition-colors flex items-center gap-2 cursor-pointer group py-1"
        >
          <span>scroll to explore</span>
          <span className="inline-block transform group-hover:translate-y-1 transition-transform text-amber-400">
            ↓
          </span>
        </button>
      </div>
    </section>
  );
};
