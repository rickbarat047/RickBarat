import React, { useState } from 'react';
import { Hammer, Sparkles, Gamepad2, Palette, Compass } from 'lucide-react';
import { PERSONAL_DATA, LittleThing } from '../data/personalData';
import { useUISounds } from '../hooks/useUISounds';

export const LittleThingsSection: React.FC = () => {
  const { playHover, playPop } = useUISounds();
  const [activeId, setActiveId] = useState<string | null>(null);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Hammer': return <Hammer className="w-4 h-4 text-amber-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-amber-400" />;
      case 'Gamepad2': return <Gamepad2 className="w-4 h-4 text-amber-400" />;
      case 'Palette': return <Palette className="w-4 h-4 text-amber-400" />;
      case 'Compass': return <Compass className="w-4 h-4 text-amber-400" />;
      default: return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <section 
      id="little-things" 
      aria-label="Little things about me"
      className="py-24 sm:py-32 px-6 sm:px-8 max-w-3xl mx-auto w-full"
    >
      <div className="space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span>02</span>
            <span className="text-neutral-600">/</span>
            <span>FACETS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Little things about me
          </h2>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
            A few pieces that make up what I enjoy spending my time on.
          </p>
        </div>

        {/* Windows / Interactive Cards Stack */}
        <div className="space-y-4">
          {PERSONAL_DATA.littleThings.map((thing, idx) => {
            const isToggled = activeId === thing.id;

            return (
              <div
                key={thing.id}
                onClick={() => {
                  playPop();
                  setActiveId(isToggled ? null : thing.id);
                }}
                onMouseEnter={() => playHover(1300 + idx * 80)}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 cursor-pointer ${
                  isToggled 
                    ? 'bg-neutral-900 border-amber-400/50 shadow-xl' 
                    : 'bg-neutral-900/40 border-neutral-800/80 hover:bg-neutral-900/80 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-neutral-950 border border-neutral-800">
                      {getIcon(thing.iconName)}
                    </span>
                    <span className="text-xs font-mono tracking-widest text-amber-400 font-semibold">
                      {thing.tag}
                    </span>
                  </div>

                  <span className="text-xs font-mono text-neutral-500">
                    0{idx + 1}
                  </span>
                </div>

                <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-sans">
                  &quot;{thing.description}&quot;
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
