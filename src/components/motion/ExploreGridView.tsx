import React from 'react';
import { motion } from 'motion/react';
import { SPATIAL_OBJECTS, SpatialItem } from '../../data/spatialData';
import { ArrowUpRight, Grid } from 'lucide-react';

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
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-800 pb-6 mb-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="uppercase tracking-widest">INDEX / FLAT GRID MODE</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-display font-black text-white uppercase tracking-tight">
            My World
          </h2>
        </div>

        <button
          type="button"
          onClick={onCloseGrid}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          ← Return to 3D Sphere
        </button>
      </div>

      {/* Grid of All 10 Spatial Artifacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPATIAL_OBJECTS.map((item) => (
          <div
            key={item.id}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSelectObject(item, rect);
            }}
            data-cursor-hover
            className="group relative rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-amber-400/80 p-5 flex flex-col justify-between transition-all duration-300 hover:bg-neutral-850 hover:shadow-2xl cursor-pointer overflow-hidden"
          >
            {/* Top Meta Line */}
            <div className="flex items-center justify-between text-xs font-mono text-neutral-500 mb-3">
              <span className="text-amber-400 font-bold">{item.number}</span>
              <span className="uppercase tracking-widest text-[10px] px-2 py-0.5 rounded bg-neutral-800/80 text-neutral-300">
                {item.badge}
              </span>
            </div>

            {/* Thumbnail Preview if present */}
            {item.image && (
              <div className="w-full h-36 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-4 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            )}

            {/* Title & Short Description */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight uppercase group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm font-sans text-neutral-400 leading-relaxed line-clamp-2">
                {item.shortDesc}
              </p>
            </div>

            {/* Bottom Action Hint */}
            <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs font-mono text-neutral-500 group-hover:text-amber-400 transition-colors">
              <span>EXPLORE ARTIFACT</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
