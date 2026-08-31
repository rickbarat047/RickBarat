import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, ArrowRight, Zap, ShieldCheck, Volume2, Sparkles } from 'lucide-react';
import { 
  playBootSound, 
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
  const [isReadyToLaunch, setIsReadyToLaunch] = useState(false);
  const bootSoundPlayed = useRef(false);
  const completedRef = useRef(false);

  const finishIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setIsFinishing(true);
    // Smooth transition window matching Motion exit duration
    setTimeout(() => {
      onComplete();
    }, 650);
  }, [onComplete]);

  // Synchronous gesture audio trigger (works on iOS Safari & Chrome Mobile)
  const handleLaunchWithSound = useCallback((e?: React.SyntheticEvent | Event) => {
    if (e) {
      e.stopPropagation();
    }
    // Synchronously unlock and resume Web Audio hardware inside user event stack
    unlockAudioContext();

    if (!bootSoundPlayed.current) {
      bootSoundPlayed.current = true;
      playBootSound();
    }

    finishIntro();
  }, [finishIntro]);

  // Boot sequence timer and progress ticker
  useEffect(() => {
    // If desktop browser already allows unlocked audio, trigger boot sound
    if (isAudioUnlocked()) {
      if (!bootSoundPlayed.current && getSoundState()) {
        bootSoundPlayed.current = true;
        playBootSound();
      }
    }

    // Subscribe to unlock event in case audio context was suspended on initial load
    const unsubscribe = onAudioUnlocked(() => {
      if (!bootSoundPlayed.current && getSoundState()) {
        bootSoundPlayed.current = true;
        playBootSound();
      }
    });

    const startTime = Date.now();
    const duration = 1200; // Snappy 1.2s ticker

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
        setIsReadyToLaunch(true);

        // If audio is already unlocked (desktop or early gesture), finish smoothly
        if (isAudioUnlocked()) {
          setTimeout(() => {
            finishIntro();
          }, 350);
        } else {
          // On mobile phones waiting for tap, give up to 3s before auto-advancing
          setTimeout(() => {
            if (!completedRef.current) {
              finishIntro();
            }
          }, 3200);
        }
      }
    }, 25);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        handleLaunchWithSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      unsubscribe();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [finishIntro, handleLaunchWithSound]);

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
          // Direct touch & pointer events on entire screen to guarantee instant mobile audio activation
          onTouchStart={handleLaunchWithSound}
          onPointerDown={handleLaunchWithSound}
          onClick={handleLaunchWithSound}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 select-none overflow-hidden cursor-pointer pointer-events-auto touch-manipulation"
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
              className="relative mb-5"
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
              className="space-y-1 mb-5"
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
            <div className="w-full bg-neutral-900/80 border border-neutral-800 rounded-xl p-3.5 sm:p-4 backdrop-blur-md shadow-lg space-y-3">
              
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
                  AUDIO_SYNTH_READY
                </span>
                <span className="flex items-center gap-1 text-cyan-400/80">
                  <ShieldCheck className="w-3 h-3" />
                  GPU_READY
                </span>
              </div>
            </div>

            {/* Primary Interactive Mobile Touch Trigger */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-5 w-full"
            >
              <button
                id="intro-enter-portfolio-btn"
                type="button"
                onTouchStart={handleLaunchWithSound}
                onPointerDown={handleLaunchWithSound}
                onClick={handleLaunchWithSound}
                className={`w-full py-2.5 px-4 rounded-xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-mono font-bold tracking-wide transition-all cursor-pointer shadow-lg active:scale-95 ${
                  isReadyToLaunch
                    ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 text-neutral-950 border-amber-300 shadow-amber-500/25 animate-pulse'
                    : 'bg-neutral-900/90 text-amber-300 border-amber-400/30 hover:border-amber-400 hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-current animate-spin [animation-duration:3s]" />
                <span>{isReadyToLaunch ? 'ENTER PORTFOLIO WITH SOUND' : 'INITIALIZE AUDIO & ENTER'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-current" />
              </button>
            </motion.div>

            {/* Subtle Helper Subtitle */}
            <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono text-neutral-400">
              <Volume2 className="w-3 h-3 text-amber-400" />
              <span>Tap anywhere on screen to launch</span>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
