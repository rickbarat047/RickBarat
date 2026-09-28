import React from 'react';
import { Instagram, Github, Mail, ArrowUp } from 'lucide-react';
import { PERSONAL_DATA } from '../data/personalData';
import { useUISounds } from '../hooks/useUISounds';

export const GoodbyeSection: React.FC = () => {
  const { playClick, playHover } = useUISounds();

  const scrollToTop = () => {
    playClick(1000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="goodbye" 
      aria-label="Goodbye"
      className="py-24 sm:py-36 px-6 sm:px-12 md:px-16 border-t border-neutral-900 max-w-5xl mx-auto w-full space-y-16 select-none"
    >
      <div className="space-y-4 max-w-2xl">
        <h2 className="text-4xl sm:text-7xl md:text-8xl font-display font-black text-white tracking-tight leading-[0.95] text-balance">
          {PERSONAL_DATA.goodbye.message}
        </h2>
        <p className="text-lg sm:text-2xl font-serif italic text-amber-200/90 pt-2">
          &ldquo;{PERSONAL_DATA.goodbye.subtext}&rdquo;
        </p>
      </div>

      {/* Identity & Direct Links */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 pt-8 border-t border-neutral-900/80">
        <div className="space-y-1">
          <span className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            {PERSONAL_DATA.name}
          </span>
          <p className="text-xs font-mono text-neutral-400">
            West Bengal, India · Independent Builder
          </p>
        </div>

        {/* Quiet, Human Social Connections */}
        <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-neutral-300">
          <a
            href={PERSONAL_DATA.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover(1400)}
            onClick={() => playClick()}
            className="hover:text-pink-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Instagram className="w-4 h-4 text-pink-400" />
            <span>@rickbarat047</span>
          </a>

          <span className="text-neutral-700 hidden sm:inline">·</span>

          <a
            href={PERSONAL_DATA.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => playHover(1400)}
            onClick={() => playClick()}
            className="hover:text-amber-400 transition-colors flex items-center gap-1.5 py-1"
          >
            <Github className="w-4 h-4" />
            <span>github/rickbarat</span>
          </a>

          <span className="text-neutral-700 hidden sm:inline">·</span>

          <a
            href={`mailto:${PERSONAL_DATA.email}`}
            onMouseEnter={() => playHover(1400)}
            onClick={() => playClick()}
            className="hover:text-white transition-colors flex items-center gap-1.5 py-1 text-neutral-400"
          >
            <Mail className="w-4 h-4" />
            <span>say hi</span>
          </a>
        </div>
      </div>

      {/* Minimal Footer Signature */}
      <div className="pt-6 flex justify-between items-center text-xs font-mono text-neutral-400 border-t border-neutral-900/60">
        <span>RICK&apos;S LITTLE CORNER · 2026</span>
        <button
          type="button"
          onClick={scrollToTop}
          className="hover:text-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1"
        >
          <span>BACK TO TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
};
