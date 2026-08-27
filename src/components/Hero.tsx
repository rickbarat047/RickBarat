import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Terminal as TerminalIcon, 
  FileText, 
  Copy, 
  Check, 
  Sparkles, 
  MapPin, 
  Zap, 
  ShieldCheck, 
  Users, 
  Code2,
  ExternalLink,
  Send
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playClickSound, playSuccessChime } from '../utils/soundEffects';

interface HeroProps {
  onOpenResume: () => void;
  onNavigateTo: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onNavigateTo }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const roles = [
    "Full-Stack Architect",
    "Distributed Systems Engineer",
    "Creative UI & Motion Specialist",
    "AI Agent Pipeline Developer"
  ];

  // Dynamic typewriter effect
  useEffect(() => {
    const currentFullRole = roles[currentRoleIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentFullRole.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullRole.slice(0, displayedText.length + 1));
        }, 65);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullRole.slice(0, displayedText.length - 1));
        }, 35);
      } else {
        setIsDeleting(false);
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentRoleIndex]);

  // Subtle interactive particle mesh on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1,
        alpha: Math.random() * 0.4 + 0.15,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.12 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        // Cursor repulsion
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120;
          p.x += (dx / dist) * force * 1.2;
          p.y += (dy / dist) * force * 1.2;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    playSuccessChime();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section 
      id="hero-section" 
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden bg-neutral-950"
    >
      {/* Background Interactive Particle Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0"
      />

      {/* Subtle Radial Glow Backdrops */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-10 w-[400px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 backdrop-blur-md shadow-inner text-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-neutral-300 font-medium">{PERSONAL_INFO.status}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              {PERSONAL_INFO.location}
            </span>
          </div>

          {/* Main Title & Role Typer */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-display">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">{PERSONAL_INFO.name}</span>
            </h1>
            
            <div className="h-12 sm:h-14 flex items-center justify-center">
              <p className="text-xl sm:text-2xl md:text-3xl text-neutral-300 font-mono flex items-center">
                <span className="text-amber-400 mr-2">&gt;</span>
                <span>{displayedText}</span>
                <span className="inline-block w-2.5 h-6 ml-1 bg-amber-400 animate-pulse" />
              </p>
            </div>

            <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {PERSONAL_INFO.tagline}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              id="hero-explore-work-btn"
              type="button"
              onClick={() => {
                playClickSound();
                onNavigateTo('projects');
              }}
              className="px-6 py-3 rounded-xl bg-amber-400 text-neutral-950 font-bold text-sm hover:bg-amber-300 transition-all duration-200 shadow-lg shadow-amber-500/20 hover:scale-[1.02] flex items-center gap-2"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-open-terminal-btn"
              type="button"
              onClick={() => {
                playClickSound(1000);
                onNavigateTo('terminal');
              }}
              className="px-5 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 font-medium text-sm hover:bg-neutral-800 hover:border-neutral-700 transition-all duration-200 flex items-center gap-2"
            >
              <TerminalIcon className="w-4 h-4 text-amber-400" />
              <span>Launch Terminal</span>
            </button>

            <button
              id="hero-view-cv-btn"
              type="button"
              onClick={() => {
                playClickSound();
                onOpenResume();
              }}
              className="px-5 py-3 rounded-xl bg-neutral-900/80 border border-neutral-800 text-neutral-300 font-medium text-sm hover:text-white hover:border-neutral-700 transition-all duration-200 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-neutral-400" />
              <span>Resume / CV</span>
            </button>

            <button
              id="hero-copy-email-btn"
              type="button"
              onClick={handleCopyEmail}
              className="px-4 py-3 rounded-xl bg-neutral-900/60 border border-neutral-800/80 text-neutral-400 hover:text-amber-400 hover:border-neutral-700 text-xs transition-colors flex items-center gap-2 group"
              title="Copy Rick's direct email"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied {PERSONAL_INFO.email}!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 group-hover:text-amber-400" />
                  <span>{PERSONAL_INFO.email}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm text-left">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Experience</span>
                <Code2 className="w-4 h-4 text-amber-400/80" />
              </div>
              <div className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.yearsOfExp}</div>
              <div className="text-xs text-neutral-400">Full-stack engineering</div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm text-left">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Shipped</span>
                <Zap className="w-4 h-4 text-amber-400/80" />
              </div>
              <div className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.completedProjects}</div>
              <div className="text-xs text-neutral-400">Web & cloud products</div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm text-left">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Reach</span>
                <Users className="w-4 h-4 text-amber-400/80" />
              </div>
              <div className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.usersServed}</div>
              <div className="text-xs text-neutral-400">Monthly active users</div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800/70 backdrop-blur-sm text-left">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-xs font-mono uppercase tracking-wider">Reliability</span>
                <ShieldCheck className="w-4 h-4 text-amber-400/80" />
              </div>
              <div className="text-2xl font-bold text-white font-display">{PERSONAL_INFO.uptimeRecord}</div>
              <div className="text-xs text-neutral-400">Distributed uptime</div>
            </div>
          </div>

          {/* Key Tech Chips */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-neutral-400">
            <span className="text-neutral-500 font-mono text-[11px] mr-1">CORE STACK:</span>
            {["TypeScript", "React 19", "Next.js", "Node.js", "PostgreSQL", "Gemini 2.5", "Redis", "Docker", "Tailwind"].map((tech) => (
              <span 
                key={tech} 
                className="px-2.5 py-1 rounded-md bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-amber-500/40 transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
