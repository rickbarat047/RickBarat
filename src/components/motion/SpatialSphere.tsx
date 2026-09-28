import React, { useRef, useEffect, useState, useCallback } from 'react';
import { SPATIAL_OBJECTS, SpatialItem } from '../../data/spatialData';
import { ArrowUpRight } from 'lucide-react';

interface SpatialSphereProps {
  onSelectObject: (item: SpatialItem, rect: DOMRect) => void;
  isExploreMode: boolean;
}

// ---------------------------------------------------------------------------
// Pure 3D Quaternion & Trackball Mathematics
// ---------------------------------------------------------------------------

type Quat = [number, number, number, number]; // [w, x, y, z]
type Vec3 = [number, number, number];         // [x, y, z]

function quatMultiply(a: Quat, b: Quat): Quat {
  const [wa, xa, ya, za] = a;
  const [wb, xb, yb, zb] = b;
  return [
    wa * wb - xa * xb - ya * yb - za * zb,
    wa * xb + xa * wb + ya * zb - za * yb,
    wa * yb - xa * zb + ya * wb + za * xb,
    wa * zb + xa * yb - ya * xb + za * wb,
  ];
}

function quatNormalize(q: Quat): Quat {
  const len = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len];
}

function quatFromAxisAngle(axis: Vec3, angleRad: number): Quat {
  const half = angleRad / 2;
  const s = Math.sin(half);
  return [Math.cos(half), axis[0] * s, axis[1] * s, axis[2] * s];
}

function quatFromEuler(pitchDeg: number, yawDeg: number): Quat {
  const pitchRad = (pitchDeg * Math.PI) / 180;
  const yawRad = (yawDeg * Math.PI) / 180;

  const cy = Math.cos(yawRad / 2);
  const sy = Math.sin(yawRad / 2);
  const cp = Math.cos(pitchRad / 2);
  const sp = Math.sin(pitchRad / 2);

  const qy: Quat = [cy, 0, sy, 0];
  const qx: Quat = [cp, sp, 0, 0];
  return quatNormalize(quatMultiply(qy, qx));
}

function quatToMatrix3d(q: Quat, tz: number = 0): string {
  const [w, x, y, z] = q;
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;

  const m00 = (1 - (yy + zz)).toFixed(6);
  const m01 = (xy - wz).toFixed(6);
  const m02 = (xz + wy).toFixed(6);

  const m10 = (xy + wz).toFixed(6);
  const m11 = (1 - (xx + zz)).toFixed(6);
  const m12 = (yz - wx).toFixed(6);

  const m20 = (xz - wy).toFixed(6);
  const m21 = (yz + wx).toFixed(6);
  const m22 = (1 - (xx + yy)).toFixed(6);

  // Column-major order matrix3d
  return `matrix3d(${m00}, ${m10}, ${m20}, 0, ${m01}, ${m11}, ${m21}, 0, ${m02}, ${m12}, ${m22}, 0, 0, 0, ${tz.toFixed(2)}, 1)`;
}

function rotateVec3ByQuat(v: Vec3, q: Quat): Vec3 {
  const [vx, vy, vz] = v;
  const [w, qx, qy, qz] = q;

  // Rodrigues formula: v' = v + w * t + cross(q.xyz, t), where t = 2 * cross(q.xyz, v)
  const tx = 2 * (qy * vz - qz * vy);
  const ty = 2 * (qz * vx - qx * vz);
  const tz = 2 * (qx * vy - qy * vx);

  return [
    vx + w * tx + (qy * tz - qz * ty),
    vy + w * ty + (qz * tx - qx * tz),
    vz + w * tz + (qx * ty - qy * tx),
  ];
}

// Project screen coordinates to 3D unit vector on virtual trackball
function projectToTrackball(
  px: number,
  py: number,
  cx: number,
  cy: number,
  radius: number
): Vec3 {
  const x = (px - cx) / radius;
  const y = (py - cy) / radius;
  const d2 = x * x + y * y;

  let z: number;
  if (d2 <= 0.85) {
    z = Math.sqrt(1 - d2);
  } else {
    // Hyperbolic sheet outside trackball radius for continuous grabbing everywhere
    z = 0.85 / (2 * Math.sqrt(d2));
  }

  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
}

export const SpatialSphere: React.FC<SpatialSphereProps> = ({ onSelectObject, isExploreMode }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  // Responsive Radius R
  const [radius, setRadius] = useState<number>(280);

  // Authoritative Quaternion Orientation & Physics State
  const stateRef = useRef({
    q: quatFromEuler(8, 25), // Initial orientation matching original aesthetic
    omega: [0, 0, 0] as Vec3, // 3D angular velocity vector in camera space
    isDragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
    prevVec: [0, 0, 1] as Vec3,
    maxDist: 0,
    camZ: 0,
    camZTarget: 0,
  });

  // Cached Screen-Space Stage Center & Visual Radius
  const stageGeometryRef = useRef({
    cx: 0,
    cy: 0,
    r: 280,
  });

  const updateStageGeometry = useCallback(() => {
    if (stageRef.current) {
      const rect = stageRef.current.getBoundingClientRect();
      stageGeometryRef.current = {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
        r: Math.min(rect.width, rect.height) * 0.44,
      };
    }
  }, []);

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
      updateStageGeometry();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateStageGeometry]);

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

      // Handle friction & 3D momentum when not actively dragging
      if (!s.isDragging) {
        const speed = Math.hypot(s.omega[0], s.omega[1], s.omega[2]);

        if (speed > 1e-4) {
          const u: Vec3 = [s.omega[0] / speed, s.omega[1] / speed, s.omega[2] / speed];
          const stepQ = quatFromAxisAngle(u, speed);
          s.q = quatNormalize(quatMultiply(stepQ, s.q));

          // Physical 3D friction decay
          s.omega[0] *= 0.94;
          s.omega[1] *= 0.94;
          s.omega[2] *= 0.94;
        } else {
          // When momentum settles, maintain a gentle, premium idle drift around Y axis
          s.omega[0] = 0;
          s.omega[1] = 0;
          s.omega[2] = 0;

          const idleStep = quatFromAxisAngle([0, 1, 0], 0.0006);
          s.q = quatNormalize(quatMultiply(idleStep, s.q));
        }
      }

      // Ease camera dolly (camZ) with safety bounds [0, 54]
      s.camZ += (s.camZTarget - s.camZ) * 0.1;
      s.camZ = Math.max(0, Math.min(54, s.camZ));

      // Update #orb transform via full 3D rotation matrix
      if (orbRef.current) {
        orbRef.current.style.transform = quatToMatrix3d(s.q, s.camZ);
      }

      // Update #headline: counter-rotate via inverse quaternion to stay optically centered & upright
      if (headlineRef.current) {
        const headlineZ = (radius * 0.62).toFixed(2);
        const qInv: Quat = [s.q[0], -s.q[1], -s.q[2], -s.q[3]];
        headlineRef.current.style.transform = `${quatToMatrix3d(qInv, 0)} translateZ(${headlineZ}px)`;
      }

      // Compute Depth Shading for each sphere node in camera space
      const currentQ = s.q;
      spherePositions.forEach((pos, idx) => {
        const el = document.getElementById(`sphere-node-${idx}`);
        if (!el) return;

        // Model coordinate transformed into camera space
        const mx = pos.x * radius;
        const my = pos.y * radius;
        const mz = pos.z * radius;
        const rotated = rotateVec3ByQuat([mx, my, mz], currentQ);
        const z2 = rotated[2]; // Z depth in camera space (-radius to +radius)

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

  // Unified Pointer Drag Events (True Virtual Trackball / Arcball)
  const handlePointerDown = (e: React.PointerEvent) => {
    // For mouse, only primary button
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    updateStageGeometry();
    const geom = stageGeometryRef.current;
    const s = stateRef.current;

    s.isDragging = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
    s.maxDist = 0;
    s.omega = [0, 0, 0];

    // Compute start vector on trackball without modifying current orientation
    s.prevVec = projectToTrackball(e.clientX, e.clientY, geom.cx, geom.cy, geom.r);

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (!s.isDragging) return;

    const distFromStart = Math.hypot(e.clientX - s.startX, e.clientY - s.startY);
    if (distFromStart > s.maxDist) {
      s.maxDist = distFromStart;
    }

    const geom = stageGeometryRef.current;
    const currVec = projectToTrackball(e.clientX, e.clientY, geom.cx, geom.cy, geom.r);
    const prevVec = s.prevVec;

    // Cross product: axis of rotation in camera space = prevVec x currVec
    const ax = prevVec[1] * currVec[2] - prevVec[2] * currVec[1];
    const ay = prevVec[2] * currVec[0] - prevVec[0] * currVec[2];
    const az = prevVec[0] * currVec[1] - prevVec[1] * currVec[0];

    // Dot product: cos(angle)
    const dot = Math.max(-1, Math.min(1, prevVec[0] * currVec[0] + prevVec[1] * currVec[1] + prevVec[2] * currVec[2]));
    const angle = Math.acos(dot);
    const axisLen = Math.hypot(ax, ay, az);

    if (axisLen > 1e-6 && angle > 1e-5) {
      const gain = 1.85; // Natural 1:1 physical arcball response
      const effectiveAngle = angle * gain;
      const u: Vec3 = [ax / axisLen, ay / axisLen, az / axisLen];

      // Delta rotation in camera coordinates premultiplies the sphere orientation
      const deltaQ = quatFromAxisAngle(u, effectiveAngle);
      s.q = quatNormalize(quatMultiply(deltaQ, s.q));

      // Angular velocity vector for smooth 3D momentum
      const instantOmega: Vec3 = [u[0] * effectiveAngle, u[1] * effectiveAngle, u[2] * effectiveAngle];
      s.omega = [
        s.omega[0] * 0.25 + instantOmega[0] * 0.75,
        s.omega[1] * 0.25 + instantOmega[1] * 0.75,
        s.omega[2] * 0.25 + instantOmega[2] * 0.75,
      ];
    }

    s.prevVec = currVec;
    s.lastX = e.clientX;
    s.lastY = e.clientY;
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
        touchAction: 'none',
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
          transformStyle: 'preserve-3d',
        }}
      >
        {/* #orb: Rotates with full 3D Quaternion Orientation */}
        <div
          ref={orbRef}
          id="orb"
          className="relative preserve-3d"
          style={{
            width: 0,
            height: 0,
            transformStyle: 'preserve-3d',
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
                  transition: 'border-color 0.2s, box-shadow 0.2s',
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

          {/* #headline: Centered in exact sphere origin, counter-rotating against sphere via inverse quaternion */}
          <div
            ref={headlineRef}
            id="headline"
            className="absolute top-0 left-0 pointer-events-none select-none text-center preserve-3d flex flex-col items-center justify-center"
            style={{
              width: 'var(--hw, min(84vw, 360px))',
              height: '140px',
              marginLeft: 'calc(-1 * var(--hw, min(84vw, 360px)) / 2)',
              marginTop: '-70px',
              transformStyle: 'preserve-3d',
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
        <span className="hidden sm:inline">GRAB SPHERE TO ROTATE IN 3D · SCROLL FOR CAMERA DOLLY · TAP ITEM</span>
        <span className="sm:hidden">GRAB SPHERE TO ROTATE · TAP ITEM</span>
      </div>
    </div>
  );
};
