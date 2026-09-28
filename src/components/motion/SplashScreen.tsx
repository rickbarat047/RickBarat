import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Preload key images in parallel with progress bar
    const imageUrls = [
      '/src/assets/images/munjoy_preview_1790612699399.jpg',
      '/src/assets/images/autotube_preview_1790611524328.jpg',
      '/src/assets/images/creative_corner_art_1790612718363.jpg'
    ];

    imageUrls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    const startTime = performance.now();
    const duration = 1600; // 1.6s smooth cinematic hold

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 350);
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black text-white px-6 py-12 select-none overflow-hidden"
      >
        {/* Top Minimal Coordinates */}
        <div className="w-full max-w-5xl flex items-center justify-between text-[11px] font-mono tracking-widest text-neutral-500 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>RICK BARAT</span>
          </div>
          <span>2026 / WEST BENGAL</span>
        </div>

        {/* Centerpiece Monolithic Typography */}
        <div className="text-center space-y-4 my-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-display font-extrabold tracking-tight text-white uppercase">
              Rick Barat
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-xs sm:text-sm font-mono tracking-[0.3em] uppercase text-neutral-400"
          >
            A Little Corner of the Internet
          </motion.p>
        </div>

        {/* Bottom Loading Progress Indicator */}
        <div className="w-full max-w-xs space-y-3">
          <div className="w-full h-[1.5px] bg-neutral-900 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-amber-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
            <span>SPATIAL EXPERIENCE</span>
            <span>{progress}%</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
