import React, { useEffect, useRef, useState } from 'react';

/**
 * BackgroundCanvas
 * 
 * High-performance, lightweight WebGL procedural background canvas.
 * Features:
 * - Persistent charcoal base (#09090b - #16161c) with deep slate undertones
 * - Organic, slow-moving fractal noise flow field
 * - Cursor-reactive light field with smooth inertia & gentle fluid displacement
 * - Native prefers-reduced-motion detection (freezes motion, maintains serene ambient depth)
 * - Automatic visibility-based pausing (0% GPU/CPU overhead when tab is hidden)
 * - Capped device pixel ratio (max 1.5x) to guarantee 60fps on high-res Retina displays
 * - Full WebGL context loss/recovery handling & graceful 2D canvas fallback
 */

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_mouse_active;
uniform float u_time;
uniform float u_reduced_motion;
uniform float u_scroll_velocity;

// 2D Simplex Noise implementation (GLSL 1.0 compatible)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,  // (3.0 - sqrt(3.0)) / 6.0
    0.366025403784439,  // 0.5 * (sqrt(3.0) - 1.0)
   -0.577350269189626,  // -1.0 + 2.0 * C.x
    0.024390243902439   // 1.0 / 41.0
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// 3-octave Fractal Brownian Motion for subtle atmospheric turbulence
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  mat2 rot = mat2(0.80, 0.60, -0.60, 0.80);
  for (int i = 0; i < 3; i++) {
    value += amplitude * snoise(p);
    p = rot * p * 2.05 + vec2(1.6, 2.4);
    amplitude *= 0.48;
  }
  return value;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float aspect = u_resolution.x / u_resolution.y;

  // Aspect-corrected space
  vec2 p = uv;
  p.x *= aspect;

  vec2 m = u_mouse;
  m.x *= aspect;

  // Scroll velocity influence with respect to prefers-reduced-motion
  float vel = (u_reduced_motion > 0.5) ? 0.0 : clamp(u_scroll_velocity, -3.5, 3.5);
  float velMag = abs(vel);

  // Time control: if prefers-reduced-motion is active, freeze time
  float t = (u_reduced_motion > 0.5) ? 1.0 : (u_time * 0.045);

  // Slow drifting offsets amplified organically by scroll direction and velocity
  vec2 drift = vec2(t * 0.03, t * 0.018 - vel * 0.05);

  // Distance to cursor
  float dist = length(p - m);

  // Gentle cursor repulsion/warp of the fluid field
  vec2 mouseDir = p - m;
  float mouseDistort = smoothstep(0.55, 0.0, dist) * u_mouse_active;
  vec2 warp = (mouseDir / (dist + 0.2)) * mouseDistort * 0.08;

  // Multi-scale procedural flow field with gentle domain warping and vertical scroll shear
  vec2 st = p * 1.5 + warp;
  st.y -= vel * 0.07;

  vec2 q = vec2(fbm(st + drift), fbm(st + vec2(4.3, 1.8) - drift * 0.6));
  float field = fbm(st + 1.6 * q + drift * 0.5);

  // Charcoal base palette
  // Base 0: #070709 (Very deep charcoal/obsidian)
  vec3 colBase0 = vec3(0.027, 0.027, 0.035);
  // Base 1: #0f0f14 (Rich dark charcoal slate)
  vec3 colBase1 = vec3(0.058, 0.058, 0.078);
  // Base 2: #161720 (Graphite crest)
  vec3 colCrest = vec3(0.088, 0.091, 0.120);

  // Blend procedural charcoal field
  float normField = field * 0.5 + 0.5;
  vec3 color = mix(colBase0, colBase1, smoothstep(0.2, 0.8, normField));
  color = mix(color, colCrest, pow(normField, 2.8) * 0.65);

  // Atmospheric scroll surge: subtle luminescence wake along the charcoal field during user motion
  float scrollSurge = smoothstep(0.04, 2.2, velMag) * 0.075;
  color += scrollSurge * vec3(0.14, 0.16, 0.22);

  // Cursor-reactive lighting:
  // 1. Broad soft ambient glow
  float broadGlow = smoothstep(0.70, 0.0, dist) * 0.14 * u_mouse_active;
  // 2. Focused warm-amber core spotlight
  float coreGlow = smoothstep(0.22, 0.0, dist) * 0.12 * u_mouse_active;

  // Luminous light colors: subtle warm amber & soft moonlight silver
  vec3 ambientLightCol = vec3(0.18, 0.20, 0.25);
  vec3 warmCoreCol = vec3(0.95, 0.76, 0.42);

  color += broadGlow * ambientLightCol;
  color += coreGlow * warmCoreCol;

  // Reveal noise textures under cursor light (catch-light)
  float ridgeCatch = pow(max(0.0, field * 0.5 + 0.5), 1.8) * (broadGlow * 1.4 + coreGlow * 2.0);
  color += ridgeCatch * vec3(0.22, 0.20, 0.18);

  // Micro film-grain dithering to prevent 8-bit banding on dark monitors
  float grainSeed = (u_reduced_motion > 0.5) ? 0.0 : fract(sin(u_time * 0.01) * 43758.5);
  float dither = (fract(sin(dot(gl_FragCoord.xy + grainSeed, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.018;
  color += dither;

  // Subtle natural vignette towards edges
  vec2 vigCoord = uv * (1.0 - uv);
  float vignette = clamp(pow(vigCoord.x * vigCoord.y * 15.0, 0.25), 0.0, 1.0);
  color *= mix(0.78, 1.0, vignette);

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

export interface BackgroundCanvasProps {
  /**
   * Normalized scroll velocity (positive for downward scroll, negative for upward).
   * Drives subtle organic fluid displacement and luminosity wake in the WebGL field.
   */
  scrollVelocity?: number;
}

export const BackgroundCanvas: React.FC<BackgroundCanvasProps> = ({ scrollVelocity = 0 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Scroll velocity refs for 60fps render-loop interpolation
  const scrollVelocityRef = useRef<number>(scrollVelocity);
  const smoothVelocityRef = useRef<number>(0);

  useEffect(() => {
    scrollVelocityRef.current = scrollVelocity;
  }, [scrollVelocity]);

  // Mouse & Lighting state refs
  const mousePos = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.4 });
  const targetMouse = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.4 });
  const mouseActive = useRef<number>(0.35); // Start with gentle ambient focus
  const targetActive = useRef<number>(0.4);

  // Animation frame & WebGL resources
  const rafId = useRef<number | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const startTimeRef = useRef<number>(performance.now());
  const lastFrameTimeRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // 1. Detect prefers-reduced-motion & listen for OS updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMotionChange);
      return () => mediaQuery.removeEventListener('change', handleMotionChange);
    } else {
      mediaQuery.addListener(handleMotionChange);
      return () => mediaQuery.removeListener(handleMotionChange);
    }
  }, []);

  // 2. Track Cursor & Touch coordinates with passive event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouse.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - (e.clientY / window.innerHeight) // Invert Y for WebGL bottom-left origin
      };
      targetActive.current = 1.0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        targetMouse.current = {
          x: touch.clientX / window.innerWidth,
          y: 1.0 - (touch.clientY / window.innerHeight)
        };
        targetActive.current = 0.85;
      }
    };

    const handleMouseLeave = () => {
      // Smoothly relax to resting focal point
      targetActive.current = 0.25;
      targetMouse.current = { x: 0.5, y: 0.4 };
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 3. Tab Visibility handling - pause when tab is inactive to preserve CPU & battery
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = !document.hidden;
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // 4. Initialize WebGL Context & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Request WebGL context with low power preference for sustained background efficiency
    const gl = (canvas.getContext('webgl', { 
      alpha: false, 
      depth: false, 
      stencil: false, 
      antialias: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false
    }) || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL is not supported in this environment, falling back to 2D canvas.');
      setWebglSupported(false);
      return;
    }

    glRef.current = gl;

    // Helper: Compile shader
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fragShader = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);

    if (!vertShader || !fragShader) {
      setWebglSupported(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglSupported(false);
      return;
    }

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setWebglSupported(false);
      return;
    }

    programRef.current = program;
    gl.useProgram(program);

    // Full-screen quad geometry (two triangles covering clip space [-1, -1] to [1, 1])
    const quadVertices = new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ]);

    const buffer = gl.createBuffer();
    bufferRef.current = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const aPositionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPositionLocation);
    gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uResolutionLoc = gl.getUniformLocation(program, 'u_resolution');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uMouseActiveLoc = gl.getUniformLocation(program, 'u_mouse_active');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uReducedMotionLoc = gl.getUniformLocation(program, 'u_reduced_motion');
    const uScrollVelocityLoc = gl.getUniformLocation(program, 'u_scroll_velocity');

    // Handle high-DPI scaling safely (cap at 1.5x for performance and battery longevity)
    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const displayWidth = Math.round(width * dpr);
      const displayHeight = Math.round(height * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Handle WebGL context loss & restoration gracefully
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };

    const handleContextRestored = () => {
      // Re-trigger setup on context restoration
      window.location.reload();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

    // Render loop with motion dampening & frame throttling (max 60fps)
    const render = (now: number) => {
      rafId.current = requestAnimationFrame(render);

      // Skip frame if page is hidden (e.g. background tab)
      if (!isVisibleRef.current) return;

      // Throttle to 60fps to prevent wasteful redraws on 120Hz/144Hz monitors
      const delta = now - lastFrameTimeRef.current;
      if (delta < 15.5) return;
      lastFrameTimeRef.current = now;

      // Smooth cursor interpolation (lerp)
      const lerpSpeed = prefersReducedMotion ? 0.18 : 0.07;
      mousePos.current.x += (targetMouse.current.x - mousePos.current.x) * lerpSpeed;
      mousePos.current.y += (targetMouse.current.y - mousePos.current.y) * lerpSpeed;
      mouseActive.current += (targetActive.current - mouseActive.current) * 0.05;

      // Smooth scroll velocity damping
      const targetVel = prefersReducedMotion ? 0 : (scrollVelocityRef.current || 0);
      smoothVelocityRef.current += (targetVel - smoothVelocityRef.current) * 0.12;

      const elapsed = (now - startTimeRef.current) * 0.001;

      gl.useProgram(program);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mousePos.current.x, mousePos.current.y);
      gl.uniform1f(uMouseActiveLoc, mouseActive.current);
      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform1f(uReducedMotionLoc, prefersReducedMotion ? 1.0 : 0.0);
      if (uScrollVelocityLoc) {
        gl.uniform1f(uScrollVelocityLoc, smoothVelocityRef.current);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    rafId.current = requestAnimationFrame(render);

    // Cleanup resources on unmount
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);

      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vertShader) gl.deleteShader(vertShader);
        if (fragShader) gl.deleteShader(fragShader);
      }
    };
  }, [prefersReducedMotion]);

  // Fallback 2D canvas renderer if WebGL is unavailable
  useEffect(() => {
    if (webglSupported) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render2DFallback = () => {
      const w = (canvas.width = window.innerWidth);
      const h = (canvas.height = window.innerHeight);

      // Charcoal dark gradient
      const bgGradient = ctx.createRadialGradient(
        targetMouse.current.x * w,
        (1.0 - targetMouse.current.y) * h,
        10,
        targetMouse.current.x * w,
        (1.0 - targetMouse.current.y) * h,
        w * 0.7
      );
      bgGradient.addColorStop(0, '#15151c');
      bgGradient.addColorStop(0.4, '#0d0d10');
      bgGradient.addColorStop(1, '#070709');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);
    };

    render2DFallback();
    window.addEventListener('resize', render2DFallback, { passive: true });
    return () => window.removeEventListener('resize', render2DFallback);
  }, [webglSupported]);

  return (
    <div 
      id="background-canvas-root"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        id="persistent-procedural-canvas"
        className="w-full h-full block"
        style={{
          // Hardware-accelerated presentation hint
          transform: 'translateZ(0)',
          willChange: 'transform'
        }}
      />
    </div>
  );
};
