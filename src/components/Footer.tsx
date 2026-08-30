import React from 'react';
import { ArrowUp, Github, Instagram, MessageCircle, Heart, Sparkles, Terminal, Zap } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playClickSound } from '../utils/soundEffects';

interface FooterProps {
  onReplayIntro?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onReplayIntro }) => {
  const scrollToTop = () => {
    playClickSound(1000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-900">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-neutral-950 font-bold font-display text-sm shadow-md shadow-amber-500/20">
                RB
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-display">
                {PERSONAL_INFO.name}
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm text-xs leading-relaxed">
              Full Stack Engineer & Creative Technologist crafting zero-lag distributed web systems and thoughtful design interactions.
            </p>
          </div>

          {/* System Status Pill, Replay Intro & Back to Top */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.98%)</span>
            </div>

            {onReplayIntro && (
              <button
                id="footer-replay-intro-btn"
                type="button"
                onClick={() => {
                  playClickSound(850);
                  onReplayIntro();
                }}
                className="px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-400/30 transition-colors flex items-center gap-1.5 font-mono text-[11px]"
                title="Replay System Intro Animation"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Replay Intro</span>
              </button>
            )}

            <button
              id="footer-back-to-top-btn"
              type="button"
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-neutral-700 transition-colors flex items-center gap-1.5"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-mono">Top</span>
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-neutral-500">
          <div>
            © {new Date().getFullYear()} {PERSONAL_INFO.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <a 
              href={PERSONAL_INFO.socials.instagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span>•</span>
            <a 
              href={PERSONAL_INFO.socials.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-amber-400 transition-colors"
            >
              GitHub
            </a>
            <span>•</span>
            <a 
              href={`mailto:${PERSONAL_INFO.email}`} 
              className="hover:text-amber-400 transition-colors"
            >
              {PERSONAL_INFO.email}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
