import React, { useState } from 'react';
import { Layers, Cpu, Server, Database, Sparkles, Check } from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

export const SkillsMatrix: React.FC = () => {
  const { playHover } = useUISounds();
  const [activeTooltip, setActiveTooltip] = useState<{ [key: string]: string | null }>({});

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'Server': return <Server className="w-4 h-4 text-amber-400" />;
      case 'Database': return <Database className="w-4 h-4 text-amber-400" />;
      default: return <Layers className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section 
      id="skills" 
      aria-label="Skills & Tech Stack"
      className="py-24 bg-neutral-950/90 relative border-t border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
            <span>Engineering Stack</span>
            <span className="text-neutral-600">/</span>
            <span>Tools</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Skills &amp; Technologies
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed text-balance">
            Every technology in this stack has been battle-tested in real repositories, active automation pipelines, or creative projects.
          </p>
        </div>

        {/* 4 Clean Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SKILL_CATEGORIES.map((cat, catIdx) => (
            <div
              key={cat.id}
              className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 flex flex-col justify-between"
            >
              <div>
                {/* Category Header */}
                <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-neutral-800/70">
                  <div className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800">
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white tracking-wider">
                    {cat.name}
                  </h3>
                </div>

                {/* Skills List with Hover Project Indicator */}
                <div className="space-y-2">
                  {cat.skills.map((skill) => {
                    const key = `${cat.id}-${skill.name}`;
                    const isHovered = activeTooltip[key] !== undefined;

                    return (
                      <div
                        key={skill.name}
                        onMouseEnter={() => {
                          playHover(1400 + catIdx * 60);
                          setActiveTooltip(prev => ({ ...prev, [key]: skill.usedIn || 'Production Projects' }));
                        }}
                        onMouseLeave={() => {
                          setActiveTooltip(prev => {
                            const next = { ...prev };
                            delete next[key];
                            return next;
                          });
                        }}
                        className="group relative p-2.5 rounded-xl hover:bg-neutral-800/60 transition-all duration-200 cursor-default border border-transparent hover:border-neutral-700/60"
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-300 group-hover:text-amber-300 transition-colors font-medium">
                            {skill.name}
                          </span>

                          {/* Subtle arrow or check */}
                          <span className="text-[10px] text-neutral-500 group-hover:text-amber-400 transition-colors">
                            {isHovered ? 'Active' : '·'}
                          </span>
                        </div>

                        {/* Interactive Project Context Bubble */}
                        {skill.usedIn && isHovered && (
                          <div className="mt-1.5 pt-1.5 border-t border-neutral-700/50 text-[11px] font-mono text-amber-400 flex items-center gap-1.5 animate-fadeIn">
                            <span className="text-neutral-400">Used in:</span>
                            <span className="font-semibold">{skill.usedIn}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category Footer Note */}
              <div className="mt-6 pt-3 border-t border-neutral-800/50 text-[11px] font-mono text-neutral-500">
                {cat.skills.length} core technologies
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
