import React, { useState } from 'react';
import { Cpu, Sparkles, Terminal, Activity, ArrowUpRight, Zap, RefreshCw, Box, Bot } from 'lucide-react';
import { AI_LAB_EXPERIMENTS } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';

export const AILab: React.FC = () => {
  const { playHover, playClick } = useUISounds();
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const tags = [
    { id: 'all', label: 'All Experiments' },
    { id: 'ai-apps', label: 'AI Applications' },
    { id: 'automation', label: 'Automation & Pipelines' },
    { id: 'local-ai', label: 'Local AI & Ollama' },
    { id: 'generative', label: 'Generative Systems' }
  ];

  const filteredExperiments = selectedTag === 'all'
    ? AI_LAB_EXPERIMENTS
    : AI_LAB_EXPERIMENTS.filter(exp => {
        if (selectedTag === 'ai-apps') return exp.category.includes('AI') || exp.category.includes('Content');
        if (selectedTag === 'automation') return exp.category.includes('Automation');
        if (selectedTag === 'local-ai') return exp.category.includes('Local');
        if (selectedTag === 'generative') return exp.category.includes('Generative') || exp.category.includes('Creative');
        return true;
      });

  return (
    <section 
      id="ai-lab" 
      aria-label="AI Lab & Automation"
      className="py-28 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden"
    >
      {/* Subtle Lab Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#f59e0b0a,transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-2">
            <Bot className="w-4 h-4" />
            <span>AI LAB & EXPERIMENTS</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            AI Lab
          </h2>

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed text-balance">
            &quot;An evolving collection of experiments exploring what happens when code, AI and automation work together.&quot;
          </p>
        </div>

        {/* Experiment Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                playClick();
                setSelectedTag(tag.id);
              }}
              onMouseEnter={() => playHover(1400)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                selectedTag === tag.id
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                  : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Experiments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp, index) => (
            <div
              key={exp.id}
              onMouseEnter={() => playHover(1350 + index * 50)}
              className="p-6 sm:p-7 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between group hover:bg-neutral-900/80"
            >
              <div>
                {/* Category & Status */}
                <div className="flex items-center justify-between text-xs font-mono mb-4">
                  <span className="text-neutral-400">{exp.category}</span>
                  <span className="text-amber-400/90">{exp.status}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold font-display text-white group-hover:text-amber-300 transition-colors">
                  {exp.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  {exp.description}
                </p>
              </div>

              {/* Bottom: Tool and Highlight */}
              <div className="mt-8 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono">
                <span className="text-neutral-300">{exp.tool}</span>
                <span className="text-neutral-500">{exp.highlight}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lab Footer Note */}
        <div className="mt-12 p-6 rounded-2xl bg-neutral-900/30 border border-neutral-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-neutral-400">
            <span>EXPLORATION POLICY: </span>
            <span className="text-neutral-300">All experiments are genuine code prototypes or live tools built with Gemini API, Ollama, and n8n.</span>
          </div>
          <a
            href="https://github.com/rickbarat"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1.5 shrink-0"
          >
            <span>Browse Repositories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
