import React from 'react';
import { PERSONAL_DATA } from '../data/personalData';

export const PersonalMomentSection: React.FC = () => {
  return (
    <section 
      id="personal-moment" 
      aria-label="A personal moment"
      className="py-24 sm:py-40 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none"
    >
      <div className="space-y-6 sm:space-y-8 max-w-3xl">
        
        {/* Soft Heading */}
        <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
          IN SHORT
        </span>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05]">
          {PERSONAL_DATA.personalMoment.heading}
        </h2>

        {/* Intimate Closing Thought */}
        <p className="text-2xl sm:text-4xl font-serif italic text-neutral-300 leading-relaxed text-balance">
          &ldquo;{PERSONAL_DATA.personalMoment.text}&rdquo;
        </p>

      </div>
    </section>
  );
};
