import React from 'react';
import { PERSONAL_DATA } from '../data/personalData';

export const CurrentlySection: React.FC = () => {
  return (
    <section 
      id="currently" 
      aria-label="What I'm doing right now"
      className="py-28 sm:py-40 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none overflow-hidden"
    >
      <div className="space-y-14 sm:space-y-20">
        
        {/* Section Tag */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-amber-400 font-bold">03</span>
          <span className="text-neutral-700">/</span>
          <span>SNAPSHOT IN TIME</span>
        </div>

        {/* Enormous "RIGHT NOW" Headline */}
        <div className="space-y-2">
          <h2 className="text-[17vw] sm:text-[12vw] md:text-[10vw] font-display font-black text-white tracking-tighter leading-[0.88] uppercase block">
            RIGHT
            <br />
            NOW...
          </h2>
          <p className="text-sm sm:text-base font-mono text-neutral-400 max-w-md pt-2">
            A small live snapshot of what&apos;s currently occupying my mind, screen, and desk.
          </p>
        </div>

        {/* Pinned Editorial Notes (Asymmetric / Organic Composition) */}
        <div className="space-y-6 sm:space-y-8 pt-4">
          {PERSONAL_DATA.currently.map((item, idx) => (
            <div 
              key={item.category}
              className={`flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-8 pb-6 border-b border-neutral-900 group ${
                idx % 2 === 1 ? 'sm:pl-6' : ''
              }`}
            >
              {/* Category Marker with subtle pin dot */}
              <div className="flex items-center gap-2 shrink-0 sm:w-44">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
                <span className="text-xs font-mono text-neutral-400 tracking-widest uppercase">
                  {item.category}
                </span>
              </div>

              {/* Title & Human Detail */}
              <div className="flex-1 space-y-1">
                <span className="text-2xl sm:text-4xl font-display font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight block">
                  {item.item}
                </span>
                {item.detail && (
                  <p className="text-xs sm:text-sm font-mono text-neutral-400">
                    {item.detail}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
