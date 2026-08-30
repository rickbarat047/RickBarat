import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  CheckCircle, 
  Code, 
  Server, 
  Database, 
  Cpu, 
  Sparkles,
  Zap,
  Award
} from 'lucide-react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { RevealOnScroll } from './RevealOnScroll';

export const SkillsMatrix: React.FC = () => {
  const { playClick, playSwitch, playHover } = useUISounds();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout': return <Code className="w-5 h-5 text-amber-400" />;
      case 'Server': return <Server className="w-5 h-5 text-amber-400" />;
      case 'Database': return <Database className="w-5 h-5 text-amber-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-amber-400" />;
      default: return <Layers className="w-5 h-5 text-amber-400" />;
    }
  };

  const filteredCategories = SKILL_CATEGORIES.map(category => {
    if (activeCategory !== 'all' && category.id !== activeCategory) {
      return null;
    }
    const filteredSkills = category.skills.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.tag && s.tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredSkills.length === 0 && searchQuery) {
      return null;
    }

    return {
      ...category,
      skills: filteredSkills
    };
  }).filter(Boolean);

  return (
    <section id="skills" className="py-24 bg-neutral-950/80 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
              <Award className="w-3.5 h-3.5" />
              <span>TECHNICAL CAPABILITIES & PROFICIENCIES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              Skills & Architecture Matrix
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              6+ years of building full-stack platforms, distributed systems, resilient cloud infrastructure, and delightful frontends.
            </p>
          </div>
        </RevealOnScroll>

        {/* Controls Bar: Search & Category Filter */}
        <RevealOnScroll direction="up" delay={100} duration={600} distance={20}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1 p-1 bg-neutral-900 rounded-xl border border-neutral-800 w-full sm:w-auto">
              <button
                id="skill-cat-all"
                type="button"
                onMouseEnter={() => playHover(1500)}
                onClick={() => {
                  playSwitch();
                  setActiveCategory('all');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                All Domains
              </button>
              {SKILL_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  id={`skill-cat-${cat.id}`}
                  type="button"
                  onMouseEnter={() => playHover(1500)}
                  onClick={() => {
                    playSwitch();
                    setActiveCategory(cat.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-amber-400 text-neutral-950 font-bold shadow'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  {cat.name.split('&')[0].trim()}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                id="skills-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill (e.g. React, PostgreSQL)..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/50"
              />
            </div>
          </div>
        </RevealOnScroll>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCategories.map((category, idx) => category && (
            <RevealOnScroll
              key={category.id}
              direction="up"
              delay={(idx % 2) * 120}
              duration={650}
              distance={28}
              className="h-full"
            >
              <div
                id={`skill-card-${category.id}`}
                className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700/80 transition-all space-y-6 h-full"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/50">
                      {getCategoryIcon(category.iconName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white font-display">{category.name}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-1">{category.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-neutral-500">
                    {category.skills.length} skills
                  </span>
                </div>

                {/* Skills List with Progress Bars */}
                <div className="space-y-4">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-neutral-200">{skill.name}</span>
                          {skill.isPrimary && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/30">
                              CORE
                            </span>
                          )}
                          {skill.tag && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-neutral-800 text-neutral-400">
                              {skill.tag}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 font-mono text-neutral-400 text-[11px]">
                          <span>{skill.years}</span>
                          <span className="text-amber-400 font-bold">{skill.level}%</span>
                        </div>
                      </div>

                      {/* Progress Track */}
                      <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};
