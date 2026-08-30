import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Terminal as TerminalIcon, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  MapPin, 
  Layers, 
  Cpu, 
  Compass, 
  Code2,
  Send,
  Eye,
  Zap,
  Globe
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { RevealLayer } from './RevealLayer';

interface HeroProps {
  onOpenResume: () => void;
  onNavigateTo: (sectionId: string) => void;
}

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;

const ROLES = [
  "Full-Stack Architect",
  "Creative UI & Motion Specialist",
  "Distributed Systems Engineer",
  "AI Agent Pipeline Developer"
];

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onNavigateTo }) => {
  const { playClick, playHover, playSuccess, playTransition } = useUISounds();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });
  const [isLayerModalOpen, setIsLayerModalOpen] = useState(false);

  // Typewriter states
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const heroRef = useRef<HTMLElement | null>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smooth = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  // Typewriter animation effect - smooth, robust cycle through all ROLES
  useEffect(() => {
    const currentWord = ROLES[roleIndex];

    if (!isDeleting) {
      if (typedText.length < currentWord.length) {
        // Typing forward: append next character
        const timeout = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length + 1));
        }, 55);
        return () => clearTimeout(timeout);
      } else {
        // Word complete: hold so user can read comfortably
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
        return () => clearTimeout(timeout);
      }
    } else {
      if (typedText.length > 0) {
        // Backspacing: remove one character
        const timeout = setTimeout(() => {
          setTypedText(currentWord.slice(0, typedText.length - 1));
        }, 28);
        return () => clearTimeout(timeout);
      } else {
        // Fully erased: pause briefly and advance to next role
        const timeout = setTimeout(() => {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }, 360);
        return () => clearTimeout(timeout);
      }
    }
  }, [typedText, isDeleting, roleIndex]);

  // Mouse & touch tracking with smooth lerp
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (smooth.current.x < -500) {
        smooth.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouse.current = { x: touch.clientX, y: touch.clientY };
        if (smooth.current.x < -500) {
          smooth.current = { x: touch.clientX, y: touch.clientY };
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    const updateCursor = () => {
      if (mouse.current.x > -500 && mouse.current.y > -500) {
        smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
        smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
        setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      }
      rafRef.current = requestAnimationFrame(updateCursor);
    };

    rafRef.current = requestAnimationFrame(updateCursor);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    playSuccess();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleScrollToSection = (sectionId: string) => {
    playClick();
    playTransition('in');
    onNavigateTo(sectionId);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      {/* Layer 1: Base Image (z-10) with slow Ken Burns hero-zoom */}
      <div
        id="hero-base-image"
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom"
        style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
      />

      {/* Layer 2: Reveal Layer (z-30) showing BG_IMAGE_2 through soft circular spotlight */}
      <RevealLayer
        image={BG_IMAGE_2}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
        spotlightRadius={SPOTLIGHT_R}
      />

      {/* Subtle atmospheric vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-20 pointer-events-none" />

      {/* Status Pill Badge (Top Left / Centered under nav) */}
      <div className="absolute top-[8%] sm:top-[9%] left-0 right-0 flex justify-center z-50 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950/70 border border-white/20 backdrop-blur-md text-xs text-neutral-300 font-mono shadow-xl hero-anim hero-reveal" style={{ animationDelay: '0.1s' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
          <span className="text-white font-medium">{PERSONAL_INFO.name}</span>
          <span className="text-white/40">|</span>
          <span className="text-amber-400">Systems & Creative Engineering</span>
        </div>
      </div>

      {/* Layer 3: Main Heading (z-50) */}
      <div className="absolute top-[18%] sm:top-[20%] left-0 right-0 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pointer-events-none z-50">
        <h1 className="text-white flex flex-col items-center gap-2 sm:gap-3">
          {/* Greeting Line */}
          <span
            className="block font-display font-medium text-3xl sm:text-5xl md:text-6xl text-neutral-300 hero-anim hero-reveal tracking-tight"
            style={{ animationDelay: '0.2s' }}
          >
            Hi, I'm <span className="text-white font-extrabold font-display">Rick Barat</span>
          </span>

          {/* Role with prompt indicator and typewriter text */}
          <div
            className="inline-flex items-center justify-center flex-wrap gap-2 font-display font-bold text-2xl sm:text-4xl md:text-5xl text-amber-400 hero-anim hero-reveal tracking-tight min-h-[2.8rem] sm:min-h-[3.6rem]"
            style={{ animationDelay: '0.38s' }}
          >
            <span className="text-amber-500/80 font-mono text-xl sm:text-3xl font-normal select-none">&gt;</span>
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 bg-clip-text text-transparent">
              {typedText}
            </span>
            <span 
              className="inline-block w-[3px] sm:w-[4px] h-[0.85em] bg-amber-400 ml-0.5 translate-y-[2px] rounded-full animate-cursor shadow-sm shadow-amber-400/50" 
              aria-hidden="true"
            />
          </div>
        </h1>

        {/* Subtitle statement */}
        <p
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-neutral-300/90 max-w-2xl font-normal leading-relaxed hero-anim hero-fade font-sans"
          style={{ animationDelay: '0.55s' }}
        >
          Architecting high-performance web systems, distributed backends, and tactile digital experiences.
        </p>
      </div>

      {/* Layer 4: Bottom-left narrative block (z-50) */}
      <div
        className="hidden sm:block absolute bottom-12 sm:bottom-16 left-8 md:left-14 max-w-[280px] lg:max-w-[320px] hero-anim hero-fade z-50 space-y-3"
        style={{ animationDelay: '0.7s' }}
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-mono text-amber-300">
          <Compass className="w-3.5 h-3.5" />
          <span>SUBTERRANEAN & DIGITAL ARCHITECTURE</span>
        </div>
        <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-sans">
          Every layer of software records a chapter in engineering—from high-throughput distributed servers to interactive 3D WebGL spaces and autonomous neural pipelines.
        </p>
        
        {/* Quick Email Copy Chip */}
        <div className="pt-1 flex items-center gap-2">
          <button
            id="hero-quick-copy-email"
            type="button"
            onClick={handleCopyEmail}
            className="px-3 py-1.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 border border-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition-all shadow-md cursor-pointer hover:border-amber-400/60"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied {PERSONAL_INFO.email}!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>{PERSONAL_INFO.email}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Layer 5: Bottom-right action block (z-50) */}
      <div
        className="absolute bottom-8 sm:bottom-16 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[300px] flex flex-col items-start gap-4 sm:gap-5 hero-anim hero-fade z-50"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          Hover across the canvas to peel back the surface layer and reveal internal strata. Explore live projects, 3D labs, and technical benchmarks below.
        </p>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Primary Action Button */}
          <button
            id="start-exploring-btn"
            type="button"
            onMouseEnter={() => playHover(1400)}
            onClick={() => handleScrollToSection('projects')}
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 flex items-center gap-2 cursor-pointer shadow-xl"
          >
            <span>Explore Work</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Secondary Resume Button */}
          <button
            id="hero-resume-btn"
            type="button"
            onMouseEnter={() => playHover(1400)}
            onClick={() => {
              playClick();
              playTransition('in');
              onOpenResume();
            }}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium transition-all hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>Resume</span>
          </button>
        </div>

        {/* Quick stats indicator */}
        <div className="flex items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
          <span className="flex items-center gap-1 text-white">
            <span className="text-amber-400 font-bold">5+</span> Yrs Experience
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-white">
            <span className="text-emerald-400 font-bold">14+</span> Live Systems
          </span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => handleScrollToSection('projects')}
        aria-label="Scroll down to projects"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 text-white/50 hover:text-white transition-colors cursor-pointer animate-bounce hidden sm:block p-2"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase block mb-1">SCROLL DOWN</span>
        <div className="w-4 h-7 mx-auto rounded-full border-2 border-white/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-amber-400 rounded-full animate-pulse" />
        </div>
      </button>
    </section>
  );
};
