import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Choreographed sequence
    const t1 = setTimeout(() => setStep(1), 700);
    const t2 = setTimeout(() => setStep(2), 2000);
    const t3 = setTimeout(() => setStep(3), 3200);
    const t4 = setTimeout(onComplete, 4400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-40 flex flex-col justify-between items-center bg-black text-white p-6 sm:p-12 select-none overflow-hidden"
      >
        {/* Top Header with Skip Button */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-neutral-400">
          <span className="tracking-widest uppercase text-[11px] text-neutral-500">
            ENTRY SEQUENCE
          </span>
          <button
            type="button"
            onClick={onComplete}
            className="px-3 py-1.5 rounded-full border border-neutral-800 text-[11px] font-mono tracking-wider uppercase text-neutral-300 hover:text-white hover:border-amber-400/60 transition-colors cursor-pointer"
          >
            SKIP →
          </button>
        </div>

        {/* Ambient Spatial Centerpiece */}
        <div className="relative my-auto flex flex-col items-center justify-center text-center max-w-2xl px-4">
          {/* Subtle background light ring */}
          <div className="absolute -inset-24 rounded-full bg-gradient-to-tr from-amber-500/10 via-amber-200/5 to-transparent blur-3xl pointer-events-none" />

          {step === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
              className="space-y-2"
            >
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400/90 block">
                WELCOME
              </span>
              <p className="text-3xl sm:text-5xl font-serif italic text-neutral-200">
                to a personal corner
              </p>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.7 }}
              className="space-y-4"
            >
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-neutral-400 block">
                CURIOSITY · CODE · CRAFT
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold tracking-tight text-white uppercase">
                Exploring Ideas
              </h2>
            </motion.div>
          )}

          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-3"
            >
              <span className="text-xs font-mono tracking-[0.3em] uppercase text-amber-400 block">
                INITIATING 3D SPATIAL WORLD
              </span>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white uppercase">
                Enter The Sphere
              </h2>
            </motion.div>
          )}
        </div>

        {/* Bottom Status Track */}
        <div className="w-full flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>DRAG & SCROLL INTERACTIVE</span>
          <span className="animate-pulse text-amber-400">● LIVE</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
