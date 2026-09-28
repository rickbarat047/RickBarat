import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PERSONAL_DATA } from '../data/personalData';
import { useUISounds } from '../hooks/useUISounds';

export const WhoAmISection: React.FC = () => {
  const { playPop, playHover } = useUISounds();
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  const words = [
    { word: "BUILD", phrase: "Turning ideas into tangible reality" },
    { word: "CREATE", phrase: "Websites, design & visual rhythms" },
    { word: "LEARN", phrase: "Endless curiosity about how things work" },
    { word: "EXPERIMENT", phrase: "Testing tools, models & automation" },
  ];

  return (
    <section 
      id="who-am-i" 
      aria-label="Who am I?"
      className="py-28 sm:py-40 px-6 sm:px-12 md:px-16 max-w-5xl mx-auto w-full select-none"
    >
      <div className="space-y-16 sm:space-y-24">
        
        {/* Subtle Section Index Header */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
          <span className="text-amber-400 font-bold">01</span>
          <span className="text-neutral-700">/</span>
          <span>AN INTRODUCTION</span>
        </div>

        {/* Transition Typography: "WHO?" -> "WHO AM I?" */}
        <div className="space-y-2">
          <span className="text-[13vw] sm:text-[9vw] font-display font-black text-neutral-800 tracking-tighter leading-none uppercase block select-none">
            WHO?
          </span>
          <h2 className="text-4xl sm:text-7xl md:text-8xl font-display font-extrabold text-white tracking-tight leading-[0.95] text-balance">
            So... who am I?
          </h2>
        </div>

        {/* Distributed Editorial Paragraph */}
        <div className="space-y-10 sm:space-y-14 text-2xl sm:text-4xl md:text-5xl font-sans font-light leading-[1.3] text-neutral-300 max-w-3xl">
          <p>
            I&apos;m <span className="text-white font-medium">Rick Barat</span>, a BCA graduate from{' '}
            <span className="font-serif italic text-amber-200">West Bengal</span>.
          </p>

          <p className="text-neutral-400 leading-[1.35]">
            I enjoy taking raw concepts and turning them into things that feel good to use. I get completely absorbed in ideas that catch my interest.
          </p>
        </div>

        {/* Interactive Emphasized Words Stream: BUILD, CREATE, LEARN, EXPERIMENT */}
        <div className="pt-8 border-t border-neutral-900/80">
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6">
            WHAT DRIVES ME · TAP TO EXPLORE
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 sm:gap-x-10 gap-y-4">
            {words.map((item) => {
              const isActive = highlightedWord === item.word;

              return (
                <button
                  key={item.word}
                  type="button"
                  onClick={() => {
                    playPop();
                    setHighlightedWord(isActive ? null : item.word);
                  }}
                  onMouseEnter={() => playHover(1400)}
                  className="group text-left transition-all cursor-pointer focus:outline-none"
                >
                  <span className={`text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-tight transition-all duration-300 block ${
                    isActive 
                      ? 'text-amber-400 scale-105' 
                      : 'text-neutral-500 hover:text-white'
                  }`}>
                    {item.word}
                  </span>
                  
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="block text-xs font-mono text-amber-300/90 pt-1 tracking-normal"
                    >
                      ↳ {item.phrase}
                    </motion.span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
