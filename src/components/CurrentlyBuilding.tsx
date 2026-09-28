import React from 'react';
import { Sparkles, Terminal, Activity, ArrowRight } from 'lucide-react';
import { CURRENTLY_BUILDING } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

interface CurrentlyBuildingProps {
  onExploreProject?: (projectId: string) => void;
}

export const CurrentlyBuilding: React.FC<CurrentlyBuildingProps> = ({ onExploreProject }) => {
  const { playHover, playClick } = useUISounds();

  return (
    <section 
      id="currently-building" 
      aria-label="Currently Building"
      className="py-20 bg-neutral-950/80 relative border-t border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ACTIVE PIPELINE</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">IN THE LAB</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Currently Building
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-xl">
              Active engineering projects and experimental tools in development right now.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-500 self-start md:self-auto">
            <span>UPDATED REGULARLY</span>
          </div>
        </div>

        {/* Dynamic Project Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURRENTLY_BUILDING.map((item, index) => (
            <div
              key={item.id}
              onMouseEnter={() => playHover(1400 + index * 80)}
              onClick={() => {
                playClick();
                if (onExploreProject) {
                  onExploreProject(item.id.replace('building-', ''));
                }
              }}
              className="group p-6 sm:p-7 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between cursor-pointer hover:bg-neutral-900/90 relative"
            >
              {/* Top Bar: Name & Status */}
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="text-xs font-mono text-neutral-400">
                    {item.category}
                  </span>
                  
                  {/* Status Indicator */}
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${item.pulseColor} animate-pulse`} />
                    <span>{item.status}</span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>

                <p className="mt-3 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom: Stack & Arrow */}
              <div className="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-neutral-400">
                  {item.stack.map((s, sIdx) => (
                    <span key={s}>
                      <span className="text-neutral-300">{s}</span>
                      {sIdx < item.stack.length - 1 && <span className="ml-2 text-neutral-600">·</span>}
                    </span>
                  ))}
                </div>

                <div className="text-neutral-500 group-hover:text-amber-400 transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
