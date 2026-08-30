import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Github, 
  Sparkles, 
  ChevronRight, 
  ArrowUpRight,
  Play,
  Zap,
  Bookmark
} from 'lucide-react';
import { Project } from '../types';
import { usePrmptScrollScale } from '../hooks/usePrmptScrollScale';
import { useUISounds } from '../hooks/useUISounds';

interface PrmptArchiveCardProps {
  project: Project;
  index: number;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: string, e: React.MouseEvent) => void;
  onOpenModal: (project: Project) => void;
  user: any;
}

export const PrmptArchiveCard: React.FC<PrmptArchiveCardProps> = ({
  project,
  index,
  isBookmarked,
  onToggleBookmark,
  onOpenModal,
  user,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { playHover, playClick } = useUISounds();

  // Use custom Framer Motion hook to calculate dynamic scroll-linked scale and entrance
  const { scale, opacity, prefersReducedMotion } = usePrmptScrollScale(containerRef, {
    index,
    bidirectional: true,
    staggerColumns: 3,
    smooth: true,
  });

  const archiveSerial = `ARCHIVE_${String(index + 1).padStart(3, '0')}`;

  return (
    <div
      ref={containerRef}
      className="h-full relative min-h-[500px] flex flex-col will-change-transform"
    >
      <motion.div
        id={`project-card-${project.id}`}
        style={{
          scale: prefersReducedMotion ? 1 : scale,
          opacity: prefersReducedMotion ? 1 : opacity,
          transformOrigin: 'center center',
        }}
        onMouseEnter={() => playHover(1350)}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group relative rounded-2xl bg-neutral-900/70 backdrop-blur-md border border-neutral-800/80 hover:border-amber-400/60 transition-colors duration-300 flex flex-col overflow-hidden hover:shadow-2xl hover:shadow-amber-500/10 h-full select-none cursor-pointer"
        onClick={() => onOpenModal(project)}
      >
        {/* Archival Drafting Corner Crosshairs */}
        <div className="absolute top-2 left-2 text-[10px] font-mono text-neutral-600/80 pointer-events-none z-10 select-none">
          +
        </div>
        <div className="absolute top-2 right-2 text-[10px] font-mono text-neutral-600/80 pointer-events-none z-10 select-none">
          +
        </div>

        {/* Archival Header Bar */}
        <div className="px-4 py-2 bg-neutral-950/80 border-b border-neutral-800/80 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="text-amber-400/90 font-semibold tracking-wider">
              {archiveSerial}
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-400 uppercase tracking-wide">
              {project.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] text-neutral-400">VERIFIED</span>
          </div>
        </div>

        {/* Image Preview / Banner */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-neutral-950">
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

          {/* Year & Featured Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-neutral-950/85 backdrop-blur-md border border-neutral-700/80 text-neutral-300 text-[10px] font-mono tracking-wider">
              REF: {project.year}
            </span>
            {project.featured && (
              <span className="px-2 py-0.5 rounded-md bg-amber-400/95 text-neutral-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            id={`project-bookmark-btn-${project.id}`}
            type="button"
            onClick={(e) => onToggleBookmark(project.id, e)}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-all duration-200 z-10 ${
              isBookmarked
                ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-lg scale-105'
                : 'bg-neutral-950/70 text-neutral-300 hover:text-white hover:bg-neutral-900 border-neutral-700/80'
            }`}
            title={
              isBookmarked
                ? 'Remove from saved bookmarks'
                : user
                ? 'Bookmark project (Synced to Firestore)'
                : 'Sign in with Google to save bookmark'
            }
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Primary Metric Pill */}
          {project.metrics[0] && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-neutral-950/90 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-mono flex items-center gap-1.5 shadow-md">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{project.metrics[0].value} {project.metrics[0].label}</span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors flex items-center justify-between">
              <span>{project.title}</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-amber-400 transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </h3>
            <p className="text-xs font-mono text-amber-400/90">{project.tagline}</p>
            <p className="text-sm text-neutral-400 line-clamp-3 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Archival Tech Tags */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded bg-neutral-800/80 border border-neutral-750 text-neutral-300 text-[11px] font-mono"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 4 && (
                <span className="px-1.5 py-0.5 rounded bg-neutral-800/40 border border-neutral-750 text-neutral-400 text-[10px] font-mono">
                  +{project.tags.length - 4}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
              <button
                id={`project-deepdive-btn-${project.id}`}
                type="button"
                onClick={() => onOpenModal(project)}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
              >
                <span>Deep Dive & Architecture</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>

              <div className="flex items-center gap-2">
                {project.githubUrl && (
                  <a
                    id={`project-github-${project.id}`}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-neutral-800/70 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                    title="View Source Code"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
                {project.liveUrl && (
                  <button
                    id={`project-quickview-${project.id}`}
                    type="button"
                    onClick={() => onOpenModal(project)}
                    className="p-1.5 rounded-lg bg-neutral-800/70 text-neutral-400 hover:text-amber-400 hover:bg-neutral-700 transition-colors"
                    title="Live Interactive Demo"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
