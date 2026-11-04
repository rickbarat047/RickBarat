import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpatialItem } from '../../data/spatialData';
import { X, ArrowUpRight, Sparkles, Globe, Terminal, Layers } from 'lucide-react';

interface FlipDetailModalProps {
  item: SpatialItem | null;
  sourceRect: DOMRect | null;
  onClose: () => void;
}

export const FlipDetailModal: React.FC<FlipDetailModalProps> = ({ item, sourceRect, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTriggerClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTriggerClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 380);
  };

  if (!item) return null;

  // Fallback if sourceRect wasn't provided
  const from = sourceRect
    ? {
        x: sourceRect.left,
        y: sourceRect.top,
        width: sourceRect.width,
        height: sourceRect.height,
        borderRadius: 12
      }
    : {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100,
        width: 200,
        height: 200,
        borderRadius: 12
      };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
        {/* Backdrop Fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isClosing ? 0 : 0.85 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={handleTriggerClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
        />

        {/* FLIP Container: Expands from source rect to centered dialog and back */}
        <motion.div
          initial={{
            position: 'fixed',
            top: from.y,
            left: from.x,
            width: from.width,
            height: from.height,
            borderRadius: from.borderRadius,
            opacity: 0.6
          }}
          animate={
            isClosing
              ? {
                  top: from.y,
                  left: from.x,
                  width: from.width,
                  height: from.height,
                  borderRadius: from.borderRadius,
                  opacity: 0.2,
                  transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
                }
              : {
                  top: '50%',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  width: 'min(92vw, 680px)',
                  height: 'min(86vh, 760px)',
                  borderRadius: 24,
                  opacity: 1,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                }
          }
          className="relative bg-neutral-900 border border-neutral-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col z-10"
        >
          {/* Premium editorial header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800/80 bg-[#020617]/60 flex-shrink-0">
            <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-500">
              <span className="text-amber-400 font-bold text-sm tracking-normal">{item.number}</span>
              <span className="w-px h-4 bg-neutral-700" />
              <span className="text-neutral-400">{item.badge}</span>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors duration-200 normal-case tracking-normal text-xs font-medium"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Open Website</span>
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={handleTriggerClose}
              className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
              aria-label="Close detail modal"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7 select-text text-neutral-200 bg-[#020617]/40">
            {/* Premium editorial visual hero */}
            {item.image && (
              <div className="w-full h-52 sm:h-64 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 relative group shadow-editorial">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).onerror = null; (e.currentTarget as HTMLImageElement).src = '/assets/images/creative_corner_art_1790612718363.jpg'; }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              </div>
            )}

            {/* Title & Category */}
            <div className="space-y-2">
              <span className="text-xs font-mono tracking-widest uppercase text-amber-400">
                {item.category}
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight uppercase">
                {item.title}
              </h2>
            </div>

            {/* Full Narrative Text */}
            <div className="text-base sm:text-lg font-sans text-neutral-300 leading-relaxed space-y-4">
              <p className="whitespace-pre-line">{item.fullDesc}</p>
            </div>

            {/* Tags if available */}
            {item.tags && item.tags.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-2">
                  FOCUS & TECH
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/60 text-xs font-mono text-neutral-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Table */}
            {item.meta && item.meta.length > 0 && (
              <div className="pt-4 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {item.meta.map((m) => (
                  <div key={m.label} className="space-y-1">
                    <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider block">
                      {m.label}
                    </span>
                    <span className="text-sm font-sans text-white font-medium block">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Action Footer with Real Website Links */}
          <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-between flex-shrink-0">
            <span className="text-xs font-mono text-neutral-500 hidden sm:inline">
              RICK&apos;S CORNER · 2026
            </span>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-400 text-neutral-950 font-sans font-bold text-sm inline-flex items-center justify-center gap-2 hover:bg-amber-300 active:scale-95 transition-all cursor-pointer shadow-lg shadow-amber-400/20"
                >
                  <span>{item.urlLabel || 'OPEN WEBSITE ↗'}</span>
                  <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleTriggerClose}
                  className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-sans text-xs font-medium transition-colors cursor-pointer"
                >
                  Close View
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
