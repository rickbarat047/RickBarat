import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ArrowRight, Zap, ShieldCheck, Volume2 } from 'lucide-react';
import { 
  playBootSound, 
  playClickSound, 
  getSoundState, 
  unlockAudioContext, 
  isAudioUnlocked,
  onAudioUnlocked 
} from '../utils/soundEffects';

interface IntroAnimationProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING_CORE_SYSTEMS',
  'COMPILING_WEBGL_SHADERS',
  'SYNCING_INTELLIGENCE_LAYER',
  'HYDRATING_INTERFACES',
  'PORTFOLIO_READY'
];

export const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const bootSoundPlayed = useRef(false);

  const finishIntro = useCallback(() => {
    if (isFinishing) return;
    setIsFinishing(true);
    // Smooth transition window matching Motion exit duration
    setTimeout(() => {
      onComplete();
    }, 650);
  }, [isFinishing, onComplete]);

  // Handle playing boot sound with mobile unlock awareness
  const triggerBootAudio = useCallback(() => {
    if (bootSoundPlayed.current) return;
    if (!getSoundState()) return;

    unlockAudioContext();
    playBootSound();
    bootSoundPlayed.current = true;
  }, []);

  // Boot sequence timer and progress ticker
  useEffect(() => {
    // Attempt playback immediately for browsers that allow it
    if (isAudioUnlocked() || getSoundState()) {
      triggerBootAudio();
    }

    // Subscribe to mobile unlock event in case audio context was suspended on load
    const unsubscribe = onAudioUnlocked(() => {
      triggerBootAudio();
    });

    const startTime = Date.now();
    const duration = 1600; // Snappy ~1.6s

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(100, Math.floor((elapsed / duration) * 100));

      setProgress(rawProgress);

      const logIdx = Math.min(
        BOOT_LOGS.length - 1,
        Math.floor((rawProgress / 100) * BOOT_LOGS.length)
      );
      setCurrentLogIndex(logIdx);

      if (rawProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          finishIntro();
        }, 180);
      }
    }, 25);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        triggerBootAudio();
        playClickSound(880);
        clearInterval(interval);
        finishIntro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finishIntro, triggerBootAudio]);

  const handleInteraction = () => {
    unlockAudioContext();
    if (!bootSoundPlayed.current) {
      triggerBootAudio();
    } else {
      playClickSound(850);
    }
    finishIntro();
  };

  return (
    <AnimatePresence>
      {!isFinishing && (
        <motion.div
          id="intro-animation-overlay"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 select-none overflow-hidden cursor-pointer pointer-events-auto"
          onClick={handleInteraction}
        >
          {/* Ambient Background Cybernetic Grid & Glows that smoothly scale out */}
          <motion.div 
            exit={{ opacity: 0, scale: 1.2, transition: { duration: 0.6 } }}
            className="absolute inset-0 bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" 
          />
          <motion.div 
            exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.5 } }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" 
          />
          <motion.div 
            exit={{ opacity: 0, scale: 1.4, transition: { duration: 0.5 } }}
            className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse [animation-delay:1s]" 
          />

          {/* Curtain Split Elements for Ultra-Cinematic Transition */}
          <motion.div 
            exit={{ 
              y: '-100%',
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
            }}
            className="absolute inset-x-0 top-0 h-1/2 bg-neutral-950/95 pointer-events-none border-b border-amber-400/20"
          />
          <motion.div 
            exit={{ 
              y: '100%',
              transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
            }}
            className="absolute inset-x-0 bottom-0 h-1/2 bg-neutral-950/95 pointer-events-none border-t border-amber-400/20"
          />

          {/* Center Content Box with Staggered Motion Exit */}
          <motion.div 
            exit={{ 
              scale: 0.92, 
              opacity: 0,
              y: -20,
              filter: 'blur(12px)',
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
            }}
            className="relative z-20 w-full max-w-md px-6 flex flex-col items-center text-center"
          >
            
            {/* 3D Wireframe Glowing Monogram */}
            <motion.div
              initial={{ scale: 0.75, opacity: 0, rotateY: -70 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-6"
            >
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-r from-amber-500/30 via-cyan-500/20 to-amber-500/30 blur-md animate-pulse" />
              
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-neutral-900/90 border border-neutral-800 backdrop-blur-xl shadow-2xl flex items-center justify-center overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent opacity-60" />
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
                
                <div className="font-mono font-black text-2xl sm:text-3xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-100 to-amber-400">
                  RB<span className="text-cyan-400 text-xl font-normal">.</span>
                </div>

                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-amber-400/60" />
                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-amber-400/60" />
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-amber-400/60" />
                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-amber-400/60" />
              </div>
            </motion.div>

            {/* Name & Title Display */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.4 }}
              className="space-y-1.5 mb-7"
            >
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest bg-amber-400/10 text-amber-300 border border-amber-400/20 mb-1">
                <Zap className="w-3 h-3 text-amber-400 animate-bounce" />
                <span>Creative Engineering v2.5</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100">
                Rick Barat
              </h1>
              <p className="text-xs sm:text-sm font-mono text-neutral-400">
                Full-Stack & 3D WebGL Architect
              </p>
            </motion.div>

            {/* Terminal Progress Box */}
            <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 backdrop-blur-md shadow-lg space-y-3">
              
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-amber-300/90 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                  <span className="truncate text-[11px]">
                    &gt; {BOOT_LOGS[currentLogIndex]}
                  </span>
                </div>
                <div className="font-bold text-neutral-200 text-xs shrink-0 ml-2">
                  {progress}%
                </div>
              </div>

              {/* Glowing High-Speed Progress Bar */}
              <div className="relative w-full h-1.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800/80">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'linear' }}
                />
              </div>

              {/* System Specs Micro-Tags */}
              <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 pt-1 border-t border-neutral-800/50">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-neutral-400" />
                  NEXT_GEN_WEB
                </span>
                <span className="flex items-center gap-1 text-cyan-400/80">
                  <ShieldCheck className="w-3 h-3" />
                  GPU_READY
                </span>
              </div>
            </div>

            {/* Skip / Touch Prompt Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.25 }}
              className="mt-6 flex items-center justify-center flex-wrap gap-2 text-[11px] font-mono text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <span className="inline-flex items-center gap-1 text-amber-300/90">
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                Tap anywhere to enter
              </span>
              <span className="hidden sm:inline text-neutral-600">/</span>
              <span className="hidden sm:inline-flex items-center gap-1">
                press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 text-[10px]">ESC</kbd> to skip
              </span>
              <ArrowRight className="w-3 h-3 text-amber-400 animate-pulse" />
            </motion.div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
