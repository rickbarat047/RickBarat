import React from 'react';
import { SPATIAL_OBJECTS, SpatialItem } from '../../data/spatialData';
import { ArrowUpRight } from 'lucide-react';

interface MobileProjectCarouselProps {
  onSelectObject: (item: SpatialItem, rect: DOMRect) => void;
}

export const MobileProjectCarousel: React.FC<MobileProjectCarouselProps> = ({ onSelectObject }) => {
  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide">
        {SPATIAL_OBJECTS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              onSelectObject(item, rect);
            }}
            className="snap-center shrink-0 w-[78vw] max-w-[320px] rounded-2xl bg-neutral-900/90 border border-neutral-800 p-3 text-left cursor-pointer"
          >
            {item.image && (
              <div className="w-full h-40 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80 mb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).onerror = null;
                    (e.currentTarget as HTMLImageElement).src = '/assets/images/creative_corner_art_1790612718363.jpg';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between mb-1">
              <span className="text-amber-400 font-bold text-xs font-mono">{item.number}</span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 truncate max-w-[160px]">
                {item.badge}
              </span>
            </div>
            <h3 className="text-base font-display font-bold text-white uppercase tracking-tight mb-1">
              {item.title}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
              {item.shortDesc}
            </p>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-neutral-500">
              <span>EXPLORE ARTIFACT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};