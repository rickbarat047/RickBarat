import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useUISounds } from '../hooks/useUISounds';

interface InterestItem {
  id: string;
  lead: string;
  detail: string;
  italic?: boolean;
  fontClass: string;
  sizeClass: string;
}

export const InterestsWallSection: React.FC = () => {
  const { playPop, playHover } = useUISounds();
  const [activeInterest, setActiveInterest] = useState<string | null>(null);

  const interests: InterestItem[] = [
    {
      id: "building",
      lead: "BUILDING THINGS",
      detail: "Taking an idea and turning it into something people can actually click, use and experience.",
      italic: false,
      fontClass: "font-display font-extrabold",
      sizeClass: "text-4xl sm:text-7xl md:text-8xl"
    },
    {
      id: "gaming",
      lead: "PLAYING GAMES",
      detail: "PCs, games, performance and probably more hardware tweaking than necessary.",
      italic: true,
      fontClass: "font-serif italic font-normal text-amber-200",
      sizeClass: "text-3xl sm:text-6xl md:text-7xl"
    },
    {
      id: "experimenting",
      lead: "EXPERIMENTING",
      detail: "Testing AI, automation, workflows and ways to make computers handle the repetitive work.",
      italic: false,
      fontClass: "font-display font-black tracking-wide",
      sizeClass: "text-4xl sm:text-6xl md:text-7xl text-neutral-300"
    },
    {
      id: "learning",
      lead: "LEARNING RANDOM STUFF",
      detail: "Always something new to break, understand, take apart and rebuild from scratch.",
      italic: true,
      fontClass: "font-serif italic font-normal text-amber-300/90",
      sizeClass: "text-3xl sm:text-6xl md:text-7xl"
    },
    {
      id: "making-good",
      lead: "MAKING THINGS LOOK GOOD",
      detail: "Visuals, websites, clean typography and anything that lets me craft something with care.",
      italic: false,
      fontClass: "font-display font-black",
      sizeClass: "text-4xl sm:text-7xl md:text-8xl text-white"
    }
  ];

  return (
    <section 
      id="interests-wall" 
      aria-label="What I like"
      className="py-28 sm:py-44 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none overflow-hidden"
    >
      <div className="space-y-12 sm:space-y-16">
        
        {/* Editorial Section Marker */}
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold">02</span>
            <span className="text-neutral-700">/</span>
            <span>FACETS & OBSESSIONS</span>
          </div>
          <span className="hidden sm:inline">TAP ANY PHRASE</span>
        </div>

        {/* Lead-in Typography */}
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-2">
            IN GENERAL
          </span>
          <h2 className="text-6xl sm:text-9xl md:text-[10rem] font-display font-black text-neutral-800 tracking-tighter leading-none uppercase">
            I LIKE
          </h2>
        </div>

        {/* Visual Wall of Floating/Staggered Editorial Phrases */}
        <div className="space-y-8 sm:space-y-12 pt-4">
          {interests.map((item, idx) => {
            const isSelected = activeInterest === item.id;

            return (
              <div 
                key={item.id}
                onClick={() => {
                  playPop();
                  setActiveInterest(isSelected ? null : item.id);
                }}
                onMouseEnter={() => playHover(1350 + idx * 70)}
                className={`transition-all duration-300 cursor-pointer group ${
                  idx % 2 === 1 ? 'sm:translate-x-6 md:translate-x-12' : ''
                }`}
              >
                {/* Main Phrase Line */}
                <div className="flex items-baseline gap-3">
                  <span className={`${item.sizeClass} ${item.fontClass} tracking-tight leading-[0.95] block transition-all duration-300 group-hover:text-amber-400 group-hover:translate-x-2`}>
                    {item.lead}
                  </span>
                </div>

                {/* Expanded Micro-Thought */}
                {isSelected ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="pt-3 max-w-xl pl-2 border-l border-amber-400/60 ml-1 mt-2"
                  >
                    <p className="text-sm sm:text-base font-mono text-neutral-300 leading-relaxed">
                      ↳ &ldquo;{item.detail}&rdquo;
                    </p>
                  </motion.div>
                ) : (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-mono text-neutral-400 pt-1.5 pl-1 hidden sm:block">
                    ↳ &ldquo;{item.detail}&rdquo;
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
