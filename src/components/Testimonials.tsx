import React from 'react';
import { MessageSquareQuote, Star, Award } from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-neutral-950 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>ENDORSEMENTS & COLLABORATIONS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
            What Leaders & Teams Say
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base">
            Feedback from engineering leaders, product managers, and founders who have collaborated with Rick.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              id={`testimonial-card-${t.id}`}
              className="p-6 sm:p-7 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-6 hover:border-amber-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/5"
            >
              {/* Quote text */}
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-neutral-300 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                <img
                  src={t.avatar}
                  alt={t.name}
                  loading="lazy"
                  className="w-11 h-11 rounded-full object-cover border border-neutral-700"
                />
                <div>
                  <h3 className="text-sm font-bold text-white">{t.name}</h3>
                  <p className="text-xs text-amber-400 font-mono">{t.role}, {t.company}</p>
                  <p className="text-[11px] text-neutral-500">{t.relation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
