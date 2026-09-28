import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Send,
  FileText, 
  Copy, 
  Check, 
  MapPin, 
  Sparkles,
  Code2
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { EditorialPortraitReveal } from './EditorialPortraitReveal';
import { MagneticButton } from './MagneticButton';

interface HeroProps {
  onOpenResume: () => void;
  onNavigateTo: (sectionId: string) => void;
}

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";

const SPOTLIGHT_R = 260;

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onNavigateTo }) => {
  const { playClick, playHover, playSuccess, playTransition } = useUISounds();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: -999, y: -999 });

  const heroRef = useRef<HTMLElement | null>(null);
  const mouse = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const smooth = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

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
    playTransition('in');
    onNavigateTo(sectionId);
  };

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-label="Rick Barat - Hero Section"
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      {/* Anchor point for Personal Introduction */}
      <div id="introduction" className="absolute top-0 pointer-events-none" />

      {/* Editorial Mask Reveal with Directional Light Sweep on Viewport Scroll Entry */}
      <EditorialPortraitReveal
        baseImage={BG_IMAGE_1}
        revealImage={BG_IMAGE_2}
        cursorX={cursorPos.x}
        cursorY={cursorPos.y}
        spotlightRadius={SPOTLIGHT_R}
      />

      {/* Status indicator: ● Available for projects */}
      <div className="absolute top-[8%] sm:top-[9%] left-0 right-0 flex justify-center z-50 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950/70 border border-white/15 backdrop-blur-md text-xs text-neutral-300 font-mono shadow-xl hero-anim hero-reveal" style={{ animationDelay: '0.1s' }}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80" />
          <span className="text-white font-medium">Rick Barat</span>
          <span className="text-white/30">/</span>
          <span className="text-emerald-400 font-medium">Available for projects</span>
        </div>
      </div>

      {/* Main Headline & Supporting Text */}
      <div className="absolute top-[18%] sm:top-[20%] left-0 right-0 flex flex-col items-center text-center px-6 max-w-4xl mx-auto pointer-events-none z-50">
        <h1 className="text-white flex flex-col items-center gap-3">
          {/* Rick Barat Name */}
          <span
            className="block font-display font-semibold text-2xl sm:text-3xl text-neutral-400 tracking-tight hero-anim hero-reveal"
            style={{ animationDelay: '0.15s' }}
          >
            Rick Barat
          </span>

          {/* Primary Editorial Headline */}
          <span
            className="block font-display font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.12] max-w-3xl text-balance hero-anim hero-reveal"
            style={{ animationDelay: '0.28s' }}
          >
            Building digital experiences, AI systems & tools that feel different.
          </span>
        </h1>

        {/* Supporting statement */}
        <p
          className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-neutral-300/90 max-w-2xl font-normal leading-relaxed hero-anim hero-fade font-sans text-balance"
          style={{ animationDelay: '0.45s' }}
        >
          Independent developer focused on modern web experiences, AI-powered applications and automation.
        </p>

        {/* Core ethos statement */}
        <div 
          className="mt-3 inline-flex items-center gap-2 text-xs font-mono text-amber-400/90 hero-anim hero-fade"
          style={{ animationDelay: '0.55s' }}
        >
          <span className="text-neutral-500 font-normal">&quot;</span>
          <span>I don&apos;t just know technologies. I build things.</span>
          <span className="text-neutral-500 font-normal">&quot;</span>
        </div>
      </div>

      {/* Bottom-left narrative block */}
      <div
        className="hidden sm:block absolute bottom-12 sm:bottom-16 left-8 md:left-14 max-w-[280px] lg:max-w-[320px] hero-anim hero-fade z-50 space-y-3"
        style={{ animationDelay: '0.7s' }}
      >
        <div className="text-xs text-neutral-400 font-mono flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>West Bengal, India · Remote</span>
        </div>
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
          BCA graduate from Techno India University. Turning complex ideas into intuitive websites, automation pipelines, and AI systems.
        </p>
        
        {/* Quick Email Copy */}
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
                <span className="text-emerald-400">Copied!</span>
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

      {/* Bottom-right action block: CTAs */}
      <div
        className="absolute bottom-8 sm:bottom-16 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[320px] flex flex-col items-start gap-4 hero-anim hero-fade z-50"
        style={{ animationDelay: '0.85s' }}
      >
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Primary CTA: Explore My Work */}
          <MagneticButton
            id="explore-work-btn"
            strength={0.38}
            onMouseEnter={() => playHover(1400)}
            onClick={() => handleScrollToSection('work')}
            className="bg-white hover:bg-neutral-200 text-neutral-950 text-sm font-semibold px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer shadow-xl transition-all duration-200"
          >
            <span>Explore My Work</span>
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          {/* Secondary CTA: Let's Work Together */}
          <MagneticButton
            id="work-together-btn"
            strength={0.32}
            onMouseEnter={() => playHover(1400)}
            onClick={() => handleScrollToSection('contact')}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm font-medium cursor-pointer flex items-center gap-2 transition-colors duration-200"
          >
            <Send className="w-4 h-4 text-amber-300" />
            <span>Let&apos;s Work Together</span>
          </MagneticButton>
        </div>

        {/* Credentials / Status */}
        <div className="flex items-center gap-3 text-xs font-mono text-neutral-400 pt-1">
          <span className="text-white">BCA · Techno India University</span>
          <span>·</span>
          <span className="text-emerald-400">Available</span>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => handleScrollToSection('what-i-build')}
        aria-label="Scroll down to exploration"
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
