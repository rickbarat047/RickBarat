import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { PERSONAL_DATA } from '../data/personalData';
import { useUISounds } from '../hooks/useUISounds';

export const PersonalNav: React.FC = () => {
  const { soundEnabled, toggleSound, playClick, playHover, playSwitch } = useUISounds();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSound = () => {
    const next = toggleSound();
    if (next) playSwitch();
  };

  const scrollTo = (id: string) => {
    playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 sm:px-12 md:px-16 py-4 ${
        isScrolled 
          ? 'bg-neutral-950/80 backdrop-blur-md border-b border-white/5 py-3' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Name / Home link */}
        <button
          type="button"
          onClick={() => {
            playClick(900);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-white text-base sm:text-lg font-display font-bold tracking-tight hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Rick</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        </button>

        {/* Minimal Navigation & Links */}
        <div className="flex items-center gap-3 sm:gap-5">
          <nav className="hidden sm:flex items-center gap-4 text-xs font-mono text-neutral-400">
            <button 
              type="button" 
              onClick={() => scrollTo('who-am-i')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Who
            </button>
            <button 
              type="button" 
              onClick={() => scrollTo('things-i-built')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Built
            </button>
            <button 
              type="button" 
              onClick={() => scrollTo('currently')} 
              className="hover:text-white transition-colors cursor-pointer"
            >
              Right Now
            </button>
          </nav>

          {/* Instagram Link */}
          <a
            href={PERSONAL_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover(1400)}
            onClick={() => playClick()}
            aria-label="Rick on Instagram"
            className="p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={soundEnabled ? "Mute sounds" : "Enable tactile sounds"}
            className="p-2 rounded-full text-neutral-400 hover:text-amber-400 hover:bg-white/10 transition-colors cursor-pointer"
            title={soundEnabled ? "Sounds on" : "Sounds muted"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
