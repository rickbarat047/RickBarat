import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Menu as MenuIcon, ArrowUpRight } from 'lucide-react';

interface FullscreenMenuProps {
  onNavigate: (target: 'about' | 'world' | 'right-now' | 'projects' | 'explore') => void;
  isExploreMode: boolean;
  onToggleExplore: () => void;
}

export const FullscreenMenu: React.FC<FullscreenMenuProps> = ({
  onNavigate,
  isExploreMode,
  onToggleExplore
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "ABOUT", sublabel: "Who is Rick?", target: "about" as const, num: "01" },
    { label: "MY WORLD", sublabel: "3D Spatial Sphere", target: "world" as const, num: "02" },
    { label: "RIGHT NOW", sublabel: "2026 Focus & Experiments", target: "right-now" as const, num: "03" },
    { label: "THINGS I'VE BUILT", sublabel: "Munjoy & AutoTube", target: "projects" as const, num: "04" },
    { label: "EXPLORE", sublabel: "Flat Grid Mode", target: "explore" as const, num: "05" },
  ];

  const handleItemClick = (target: 'about' | 'world' | 'right-now' | 'projects' | 'explore') => {
    setIsOpen(false);
    onNavigate(target);
  };

  return (
    <>
      {/* Minimal Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between pointer-events-auto select-none backdrop-blur-[2px]">
        {/* Left: Rick Barat */}
        <button
          type="button"
          onClick={() => {
            if (isExploreMode) onToggleExplore();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-center gap-2 text-left cursor-pointer focus:outline-none"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:scale-125 transition-transform" />
          <span className="font-display font-extrabold text-base sm:text-lg tracking-tight text-white uppercase group-hover:text-amber-300 transition-colors">
            Rick Barat
          </span>
        </button>

        {/* Right: Mode Toggle + Menu Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onToggleExplore}
            className="px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-[11px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all cursor-pointer hidden sm:inline-flex items-center gap-2"
          >
            <span>{isExploreMode ? '3D Sphere' : 'Explore [Grid]'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-xs font-mono uppercase tracking-wider text-neutral-300 hover:text-white transition-all cursor-pointer"
            aria-label="Open Fullscreen Menu"
          >
            <span>Menu</span>
            <MenuIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors" />
          </button>
        </div>
      </header>

      {/* Fullscreen Overlay Animated via Clip-Path */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-black text-white p-6 sm:p-12 flex flex-col justify-between overflow-y-auto select-none"
          >
            {/* Top Close Header */}
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-6">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>RICK BARAT / NAVIGATION</span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Monumental Nav Typography List */}
            <div className="my-auto py-12 max-w-4xl mx-auto w-full space-y-4 sm:space-y-6">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.target}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + idx * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => handleItemClick(item.target)}
                    className="group w-full flex items-baseline justify-between text-left py-2 border-b border-neutral-900 hover:border-neutral-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-baseline gap-4 sm:gap-8">
                      <span className="text-xs sm:text-sm font-mono text-amber-400/80 font-bold">
                        {item.num}
                      </span>
                      <span className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-neutral-300 group-hover:text-white uppercase transition-colors">
                        {item.label}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-500 group-hover:text-amber-400 transition-colors">
                      <span>{item.sublabel}</span>
                      <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Bottom Connect / Social Links */}
            <div className="border-t border-neutral-900 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-6">
                <a
                  href="https://www.instagram.com/rickbarat047/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  INSTAGRAM ↗
                </a>
                <a
                  href="https://github.com/rickbarat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  GITHUB ↗
                </a>
                <a
                  href="mailto:rickbarat21@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  EMAIL ↗
                </a>
              </div>

              <div className="text-neutral-500">
                WEST BENGAL, IN · 2026
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
