import React, { useState } from 'react';
import { 
  ExternalLink, 
  Github, 
  FileText, 
  ArrowUpRight, 
  Bookmark, 
  X, 
  Check, 
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  Code2
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { useUISounds } from '../hooks/useUISounds';
import { useAuth } from '../context/AuthContext';

export const FeaturedProjects: React.FC = () => {
  const { user, userData, toggleBookmark, signInWithGoogle } = useAuth();
  const { playClick, playHover, playTransition, playSuccess } = useUISounds();
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  const bookmarkedIds = userData?.bookmarkedProjectIds || [];

  const handleOpenCaseStudy = (project: Project) => {
    playTransition('in');
    setSelectedCaseStudy(project);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseCaseStudy = () => {
    playTransition('out');
    setSelectedCaseStudy(null);
    document.body.style.overflow = '';
  };

  const handleToggleBookmark = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      playClick();
      signInWithGoogle();
      return;
    }
    playSuccess();
    toggleBookmark(projectId);
  };

  return (
    <section 
      id="work" 
      aria-label="Featured Work"
      className="py-28 bg-neutral-950 relative border-t border-neutral-900 overflow-hidden"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-widest text-amber-400/90 flex items-center gap-2">
              <span>Selected Works</span>
              <span className="text-neutral-600">/</span>
              <span>Case Studies</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
              Featured Work
            </h2>

            <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
              Real projects built with focus on engineering rigor, practical utility, and tactile interaction.
            </p>
          </div>

          <div className="text-xs font-mono text-neutral-500 self-start md:self-auto">
            <span>{PROJECTS.length} FEATURED REPOSITORIES</span>
          </div>
        </div>

        {/* Large Editorial Project Showcases (Alternating Layouts) */}
        <div className="space-y-24 sm:space-y-32">
          {PROJECTS.map((project, index) => {
            const isReversed = index % 2 !== 0;
            const isBookmarked = bookmarkedIds.includes(project.id);

            return (
              <div 
                key={project.id}
                id={`project-${project.id}`}
                className={`flex flex-col ${
                  isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'
                } items-center gap-10 lg:gap-14 group`}
              >
                {/* Visual Preview Container */}
                <div className="w-full lg:w-7/12 relative rounded-2xl overflow-hidden border border-neutral-800/90 bg-neutral-900 shadow-2xl group-hover:border-neutral-700 transition-all duration-300">
                  <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top filter brightness-95 group-hover:scale-102 transition-transform duration-500"
                    />

                    {/* Subtle Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none" />

                    {/* Floating Status Indicator */}
                    <div className="absolute top-4 left-4 z-20">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{project.status || 'Active Project'}</span>
                      </div>
                    </div>

                    {/* Bookmark Action */}
                    <div className="absolute top-4 right-4 z-20">
                      <button
                        type="button"
                        onClick={(e) => handleToggleBookmark(project.id, e)}
                        aria-label="Bookmark project"
                        className={`p-2.5 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                          isBookmarked 
                            ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow-lg' 
                            : 'bg-neutral-950/80 text-neutral-400 border-white/10 hover:text-white'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Metadata Ribbon */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono text-neutral-300">
                      <span>{project.year}</span>
                      <span className="text-amber-400">{project.category.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Editorial Content Column */}
                <div className="w-full lg:w-5/12 space-y-6">
                  {/* Category & Year */}
                  <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">{project.year}</span>
                    <span>/</span>
                    <span>{project.tagline}</span>
                  </div>

                  {/* Project Name */}
                  <h3 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
                    {project.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                    {project.description}
                  </p>

                  {/* Technologies (Clean Unboxed Text with Separators) */}
                  <div className="pt-2">
                    <div className="text-xs font-mono text-neutral-500 mb-2 uppercase">Tech Stack</div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-mono text-neutral-300">
                      {project.tags.map((tag, tIdx) => (
                        <span key={tag} className="inline-flex items-center">
                          <span>{tag}</span>
                          {tIdx < project.tags.length - 1 && (
                            <span className="ml-2 text-neutral-600">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Case Study, Live Demo, GitHub */}
                  <div className="pt-4 flex flex-wrap items-center gap-3">
                    {/* Case Study Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenCaseStudy(project)}
                      className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <FileText className="w-4 h-4 text-neutral-950" />
                      <span>Read Case Study</span>
                    </button>

                    {/* Live Demo Button */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-white text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all"
                      >
                        <span>Live Demo</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                      </a>
                    )}

                    {/* GitHub Button */}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Modal (Full Product Documentation Experience) */}
      {selectedCaseStudy && (
        <div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-xl animate-fadeIn"
          onClick={handleCloseCaseStudy}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl overflow-y-auto shadow-2xl p-6 sm:p-10 space-y-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-6 border-b border-neutral-800/80 pb-6">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-2">
                  CASE STUDY ARCHIVE · {selectedCaseStudy.year}
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">
                  {selectedCaseStudy.title}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base mt-2">
                  {selectedCaseStudy.tagline}
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={handleCloseCaseStudy}
                aria-label="Close Case Study"
                className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Case Study Hero Preview */}
            <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-video relative">
              <img 
                src={selectedCaseStudy.image} 
                alt={selectedCaseStudy.title}
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Structured Product Documentation Sections */}
            <div className="space-y-10 text-neutral-300 text-sm sm:text-base leading-relaxed">
              
              {/* 1. What is it? */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">01</span>
                  <span>What is it?</span>
                </h3>
                <p className="text-neutral-400">
                  {selectedCaseStudy.whatIsIt || selectedCaseStudy.longDescription}
                </p>
              </div>

              {/* 2. The Problem */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">02</span>
                  <span>The Problem</span>
                </h3>
                <p className="text-neutral-400">
                  {selectedCaseStudy.problem}
                </p>
              </div>

              {/* 3. The Approach & Solution */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">03</span>
                  <span>The Approach & Architecture</span>
                </h3>
                <p className="text-neutral-400">
                  {selectedCaseStudy.approach || selectedCaseStudy.solution}
                </p>
              </div>

              {/* 4. How It Works */}
              {selectedCaseStudy.howItWorks && (
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-sm">04</span>
                    <span>How It Works</span>
                  </h3>
                  <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs sm:text-sm font-mono text-neutral-300 leading-relaxed">
                    {selectedCaseStudy.howItWorks}
                  </div>
                </div>
              )}

              {/* 5. Key Features */}
              {selectedCaseStudy.keyFeatures && selectedCaseStudy.keyFeatures.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-sm">05</span>
                    <span>Key Features</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedCaseStudy.keyFeatures.map((feat) => (
                      <div key={feat} className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-900/40 border border-neutral-800/80">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-neutral-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Technology Stack */}
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                  <span className="text-amber-400 font-mono text-sm">06</span>
                  <span>Technology Stack</span>
                </h3>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-neutral-300">
                  {selectedCaseStudy.tags.map((t, idx) => (
                    <span key={t} className="inline-flex items-center">
                      <span className="text-white">{t}</span>
                      {idx < selectedCaseStudy.tags.length - 1 && (
                        <span className="mx-2 text-neutral-600">·</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* 7. Challenges & Overcoming Them */}
              {selectedCaseStudy.challenges && (
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-sm">07</span>
                    <span>Engineering Challenges</span>
                  </h3>
                  <p className="text-neutral-400">
                    {selectedCaseStudy.challenges}
                  </p>
                </div>
              )}

              {/* 8. What I Learned */}
              {selectedCaseStudy.whatILearned && (
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-bold font-display text-white flex items-center gap-2">
                    <span className="text-amber-400 font-mono text-sm">08</span>
                    <span>What I Learned</span>
                  </h3>
                  <p className="text-neutral-400">
                    {selectedCaseStudy.whatILearned}
                  </p>
                </div>
              )}

            </div>

            {/* Modal Footer Links */}
            <div className="pt-6 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {selectedCaseStudy.liveUrl && (
                  <a
                    href={selectedCaseStudy.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-neutral-950 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all"
                  >
                    <span>View Live Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {selectedCaseStudy.githubUrl && (
                  <a
                    href={selectedCaseStudy.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white text-xs sm:text-sm font-medium flex items-center gap-2 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={handleCloseCaseStudy}
                className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Close Documentation [Esc]
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
