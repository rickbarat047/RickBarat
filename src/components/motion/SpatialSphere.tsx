import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SPATIAL_OBJECTS, SpatialItem } from '../../data/spatialData';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface SpatialSphereProps {
  onSelectObject: (item: SpatialItem, rect: DOMRect) => void;
  isExploreMode: boolean;
}

export const SpatialSphere: React.FC<SpatialSphereProps> = ({ onSelectObject, isExploreMode }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  // Responsive Radius R
  const [radius, setRadius] = useState<number>(280);

  // Rotation angles & physics
  const stateRef = useRef({
    sx: 10,       // pitch (rotateX)
    sy: 25,       // yaw (rotateY)
    vx: 0,        // pitch velocity
    vy: 0.12,     // yaw velocity (idle rotation)
    isDragging: false,
    lastX: 0,
    lastY: 0,
    camZ: 0,
    camZTarget: 0,
    touchStartX: 0,
    touchStartY: 0,
    touchLocked: false,
    touchDirection: '' as 'horizontal' | 'vertical' | '',
    hasMoved: false,
    depths: [] as { opacity: number; brightness: number; zIndex: number; scale: number }[]
  });

  // Calculate radius based on window width
  useEffect(() => {
    const updateSize = () => {
      const w = window.innerWidth;
      if (w <= 390) {
        setRadius(Math.min(w * 0.38, 145));
      } else if (w <= 640) {
        setRadius(Math.min(w * 0.42, 175));
      } else if (w <= 1024) {
        setRadius(240);
      } else {
        setRadius(300);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Precompute Fibonacci sphere positions
  const N = SPATIAL_OBJECTS.length;
  const GA = Math.PI * (3 - Math.sqrt(5)); // Golden angle

  const spherePositions = SPATIAL_OBJECTS.map((_, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = i * GA;
    const x = Math.cos(theta) * rad;
    const z = Math.sin(theta) * rad;

    const lon = Math.atan2(x, z) * (180 / Math.PI);
    const lat = -Math.asin(Math.max(-1, Math.min(1, y))) * (180 / Math.PI);

    return { x, y: -y, z, lon, lat };
  });

  // Camera dolly driven by scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const p = Math.max(0, Math.min(1, scrollY / (window.innerHeight * 0.16)));
      stateRef.current.camZTarget = p * Math.min(64, radius * 0.12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [radius]);

  // Main 60fps Animation Loop: Orb Rotation, Headline Counter-Rotation, Depth Shading
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = stateRef.current;

      // Handle friction & momentum
      if (!s.isDragging) {
        // Idle gentle rotation when velocity drops
        if (Math.abs(s.vx) < 0.005 && Math.abs(s.vy) < 0.005) {
          s.vy = 0.05;
        } else {
          s.vx *= 0.93;
          s.vy *= 0.93;
        }

        s.sx += s.vx;
        s.sy += s.vy;
      }

      // Clamp pitch to avoid flipping upside down
      s.sx = Math.max(-70, Math.min(70, s.sx));

      // Ease camera dolly (camZ)
      s.camZ += (s.camZTarget - s.camZ) * 0.1;

      // Update #orb transform
      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(0, 0, ${s.camZ.toFixed(2)}px) rotateX(${s.sx.toFixed(2)}deg) rotateY(${s.sy.toFixed(2)}deg)`;
      }

      // Update #headline: counter-rotate against sphere, centered at exact sphere origin
      // JS transform strictly contains NO translateX, translateY, or translate(-50%, -50%)
      if (headlineRef.current) {
        const headlineZ = (radius * 0.62).toFixed(2);
        headlineRef.current.style.transform = `rotateX(${-s.sx.toFixed(2)}deg) rotateY(${-s.sy.toFixed(2)}deg) translateZ(${headlineZ}px)`;
      }

      // Compute Depth Shading for each sphere node
      const radX = (s.sx * Math.PI) / 180;
      const radY = (s.sy * Math.PI) / 180;
      const cosX = Math.cos(radX);
      const sinX = Math.sin(radX);
      const cosY = Math.cos(radY);
      const sinY = Math.sin(radY);

      spherePositions.forEach((pos, idx) => {
        const el = document.getElementById(`sphere-node-${idx}`);
        if (!el) return;

        // Coordinates in sphere model
        const mx = pos.x * radius;
        const my = pos.y * radius;
        const mz = pos.z * radius;

        // Rotate Y by sy
        const x1 = mx * cosY + mz * sinY;
        const z1 = -mx * sinY + mz * cosY;

        // Rotate X by sx
        const y2 = my * cosX - z1 * sinX;
        const z2 = my * sinX + z1 * cosX;

        // Normalize depth: z2 goes from -radius to +radius
        const depthNorm = Math.max(0, Math.min(1, (z2 + radius) / (2 * radius)));

        // Depth-based opacity & shading
        const opacity = (0.28 + 0.72 * depthNorm).toFixed(3);
        const brightness = (0.45 + 0.55 * depthNorm).toFixed(3);
        const zIndex = Math.round(depthNorm * 100);
        const scale = (0.84 + 0.22 * depthNorm).toFixed(3);

        el.style.opacity = opacity;
        el.style.filter = `brightness(${brightness})`;
        el.style.zIndex = zIndex.toString();
        el.style.pointerEvents = depthNorm > 0.35 ? 'auto' : 'none';
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [radius, spherePositions]);

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only primary mouse button
    if (e.button !== 0) return;
    const s = stateRef.current;
    s.isDragging = true;
    s.hasMoved = false;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.vx = 0;
    s.vy = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;

    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      s.hasMoved = true;
    }

    s.lastX = e.clientX;
    s.lastY = e.clientY;

    // Horizontal drag -> yaw (sy), Vertical drag -> pitch (sx)
    s.sy += dx * 0.32;
    s.sx -= dy * 0.32;
    s.vy = dx * 0.32;
    s.vx = -dy * 0.32;
  };

  const handleMouseUp = () => {
    stateRef.current.isDragging = false;
  };

  // Touch Events (Respect Mobile Vertical Scrolling)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const s = stateRef.current;
    s.isDragging = true;
    s.hasMoved = false;
    s.touchStartX = touch.clientX;
    s.touchStartY = touch.clientY;
    s.lastX = touch.clientX;
    s.lastY = touch.clientY;
    s.touchLocked = false;
    s.touchDirection = '';
    s.vx = 0;
    s.vy = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    const s = stateRef.current;
    if (!s.isDragging) return;

    const totalDx = touch.clientX - s.touchStartX;
    const totalDy = touch.clientY - s.touchStartY;

    // Detect gesture direction
    if (!s.touchLocked) {
      if (Math.abs(totalDy) > Math.abs(totalDx) && Math.abs(totalDy) > 6) {
        s.touchDirection = 'vertical';
        s.touchLocked = true;
        s.isDragging = false; // Give control back to native page scroll
        return;
      } else if (Math.abs(totalDx) > Math.abs(totalDy) && Math.abs(totalDx) > 6) {
        s.touchDirection = 'horizontal';
        s.touchLocked = true;
      }
    }

    if (s.touchDirection === 'horizontal') {
      const dx = touch.clientX - s.lastX;
      s.lastX = touch.clientX;
      s.lastY = touch.clientY;
      s.hasMoved = true;

      // Rotate sphere yaw on horizontal swipe
      s.sy += dx * 0.45;
      s.vy = dx * 0.45;
    }
  };

  const handleTouchEnd = () => {
    const s = stateRef.current;
    s.isDragging = false;
    s.touchLocked = false;
    s.touchDirection = '';
  };

  // Node Click with FLIP measurement
  const handleNodeClick = (item: SpatialItem, e: React.MouseEvent | React.TouchEvent) => {
    if (stateRef.current.hasMoved) return; // Ignore drag release clicks
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    onSelectObject(item, rect);
  };

  return (
    <div
      ref={stageRef}
      id="stage"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full h-[88vh] sm:h-screen overflow-hidden select-none cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
        isExploreMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        perspective: '1000px',
        WebkitPerspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Background Spatial Atmosphere */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-neutral-950/40 to-neutral-950" 
      />

      {/* #world: Exactly centered in viewport */}
      <div
        id="world"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d"
        style={{
          width: 0,
          height: 0,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* #orb: Rotates with pitch (sx) and yaw (sy) */}
        <div
          ref={orbRef}
          id="orb"
          className="relative preserve-3d"
          style={{
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Fibonacci Distributed Spatial Nodes */}
          {SPATIAL_OBJECTS.map((item, idx) => {
            const pos = spherePositions[idx];
            const px = pos.x * radius;
            const py = pos.y * radius;
            const pz = pos.z * radius;

            return (
              <div
                key={item.id}
                id={`sphere-node-${idx}`}
                onClick={(e) => handleNodeClick(item, e)}
                data-cursor-hover
                className="absolute top-0 left-0 preserve-3d group cursor-pointer"
                style={{
                  width: 'var(--node-w, 140px)',
                  height: 'var(--node-h, 170px)',
                  marginLeft: 'calc(-1 * var(--node-w, 140px) / 2)',
                  marginTop: 'calc(-1 * var(--node-h, 170px) / 2)',
                  transform: `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, ${pz.toFixed(2)}px) rotateY(${pos.lon.toFixed(2)}deg) rotateX(${pos.lat.toFixed(2)}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'border-color 0.2s, box-shadow 0.2s'
                }}
              >
                {/* Node Card Container */}
                <div className="w-full h-full rounded-xl bg-neutral-900/90 border border-neutral-800/90 p-2.5 sm:p-3 flex flex-col justify-between shadow-2xl backdrop-blur-md hover:border-amber-400/80 hover:bg-neutral-850 transition-all duration-300">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400">
                    <span className="text-amber-400 font-bold">{item.number}</span>
                    <span className="tracking-widest uppercase truncate max-w-[80px]">
                      {item.badge}
                    </span>
                  </div>

                  {/* Thumbnail Preview if available */}
                  {item.image ? (
                    <div className="my-1.5 w-full h-[62px] sm:h-[80px] rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800/80 relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  ) : (
                    <div className="my-1.5 w-full h-[62px] sm:h-[80px] rounded-lg bg-neutral-950/80 border border-neutral-800/60 p-2 flex flex-col justify-center">
                      <p className="text-[11px] sm:text-xs font-sans text-neutral-300 line-clamp-3 leading-snug">
                        {item.shortDesc}
                      </p>
                    </div>
                  )}

                  {/* Bottom Title & Action cue */}
                  <div className="flex items-end justify-between pt-1 border-t border-neutral-800/60">
                    <h3 className="text-xs sm:text-sm font-display font-bold text-white tracking-tight uppercase group-hover:text-amber-300 transition-colors truncate">
                      {item.title}
                    </h3>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </div>
                </div>
              </div>
            );
          })}

          {/* #headline: Centered in exact sphere origin, counter-rotating against sphere */}
          <div
            ref={headlineRef}
            id="headline"
            className="absolute top-0 left-0 pointer-events-none select-none text-center preserve-3d flex flex-col items-center justify-center"
            style={{
              width: 'var(--hw, min(84vw, 360px))',
              height: '140px',
              marginLeft: 'calc(-1 * var(--hw, min(84vw, 360px)) / 2)',
              marginTop: '-70px',
              transformStyle: 'preserve-3d'
            }}
          >
            <div className="space-y-1 sm:space-y-2">
              <span className="text-[10px] sm:text-xs font-mono tracking-[0.3em] uppercase text-neutral-400 block">
                RICK BARAT / 2026
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white tracking-tighter uppercase whitespace-nowrap leading-none drop-shadow-2xl">
                Hey, I&apos;m Rick.
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-serif italic text-amber-200/90 tracking-normal drop-shadow">
                welcome to my little corner of the internet.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Instructions Cue at Bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] font-mono text-neutral-400 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        <span className="hidden sm:inline">DRAG SPHERE TO ROTATE · SCROLL FOR CAMERA DOLLY · TAP ITEM</span>
        <span className="sm:hidden">SWIPE TO ROTATE · TAP ITEM</span>
      </div>
    </div>
  );
};
