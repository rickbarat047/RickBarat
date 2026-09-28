import React from 'react';
import { PERSONAL_DATA } from '../data/personalData';

export const EducationSection: React.FC = () => {
  return (
    <section 
      id="education" 
      aria-label="Formal Education"
      className="py-16 sm:py-28 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none"
    >
      <div className="border-t border-neutral-900 pt-10 sm:pt-14 space-y-4">
        
        {/* Subtle kicker */}
        <p className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
          {PERSONAL_DATA.education.prefix}
        </p>

        {/* Quiet Editorial Line */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 sm:gap-6">
          <div className="space-y-1">
            <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight">
              {PERSONAL_DATA.education.degree}
            </h3>
            <p className="text-base sm:text-lg font-mono text-neutral-400">
              {PERSONAL_DATA.education.institution}
            </p>
          </div>

          <div className="text-xs font-mono text-amber-400/90 sm:text-right">
            CLASS OF {PERSONAL_DATA.education.year}
          </div>
        </div>

      </div>
    </section>
  );
};
