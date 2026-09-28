import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Globe, Cpu, Wrench, Sparkles } from 'lucide-react';
import { WHAT_I_BUILD } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

interface WhatIBuildProps {
  onSelectCategory?: (categoryName: string) => void;
}

export const WhatIBuild: React.FC<WhatIBuildProps> = ({ onSelectCategory }) => {
  const { playHover, playClick } = useUISounds();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getCategoryIcon = (index: number) => {
    switch (index) {
      case 0: return <Globe className="w-5 h-5 text-amber-400" />;
      case 1: return <Cpu className="w-5 h-5 text-amber-400" />;
      case 2: return <Wrench className="w-5 h-5 text-amber-400" />;
      case 3: return <Sparkles className="w-5 h-5 text-amber-400" />;
      default: return null;
    }
  };

  return (
    <section 
      id="what-i-build" 
      aria-label="What I Build"
      className="py-28 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden"
    >
      {/* Subtle fine background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Editorial Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
            <span>Disciplines</span>
            <span className="text-neutral-600">/</span>
            <span>Core Focus</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight text-balance">
            What I Build
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed text-balance">
            Turning technical capability into focused digital products. From reactive user interfaces and AI agent pipelines to dedicated developer tools.
          </p>
        </div>

        {/* Editorial Categories List */}
        <div className="divide-y divide-neutral-800/80 border-y border-neutral-800/80">
          {WHAT_I_BUILD.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.number}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  playHover(1300 + index * 100);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => {
                  playClick(800 + index * 60);
                  if (onSelectCategory) {
                    onSelectCategory(item.title);
                  }
                }}
                className="group relative py-10 sm:py-12 transition-all duration-300 cursor-pointer"
              >
                {/* Subtle row highlight on hover */}
                <div 
                  className={`absolute inset-0 bg-neutral-900/40 -mx-4 sm:-mx-6 px-4 sm:px-6 rounded-2xl transition-opacity duration-300 pointer-events-none ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 sm:gap-8">
                  {/* Left: Index number + Title */}
                  <div className="flex items-start sm:items-center gap-6 sm:gap-10">
                    {/* Animated Index Number */}
                    <span 
                      className={`text-xl sm:text-2xl font-mono transition-all duration-300 ${
                        isHovered 
                          ? 'text-amber-400 font-bold translate-x-1' 
                          : 'text-neutral-500 font-normal'
                      }`}
                    >
                      {item.number}
                    </span>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 group-hover:border-amber-400/40 transition-colors">
                          {getCategoryIcon(index)}
                        </span>
                        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-white group-hover:text-amber-300 transition-colors tracking-tight">
                          {item.title}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="mt-3 text-neutral-400 text-sm sm:text-base max-w-xl leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right: Technologies list & Arrow */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 sm:gap-8 pl-12 lg:pl-0">
                    <div className="flex flex-wrap gap-2 text-xs font-mono text-neutral-400">
                      {item.technologies.map((tech, tIdx) => (
                        <span 
                          key={tech}
                          className="inline-flex items-center"
                        >
                          <span className="text-neutral-300">{tech}</span>
                          {tIdx < item.technologies.length - 1 && (
                            <span className="mx-2 text-neutral-600">·</span>
                          )}
                        </span>
                      ))}
                    </div>

                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
                      isHovered 
                        ? 'border-amber-400 bg-amber-400 text-neutral-950 rotate-45 scale-110' 
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400'
                    }`}>
                      <ArrowUpRight className="w-4 h-4 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
