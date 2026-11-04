import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react';

interface MenuItem {
  label: string;
  sublabel: string;
  target: 'about' | 'world' | 'right-now' | 'projects' | 'explore';
  num: string;
}

interface FullscreenMenuProps {
  onNavigate: (target: 'about' | 'world' | 'right-now' | 'projects' | 'explore') => void;
  isExploreMode: boolean;
  onToggleExplore: () => void;
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({
  onNavigate,
  isExploreMode,
  onToggleExplore,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems: MenuItem[] = [
    { label: 'ABOUT', sublabel: 'Who is Rick?', target: 'about', num: '01' },
    { label: 'MY WORLD', sublabel: '3D Spatial Sphere', target: 'world', num: '02' },
    { label: 'RIGHT NOW', sublabel: '2026 Focus & Experiments', target: 'right-now', num: '03' },
    { label: 'THINGS I\'VE BUILT', sublabel: 'Verified Real Projects', target: 'projects', num: '04' },
    { label: 'EXPLORE', sublabel: 'Flat Grid Mode', target: 'explore', num: '05' },
  ];

  const handleItemClick = (target: MenuItem['target']) => {
    setIsOpen(false);
    onNavigate(target);
  };

  return (
    <>
      {/* Minimal editorial header bar */}
      <header className="fixed top-0 left-0 right-0 z-[60] px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between select-none">
        <button
          type="button"
          onClick={() => {
            if (isExploreMode) onToggleExplore();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-3 text-left cursor-pointer bg-transparent border-none focus:outline-none"
          aria-label="Go to top or toggle explore mode"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 transition-transform duration-300 group-hover:scale-125" />
          <span className="font-display font-extrabold text-sm sm:text-base tracking-tight text-white uppercase transition-colors duration-300 group-hover:text-amber-300">
            Rick Barat
          </span>
        </button>

        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleExplore}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900 text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer shadow-editorial"
            aria-label="Toggle explore grid mode"
          >
            <span className="text-[10px] font-mono tracking-[0.12em]">{isExploreMode ? '3D SPHERE' : 'EXPLORE'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open navigation menu"
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950/80 hover:bg-neutral-900 hover:border-neutral-700 text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer shadow-editorial"
          >
            <span>MENU</span>
            <MenuIcon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-amber-400 transition-colors duration-200" />
          </button>
        </div>
      </header>

      {/* Full-screen overlay with editorial dark theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 48px) 48px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 48px) 48px)' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[70] bg-[#020617] text-[#f8fafc] overflow-y-auto select-none"
          >
            {/* Top header within overlay */}
            <div className="flex items-center justify-between px-6 sm:px-10 py-5 sm:py-6 border-b border-neutral-800/60">
              <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>RICK BARAT / NAVIGATION</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Monumental editorial navigation */}
            <nav className="max-w-6xl mx-auto px-6 sm:px-10 py-16 sm:py-24 space-y-2 sm:space-y-4">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.target}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + idx * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.target)}
                    className="group w-full text-left py-3 sm:py-4 border-b border-neutral-800/40 hover:border-neutral-700/80 transition-colors duration-200 cursor-pointer bg-transparent border-none focus:outline-none"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex items-baseline gap-6 sm:gap-10">
                        <span className="font-mono text-xs sm:text-sm text-amber-400/90 font-bold tracking-[0.15em] min-w-[2rem]">
                          {item.num}
                        </span>
                        <span className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-neutral-300 group-hover:text-[#f8fafc] uppercase transition-colors duration-300 leading-none">
                          {item.label}
                        </span>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-2 text-[10px] font-mono text-neutral-600 group-hover:text-amber-400/80 transition-colors duration-200 tracking-[0.12em] shrink-0">
                        <span className="hidden md:inline">{item.sublabel}</span>
                        <ArrowUpRight className="w-4 h-4 group-hover:translate-x-[2px] group-hover:-translate-y-[2px] transition-transform duration-200" />
                      </span>
                    </div>
                  </button>
                </motion.div>
              ))}
            </nav>

            {/* Bottom editorial footer */}
            <div className="border-t border-neutral-800/60 px-6 sm:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-mono text-neutral-600 tracking-[0.15em] uppercase">
              <div className="flex items-center gap-6">
                <a href="https://www.instagram.com/rickbarat047/?hl=en" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">Instagram ↗</a>
                <a href="https://github.com/rickbarat047" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors duration-200">GitHub ↗</a>
                <a href="mailto:rickbarat21@gmail.com" className="hover:text-amber-400 transition-colors duration-200">Email ↗</a>
              </div>
              <span className="text-neutral-700">West Bengal, IN · 2026</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
