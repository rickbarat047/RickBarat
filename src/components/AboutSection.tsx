import React from 'react';
import { GraduationCap, Code2, Sparkles, MapPin, Send, ArrowUpRight, Compass, Heart } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

interface AboutSectionProps {
  onOpenResume?: () => void;
  onNavigateToContact?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenResume, onNavigateToContact }) => {
  const { playHover, playClick } = useUISounds();

  return (
    <section 
      id="about" 
      aria-label="About Rick Barat"
      className="py-28 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
            <span>Profile</span>
            <span className="text-neutral-600">/</span>
            <span>Background</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            About Rick Barat
          </h2>
        </div>

        {/* 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Personal Narrative */}
          <div className="lg:col-span-7 space-y-8">
            <blockquote className="text-2xl sm:text-3xl font-display font-medium text-neutral-100 leading-snug text-balance">
              &quot;I&apos;m Rick Barat — a BCA graduate and independent developer from West Bengal. I enjoy turning ideas into interactive websites, useful tools and AI-powered systems.&quot;
            </blockquote>

            <div className="space-y-5 text-neutral-400 text-sm sm:text-base leading-relaxed">
              <p>
                I approach software with a builder&apos;s mindset: understanding the foundational principles, testing assumptions with real prototypes, and crafting interfaces that people genuinely enjoy interacting with.
              </p>
              <p>
                Whether it&apos;s constructing an automated video scripting pipeline with Gemini and n8n, designing an interactive PC hardware compatibility engine, or exploring local LLMs with Ollama, my work is driven by curiosity and execution.
              </p>
            </div>

            {/* Core Philosophy Callout */}
            <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 flex items-start gap-4">
              <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                  The Builder&apos;s Principle
                </h4>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  &quot;I don&apos;t just know technologies. I build things.&quot; Real code, demonstrable projects, and clear problem-solving over speculative claims.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  if (onNavigateToContact) {
                    onNavigateToContact();
                  } else {
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <span>Get In Touch</span>
                <Send className="w-4 h-4" />
              </button>

              {onOpenResume && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onOpenResume();
                  }}
                  className="px-5 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs sm:text-sm font-medium transition-all cursor-pointer"
                >
                  <span>View Credentials</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Structured Facts (Education, Focus, Location) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Education Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-amber-400 uppercase tracking-wider">
                <GraduationCap className="w-4 h-4" />
                <span>Education</span>
              </div>

              <div>
                <h4 className="text-lg font-bold font-display text-white">
                  BCA (Bachelor of Computer Applications)
                </h4>
                <p className="text-sm font-mono text-neutral-400 mt-1">
                  Techno India University
                </p>
                <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
                  Grounded in software development, data structures, database architecture, and computer systems.
                </p>
              </div>
            </div>

            {/* Primary Focus Card */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-4">
              <div className="flex items-center gap-3 text-xs font-mono text-amber-400 uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Primary Focus</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                {PERSONAL_INFO.primaryFocus.map((focus, fIdx) => (
                  <div key={focus} className="flex items-center justify-between p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/50">
                    <span className="text-neutral-300">{focus}</span>
                    <span className="text-amber-400 font-bold">0{fIdx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location & Contact Info */}
            <div className="p-6 rounded-2xl bg-neutral-900/40 border border-neutral-800/80 space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400">
                <span>Location:</span>
                <span className="text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  {PERSONAL_INFO.location}
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Direct Contact:</span>
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="text-amber-400 hover:underline"
                >
                  {PERSONAL_INFO.email}
                </a>
              </div>
              <div className="flex items-center justify-between text-neutral-400">
                <span>Status:</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {PERSONAL_INFO.status}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
