import React from 'react';
import { motion } from 'motion/react';
import { SPATIAL_OBJECTS, SpatialItem } from '../../data/spatialData';
import { ArrowUpRight } from 'lucide-react';

interface ExploreGridViewProps {
  onSelectObject: (item: SpatialItem, rect: DOMRect) => void;
  onCloseGrid: () => void;
}

export const ExploreGridView: React.FC<ExploreGridViewProps> = ({ onSelectObject, onCloseGrid }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-6xl mx-auto px-5 sm:px-8 py-24 sm:py-32 select-none"
    >
      {/* Editorial header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800/80 pb-8 mb-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 mb-4 tracking-[0.2em] uppercase">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Index · Editorial Grid</span>
          </div>
          <h2 className="editorial-heading text-4xl sm:text-6xl font-black text-white uppercase">
            My World
          </h2>
          <p className="mt-3 text-sm text-neutral-500 leading-relaxed">
            A curated index of ideas, experiments, and the tools I build.
          </p>
        </div>

        <button
          type="button"
          onClick={onCloseGrid}
          className="self-start sm:self-auto px-5 py-2.5 rounded-full border border-neutral-800 bg-neutral-900/70 hover:bg-neutral-800 text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer shadow-editorial"
        >
          ← Return to 3D Sphere
        </button>
      </div>

      {/* Premium editorial grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPATIAL_OBJECTS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * idx, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSelectObject(item, rect);
            }}
            data-cursor-hover
            className="group relative rounded-2xl bg-neutral-900/70 border border-neutral-800/80 hover:border-amber-400/60 hover:bg-neutral-900 p-5 flex flex-col min-h-[280px] transition-[border-color,background-color,box-shadow] duration-300 hover:shadow-editorial cursor-pointer overflow-hidden"
          >
            {/* Top indicator */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-4">
              <span className="text-amber-400 font-bold text-sm">{item.number}</span>
              <span className="uppercase tracking-[0.12em] text-[9px] px-2 py-1 rounded bg-neutral-800/60 text-neutral-400">
                {item.badge}
              </span>
            </div>

            {/* Premium image preview */}
            {item.image && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/60 mb-5 relative shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/creative_corner_art_1790612718363.jpg';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            )}

            {/* Editorial text */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-display font-bold text-white tracking-tight uppercase group-hover:text-amber-300 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed line-clamp-2">
                  {item.shortDesc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-neutral-800/50 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-500 group-hover:text-amber-400 transition-colors duration-200">
                <span>Explore Artifact</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-[2px] group-hover:-translate-y-[2px]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
