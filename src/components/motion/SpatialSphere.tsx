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
    spin: 25,     // base yaw
    tilt: 10,     // base pitch
    dragX: 0,     // accumulated horizontal drag
    dragY: 0,     // accumulated vertical drag
    sx: 10,       // pitch (rotateX)
    sy: 25,       // yaw (rotateY)
    vx: 0,        // pitch momentum
    vy: 0,        // yaw momentum
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    maxDist: 0,
    camZ: 0,
    camZTarget: 0,
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

  // Camera dolly driven by scroll - safely calibrated to document scrollable range
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
      const maxScroll = Math.max(1, scrollHeight - window.innerHeight);
      const p = Math.max(0, Math.min(1, scrollY / maxScroll));
      
      // Safety limit: camera moves forward smoothly but never moves sphere out of view
      const maxDolly = Math.min(50, radius * 0.14);
      stateRef.current.camZTarget = p * maxDolly;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [radius]);

  // Main 60fps Animation Loop: Orb Rotation, Headline Counter-Rotation, Depth Shading
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const s = stateRef.current;
      const pitchLimit = 32;

      // Handle friction & momentum
      if (!s.isDragging) {
        s.dragX += s.vy;
        s.dragY += s.vx;

        s.vx *= 0.94;
        s.vy *= 0.94;

        // Clamp dragY so momentum does not exceed pitch limit
        const currentSx = s.tilt + s.dragY;
        if (currentSx > pitchLimit) {
          s.dragY = pitchLimit - s.tilt;
          s.vx = 0;
        } else if (currentSx < -pitchLimit) {
          s.dragY = -pitchLimit - s.tilt;
          s.vx = 0;
        }

        // Idle gentle rotation when velocity drops
        if (Math.abs(s.vx) < 0.005 && Math.abs(s.vy) < 0.005) {
          s.vx = 0;
          s.vy = 0;
          s.spin += 0.04;
        }

        s.sy = s.spin + s.dragX;
        s.sx = s.tilt + s.dragY;
      }

      // Clamp pitch to avoid flipping upside down
      s.sx = Math.max(-pitchLimit, Math.min(pitchLimit, s.sx));

      // Ease camera dolly (camZ) with safety bounds [0, 54]
      s.camZ += (s.camZTarget - s.camZ) * 0.1;
      s.camZ = Math.max(0, Math.min(54, s.camZ));

      // Update #orb transform: rotateY(sy) rotateX(sx)
      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(0, 0, ${s.camZ.toFixed(2)}px) rotateY(${s.sy.toFixed(2)}deg) rotateX(${s.sx.toFixed(2)}deg)`;
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

  // Unified Pointer Drag Events (Touch + Mouse)
  const handlePointerDown = (e: React.PointerEvent) => {
    // For mouse, only primary button
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    const s = stateRef.current;
    s.isDragging = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.maxDist = 0;
    s.vx = 0;
    s.vy = 0;

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;

    const dx = e.clientX - s.lastX;
    const dy = e.clientY - s.lastY;

    const totalDist = Math.hypot(e.clientX - s.startX, e.clientY - s.startY);
    if (totalDist > s.maxDist) {
      s.maxDist = totalDist;
    }

    s.lastX = e.clientX;
    s.lastY = e.clientY;

    const pitchLimit = 32;
    const sensitivity = 0.13;

    // Both horizontal (dx) and vertical (dy) drag update the sphere!
    // Horizontal -> Yaw (sy)
    // Vertical -> Pitch (sx)
    s.dragX += dx * sensitivity;
    s.dragY += dy * sensitivity;

    // Clamp vertical tilt
    const currentSx = s.tilt + s.dragY;
    if (currentSx > pitchLimit) {
      s.dragY = pitchLimit - s.tilt;
    } else if (currentSx < -pitchLimit) {
      s.dragY = -pitchLimit - s.tilt;
    }

    s.sy = s.spin + s.dragX;
    s.sx = s.tilt + s.dragY;

    // Preserve velocities for natural momentum release
    s.vy = dx * sensitivity;
    s.vx = dy * sensitivity;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const s = stateRef.current;
    s.isDragging = false;

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    const s = stateRef.current;
    s.isDragging = false;

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {
      // Ignore
    }
  };

  // Node Click with Tap vs Drag Detection (mobile click slop ≈ 14px)
  const handleNodeClick = (item: SpatialItem, e: React.MouseEvent | React.PointerEvent) => {
    if (stateRef.current.maxDist > 14) return; // If moved more than slop, it's a drag
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    onSelectObject(item, rect);
  };

  return (
    <div
      ref={stageRef}
      id="stage"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className={`fixed inset-0 w-screen h-[100svh] h-[100dvh] overflow-hidden select-none cursor-grab active:cursor-grabbing transition-opacity duration-700 z-10 touch-none ${
        isExploreMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        perspective: '1000px',
        WebkitPerspective: '1000px',
        transformStyle: 'preserve-3d',
        touchAction: 'none'
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
