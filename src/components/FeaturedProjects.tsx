import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Github, 
  Sparkles, 
  Layers, 
  ChevronRight, 
  X, 
  Cpu, 
  CheckCircle2, 
  ArrowUpRight,
  Play,
  RotateCcw,
  Activity,
  Zap,
  Bookmark,
  SlidersHorizontal,
  FolderGit2
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project, ProjectCategory } from '../types';
import { useUISounds } from '../hooks/useUISounds';
import { RevealOnScroll } from './RevealOnScroll';
import { useAuth } from '../context/AuthContext';
import { PrmptArchiveCard } from './PrmptArchiveCard';

export const FeaturedProjects: React.FC = () => {
  const { user, userData, toggleBookmark, signInWithGoogle } = useAuth();
  const { playClick, playSwitch, playSuccess, playHover, playTransition } = useUISounds();
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'bookmarked'>('all');
  const [activeProjectModal, setActiveProjectModal] = useState<Project | null>(null);
  const [demoState, setDemoState] = useState<{ [key: string]: any }>({});

  const bookmarkedIds = userData?.bookmarkedProjectIds || [];

  const categories: { id: ProjectCategory | 'bookmarked'; label: string; badge?: number }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'full-stack', label: 'Full-Stack' },
    { id: 'ai-systems', label: 'AI & Agents' },
    { id: 'creative-ui', label: 'Creative UI & Canvas' },
    { id: 'cloud-infra', label: 'Cloud & Telemetry' },
    ...(bookmarkedIds.length > 0 ? [{ id: 'bookmarked' as const, label: 'Saved Bookmarks', badge: bookmarkedIds.length }] : [])
  ];

  const filteredProjects = selectedCategory === 'all'
    ? PROJECTS
    : selectedCategory === 'bookmarked'
    ? PROJECTS.filter(p => bookmarkedIds.includes(p.id))
    : PROJECTS.filter(p => p.category === selectedCategory);

  const handleCategoryChange = (cat: ProjectCategory | 'bookmarked') => {
    playSwitch();
    setSelectedCategory(cat);
  };

  const handleToggleBookmark = (projectId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!user) {
      playClick();
      signInWithGoogle();
      return;
    }
    playSuccess();
    toggleBookmark(projectId);
  };

  const handleOpenModal = (project: Project) => {
    playTransition('in');
    setActiveProjectModal(project);
  };

  const handleCloseModal = () => {
    playTransition('out');
    setActiveProjectModal(null);
  };

  return (
    <section id="projects" className="py-24 bg-neutral-950/90 relative border-t border-neutral-800/80 overflow-hidden">
      {/* Background Archival Grid Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with PRMPT Archive Styling */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>[ ARCHIVE REPOSITORY // ED. 2026 ]</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>SCALE ENGINE: 0.00x ⇄ 1.00x SCROLL-LINKED (ENTRY & EXIT)</span>
                </div>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-display tracking-tight">
                Featured Engineering Archive
              </h2>
              <p className="text-neutral-400 mt-2 max-w-xl text-sm sm:text-base leading-relaxed">
                A curated repository of real-time applications, autonomous AI agent pipelines, distributed systems, and tactile creative engineering artifacts.
              </p>
            </div>

            {/* Category Filter Tabs & Archive Counter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="text-[11px] font-mono text-neutral-500 self-start sm:self-center">
                INDEX: <span className="text-amber-400 font-semibold">{filteredProjects.length}</span> / {PROJECTS.length} ARTIFACTS
              </div>

              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-900 rounded-xl border border-neutral-800 self-start md:self-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    id={`project-filter-${cat.id}`}
                    type="button"
                    onMouseEnter={() => playHover(1500)}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    <span>{cat.label}</span>
                    {cat.badge !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedCategory === cat.id ? 'bg-neutral-950 text-amber-400' : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {cat.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Projects Grid with PRMPT Archive Scroll-Scale Entrance Animation (0 to 1) */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <PrmptArchiveCard
                key={project.id}
                project={project}
                index={idx}
                isBookmarked={bookmarkedIds.includes(project.id)}
                onToggleBookmark={handleToggleBookmark}
                onOpenModal={handleOpenModal}
                user={user}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-neutral-900/50 border border-neutral-800 text-center space-y-4 my-8">
            <div className="w-12 h-12 rounded-xl bg-neutral-800/80 border border-neutral-700 flex items-center justify-center mx-auto text-amber-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display">No Bookmarked Artifacts Yet</h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                Click the bookmark icon on any project card to catalog it in your personal Firestore collection.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCategoryChange('all')}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold font-mono border border-neutral-700 transition-colors"
            >
              Browse All Projects
            </button>
          </div>
        )}

      </div>

      {/* Deep Dive Case Study Modal */}
      {activeProjectModal && (
        <div 
          id="project-case-study-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-y-auto my-auto text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-20 flex items-center justify-between p-5 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Case Study // {activeProjectModal.category}
                </span>
                <h3 className="text-2xl font-bold text-white font-display">
                  {activeProjectModal.title}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id={`modal-bookmark-btn-${activeProjectModal.id}`}
                  type="button"
                  onClick={(e) => handleToggleBookmark(activeProjectModal.id, e)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-medium transition-all ${
                    bookmarkedIds.includes(activeProjectModal.id)
                      ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
                  }`}
                  title="Toggle bookmark in Firestore"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarkedIds.includes(activeProjectModal.id) ? 'fill-current' : ''}`} />
                  <span>{bookmarkedIds.includes(activeProjectModal.id) ? 'Saved' : 'Save Project'}</span>
                </button>

                <button
                  id="modal-close-btn"
                  type="button"
                  onClick={handleCloseModal}
                  className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                  aria-label="Close Case Study"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Content */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Banner & Metrics Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activeProjectModal.metrics.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800">
                    <div className="text-xs font-mono text-neutral-400">{m.label}</div>
                    <div className="text-2xl font-bold text-amber-400 font-display mt-1">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Extended Description */}
              <div className="space-y-3">
                <h4 className="text-sm font-mono text-neutral-400 uppercase tracking-wider">
                  Executive Summary
                </h4>
                <p className="text-neutral-300 leading-relaxed">
                  {activeProjectModal.longDescription}
                </p>
              </div>

              {/* Problem & Solution Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-neutral-950/50 border border-red-950/40 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span>The Engineering Challenge</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {activeProjectModal.problem}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-neutral-950/50 border border-emerald-950/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>The Architectural Solution</span>
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                    {activeProjectModal.solution}
                  </p>
                </div>
              </div>

              {/* Architecture Highlights */}
              <div className="space-y-4">
                <h4 className="text-sm font-mono text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <span>Technical & Architectural Highlights</span>
                </h4>
                <div className="space-y-2.5">
                  {activeProjectModal.architectureHighlights.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-neutral-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Architecture Simulator / Playground */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-amber-500/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                      Live Architecture Testbench (Interactive)
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-500">
                    STATUS: READY (Simulated Engine)
                  </span>
                </div>

                {activeProjectModal.id === 'nexus-stream' && (
                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3">
                    <div className="text-xs text-neutral-300">
                      Simulate real-time CRDT delta broadcast across concurrent client nodes:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Node A (SF)', 'Node B (London)', 'Node C (Tokyo)', 'Node D (Sydney)'].map((node, i) => (
                        <div key={node} className="p-2.5 rounded bg-neutral-950 border border-neutral-800 text-center">
                          <div className="text-[11px] font-mono text-amber-300">{node}</div>
                          <div className="text-[10px] text-emerald-400 mt-1 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Synced (12ms)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeProjectModal.id === 'omniflow-ai' && (
                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between text-neutral-400 text-[11px]">
                      <span>Agent Loop Execution Log</span>
                      <span className="text-emerald-400">Deterministic Guardrails: ACTIVE</span>
                    </div>
                    <div className="p-2.5 rounded bg-neutral-950 text-neutral-300 space-y-1 text-[11px]">
                      <div className="text-amber-400">&gt; PLAN: Decompose ETL query into 3 parallel sub-tasks</div>
                      <div className="text-cyan-400">&gt; EXECUTE: FastMCP tool fetch_metrics(timeframe=&quot;24h&quot;)</div>
                      <div className="text-emerald-400">&gt; VERIFY: Schema match 100% (0 errors, 42ms runtime)</div>
                    </div>
                  </div>
                )}

                {activeProjectModal.id !== 'nexus-stream' && activeProjectModal.id !== 'omniflow-ai' && (
                  <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                    Engine components loaded with 100% test coverage. Production deployment configured for zero-downtime rolling updates.
                  </div>
                )}
              </div>

              {/* Technologies Applied */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Technology Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeProjectModal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-neutral-800 text-amber-300 text-xs font-mono border border-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer / External Links */}
              <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-neutral-500">
                  Shipped & Architected by Rick Barat ({activeProjectModal.year})
                </div>
                <div className="flex items-center gap-3">
                  {activeProjectModal.githubUrl && (
                    <a
                      id="modal-source-code-link"
                      href={activeProjectModal.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>View GitHub Repo</span>
                    </a>
                  )}
                  <button
                    id="modal-done-btn"
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-colors"
                  >
                    Close Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
