import React from 'react';
import { Camera, Sparkles } from 'lucide-react';
import { PERSONAL_DATA } from '../data/personalData';

export const PortraitMomentSection: React.FC = () => {
  return (
    <section 
      id="portrait-moment" 
      aria-label="Rick's creative space"
      className="py-20 sm:py-36 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none"
    >
      <div className="space-y-6">
        
        {/* Subtle section label */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <span>THE SPACE BEHIND THE CODE</span>
          <span>EST. 2026</span>
        </div>

        {/* Cinematic Masked Creative Space / Portrait Frame */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[4/3] sm:aspect-[16/9] shadow-2xl group">
          <img 
            src={PERSONAL_DATA.portraitPlaceholder.image} 
            alt="Rick's Creative Space"
            className="w-full h-full object-cover filter brightness-90 group-hover:scale-102 transition-transform duration-700"
          />

          {/* Vignette Scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Editorial Caption Tag */}
          <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Camera className="w-3.5 h-3.5" />
                <span>{PERSONAL_DATA.portraitPlaceholder.subcaption}</span>
              </span>
              <p className="text-base sm:text-xl font-serif italic text-white">
                &ldquo;{PERSONAL_DATA.portraitPlaceholder.caption}&rdquo;
              </p>
            </div>

            <div className="text-[11px] font-mono text-neutral-400 self-start sm:self-auto bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              Personal image placeholder
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
