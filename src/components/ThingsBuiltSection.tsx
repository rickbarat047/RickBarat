import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { PERSONAL_DATA } from '../data/personalData';
import { CinematicDevicePreview } from './CinematicDevicePreview';
import { useUISounds } from '../hooks/useUISounds';

export const ThingsBuiltSection: React.FC = () => {
  const { playClick, playHover } = useUISounds();

  return (
    <section 
      id="things-i-built" 
      aria-label="Things I've Built"
      className="py-24 sm:py-36 md:py-44 px-5 sm:px-10 md:px-16 max-w-5xl mx-auto w-full select-none"
    >
      <div className="space-y-20 sm:space-y-32">
        
        {/* Casual Section Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
            <span className="text-amber-400 font-bold">04</span>
            <span className="text-neutral-700">/</span>
            <span>EXPERIMENTS & CRAFT</span>
          </div>

          <h2 className="text-4xl sm:text-7xl md:text-8xl font-display font-extrabold text-white tracking-tight leading-[0.95] text-balance">
            {PERSONAL_DATA.projectsIntro}
          </h2>

          <p className="text-base sm:text-xl font-sans text-neutral-400 max-w-xl leading-relaxed">
            A couple of recent things I put together and shipped to the web.
          </p>
        </div>

        {/* Full-Screen Project Moments with Custom Device Frames */}
        <div className="space-y-28 sm:space-y-40">
          {PERSONAL_DATA.projects.map((project, idx) => (
            <div 
              key={project.id}
              className="space-y-6 group"
            >
              {/* Editorial Index & Category Meta */}
              <div className="flex items-baseline justify-between border-b border-neutral-800/80 pb-3">
                <span className="text-3xl sm:text-5xl font-mono text-amber-400/90 font-bold">
                  0{idx + 1}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    {project.category} · {project.year}
                  </span>
                </div>
              </div>

              {/* Project Title & Human Voice Description */}
              <div className="space-y-3">
                <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-white tracking-tight leading-none group-hover:text-amber-300 transition-colors">
                  {project.name}
                </h3>
                <p className="text-base sm:text-xl font-sans text-neutral-300 max-w-2xl leading-relaxed">
                  {project.shortDescription}
                </p>

                {/* Tech & Focus Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Browser/Device Frame with Scroll-Triggered Cinematic Scale & Parallax */}
              <CinematicDevicePreview 
                url={project.url}
                name={project.name}
                image={project.image}
                category={project.category}
                year={project.year}
                index={idx}
              />

              {/* Direct Touch Action Bar */}
              <div className="pt-1 flex items-center justify-between">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  onMouseEnter={() => playHover(1400)}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-neutral-400 hover:text-white transition-colors group-hover:text-amber-400 py-1"
                >
                  <span>Visit {project.name.toLowerCase()} live</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <span className="text-xs font-mono text-neutral-600">
                  EST. {project.year}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
