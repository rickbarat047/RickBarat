import React, { useState } from 'react';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  TrendingUp,
  Sparkles,
  Layers
} from 'lucide-react';
import { EXPERIENCES } from '../data/portfolioData';
import { playClickSound } from '../utils/soundEffects';
import { RevealOnScroll } from './RevealOnScroll';

export const ExperienceTimeline: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(EXPERIENCES[0].id);

  const toggleExpand = (id: string) => {
    playClickSound();
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-neutral-950/90 border-t border-neutral-800">
      {/* Full-bleed cinematic video animation behind Work Experience & Milestones */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-35 filter saturate-150 contrast-125 scale-105"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260429_114316_1c7889ad-2885-410e-b493-98119fee0ddb.mp4"
        />
        {/* Soft edge blending gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/75 to-neutral-950" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-neutral-950/60 to-neutral-950" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CAREER PATH & IMPACT</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              Work Experience & Milestones
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Track record of shipping mission-critical systems, leading technical decisions, and scaling platforms.
            </p>
          </div>
        </RevealOnScroll>

        {/* Timeline Stack */}
        <div className="relative border-l-2 border-neutral-800 ml-4 sm:ml-8 space-y-8">
          {EXPERIENCES.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            return (
              <RevealOnScroll
                key={exp.id}
                direction="up"
                delay={index * 100}
                duration={600}
                distance={24}
              >
                <div 
                  id={`experience-item-${exp.id}`}
                  className="relative pl-6 sm:pl-8 group"
                >
                  {/* Timeline Dot Indicator */}
                  <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 transition-colors ${
                    isExpanded 
                      ? 'bg-amber-400 border-amber-300 shadow-md shadow-amber-500/50' 
                      : 'bg-neutral-900 border-neutral-700 group-hover:border-amber-400'
                  }`} />

                  {/* Experience Card */}
                  <div 
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer backdrop-blur-md ${
                      isExpanded 
                        ? 'bg-neutral-900/90 border-amber-400/40 shadow-xl shadow-amber-500/5' 
                        : 'bg-neutral-900/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-900/80'
                    }`}
                    onClick={() => toggleExpand(exp.id)}
                  >
                    {/* Card Header */}
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                            {exp.role}
                          </h3>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                            {exp.type}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono">
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {exp.company}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                            {exp.location}
                          </span>
                          <span className="flex items-center gap-1 text-neutral-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {exp.period}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right hidden md:block">
                          <div className="text-xs font-mono text-emerald-400 font-bold">{exp.metrics}</div>
                        </div>
                        <div className="p-2 rounded-xl bg-neutral-800 text-neutral-400 group-hover:text-white">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="px-6 pb-6 pt-2 border-t border-neutral-800 space-y-4 text-left animate-fadeIn">
                        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                          {exp.description}
                        </p>

                        {/* Deliverables Checklist */}
                        <div className="space-y-2">
                          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                            Key Deliverables & Architecture:
                          </div>
                          <div className="space-y-2">
                            {exp.deliverables.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tech Stack Used */}
                        <div className="pt-2 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-mono text-neutral-500 mr-2">TECH:</span>
                          {exp.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="px-2.5 py-1 rounded-md bg-neutral-950 text-neutral-300 text-xs font-mono border border-neutral-800"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>

      </div>
    </section>
  );
};
