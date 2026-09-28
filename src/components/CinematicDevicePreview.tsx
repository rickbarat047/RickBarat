import React, { useRef, useState, useCallback } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue, 
  useReducedMotion 
} from 'motion/react';
import { 
  ArrowUpRight, 
  Lock, 
  Copy, 
  Check, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShoppingBag,
  Video,
  Layers
} from 'lucide-react';
import { useUISounds } from '../hooks/useUISounds';

interface CinematicDevicePreviewProps {
  url: string;
  name: string;
  image: string;
  category: string;
  year: string;
  index: number;
}

export const CinematicDevicePreview: React.FC<CinematicDevicePreviewProps> = ({
  url,
  name,
  image,
  category,
  year,
  index
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { playClick, playHover, playSuccess } = useUISounds();
  const shouldReduceMotion = useReducedMotion();
  const [isCopied, setIsCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Scroll-linked cinematic scale & depth tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Cinematic scale: enters slightly scaled down (0.92), expands to full scale (1.0) in focal zone, subtle ease out (0.96)
  const rawScale = useTransform(scrollYProgress, [0, 0.45, 0.7, 1], [0.92, 1, 1, 0.95]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.25, 0.85, 1], [0.7, 1, 1, 0.75]);
  
  // Smooth spring physics for scale
  const scale = useSpring(rawScale, { stiffness: 120, damping: 24 });
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 20 });

  // Parallax translation: outer frame moves with scroll, inner image shifts at counter-rate
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const glareX = useTransform(scrollYProgress, [0, 1], ["-20%", "120%"]);
  const ambientGlowY = useTransform(scrollYProgress, [0, 1], [-25, 25]);

  // Interactive 3D Perspective Tilt on desktop pointer hover
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 180,
    damping: 24
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 24
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }, [shouldReduceMotion, mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Clean domain display
  const domain = url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  // Copy link handler
  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(url).then(() => {
      setIsCopied(true);
      playSuccess();
      setTimeout(() => setIsCopied(false), 2200);
    }).catch(() => {});
  };

  // Specific tab icon based on project
  const isMunjoy = name.toLowerCase().includes('munjoy');
  const TabIcon = isMunjoy ? ShoppingBag : Video;

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full my-4 py-4 select-none perspective-[1200px]"
    >
      {/* Dynamic ambient back-glow responding to scroll position */}
      <motion.div 
        style={{ y: shouldReduceMotion ? 0 : ambientGlowY }}
        className="absolute -inset-4 sm:-inset-10 bg-gradient-to-b from-amber-500/12 via-amber-500/6 to-transparent rounded-[2.5rem] blur-3xl pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Outer cinematic scaled container with 3D perspective */}
      <motion.div
        style={{
          scale: shouldReduceMotion ? 1 : scale,
          opacity: shouldReduceMotion ? 1 : opacity,
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative will-change-transform"
      >
        <div className="relative rounded-2xl sm:rounded-3xl p-[1px] bg-gradient-to-b from-neutral-700/60 via-neutral-800/40 to-neutral-900/80 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)]">
          <div className="relative rounded-[15px] sm:rounded-[23px] overflow-hidden bg-neutral-950/95 border border-neutral-800/80 backdrop-blur-xl">
            
            {/* Top Browser Window Header / Chrome Toolbar */}
            <div className="px-3.5 py-2.5 sm:px-5 sm:py-3 bg-neutral-900/90 border-b border-neutral-800/90 flex items-center justify-between gap-3 text-xs font-mono select-none">
              
              {/* Left: Window Controls (Traffic Lights) & History arrows */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors shadow-sm" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-400 transition-colors shadow-sm" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors shadow-sm" />
                </div>

                <div className="hidden sm:flex items-center gap-1 text-neutral-600 pl-1 border-l border-neutral-800">
                  <ChevronLeft className="w-3.5 h-3.5 cursor-not-allowed opacity-50" />
                  <ChevronRight className="w-3.5 h-3.5 cursor-not-allowed opacity-50" />
                  <RotateCw className="w-3 h-3 text-neutral-500 ml-1 hover:text-neutral-300 cursor-pointer transition-colors" />
                </div>
              </div>

              {/* Center: Interactive Omnibox URL Capsule */}
              <div className="flex-1 max-w-[240px] sm:max-w-md mx-auto">
                <div className="flex items-center justify-between px-3 py-1 sm:px-3.5 sm:py-1 rounded-full bg-neutral-950/90 border border-neutral-800/90 text-[11px] sm:text-xs text-neutral-300 shadow-inner group/omnibox hover:border-neutral-700 transition-colors">
                  <div className="flex items-center gap-1.5 truncate">
                    <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate text-neutral-400 font-mono">
                      https://<span className="text-white font-medium">{domain}</span>
                    </span>
                  </div>

                  {/* Copy Link Action Button */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    title="Copy URL"
                    className="p-1 -mr-1 rounded-md text-neutral-500 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors shrink-0"
                    aria-label="Copy project URL"
                  >
                    {isCopied ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                        <Check className="w-3 h-3" />
                        <span className="hidden xs:inline">Copied</span>
                      </span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Right: Active Live Status Badge */}
              <div className="flex items-center gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] tracking-wider uppercase font-mono text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ONLINE</span>
                </a>

                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playClick()}
                  title={`Open ${name} in a new tab`}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label={`Open ${name} in new tab`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Sub-toolbar: Active Tab bar for authentic browser feel */}
            <div className="hidden sm:flex items-center px-4 pt-1.5 bg-neutral-900/60 border-b border-neutral-800/60 text-xs font-mono text-neutral-400">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-t-lg bg-neutral-950 border-t border-x border-neutral-800 text-neutral-200 text-[11px] font-medium">
                <TabIcon className="w-3 h-3 text-amber-400" />
                <span className="truncate max-w-[180px]">{name} — Production</span>
                <span className="text-neutral-500 text-[9px] ml-1">×</span>
              </div>
            </div>

            {/* Viewport Canvas with Inner Parallax & Specular Glare */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              onMouseEnter={() => playHover(1350)}
              className="group block relative aspect-[16/10] sm:aspect-video w-full overflow-hidden bg-neutral-950 cursor-pointer"
              aria-label={`Visit ${name} website`}
            >
              {/* Inner Parallax Image Layer */}
              <motion.div
                style={{
                  y: shouldReduceMotion ? 0 : imageY,
                }}
                className="absolute inset-0 -top-[7%] -bottom-[7%] w-full h-[114%] will-change-transform"
              >
                {!imageError ? (
                  <img 
                    src={image} 
                    alt={`${name} production preview interface`}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="w-full h-full object-cover object-top filter brightness-95 contrast-[1.02] transition-all duration-700 group-hover:scale-[1.025] group-hover:brightness-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 to-neutral-950 p-6 text-center">
                    <TabIcon className="w-12 h-12 text-amber-400/80 mb-3" />
                    <span className="text-xl font-display font-bold text-white mb-1">{name}</span>
                    <span className="text-xs font-mono text-neutral-400">{domain}</span>
                  </div>
                )}
              </motion.div>

              {/* Cinematic Specular Glare Effect */}
              <motion.div 
                style={{ x: shouldReduceMotion ? 0 : glareX }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none skew-x-12"
                aria-hidden="true"
              />

              {/* Subtle top & bottom shadow gradient */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-neutral-950/20 pointer-events-none" 
                aria-hidden="true" 
              />

              {/* Floating Bottom Card Overlays */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 flex items-end justify-between gap-3 pointer-events-none">
                
                {/* Project Badge */}
                <div className="px-3 py-2 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-xl pointer-events-auto">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                      {category}
                    </span>
                    <span className="text-neutral-500 font-mono text-[10px]">· {year}</span>
                  </div>
                  <span className="text-xs sm:text-sm font-display font-bold tracking-tight block mt-0.5">
                    {name}
                  </span>
                </div>

                {/* Floating "Open Site" pill button */}
                <div className="pointer-events-auto">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white text-neutral-950 text-xs sm:text-sm font-semibold shadow-2xl transition-all duration-300 group-hover:bg-amber-400 group-hover:scale-105 active:scale-95">
                    <span>Explore live</span>
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>

              </div>
            </a>

          </div>
        </div>
      </motion.div>
    </div>
  );
};
