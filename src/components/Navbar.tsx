import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Command, 
  Menu, 
  X, 
  FileText, 
  Send,
  Briefcase,
  Layers,
  FlaskConical,
  Code2
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playClickSound, playSwitchSound, getSoundState, setSoundState } from '../utils/soundEffects';

interface NavbarProps {
  onOpenCommandMenu: () => void;
  onOpenResume: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCommandMenu, 
  onOpenResume,
  activeSection 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  useEffect(() => {
    setSoundActive(getSoundState());

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    const newState = !soundActive;
    setSoundActive(newState);
    setSoundState(newState);
    if (newState) {
      playSwitchSound();
    }
  };

  const navLinks = [
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Skills', href: '#skills', icon: Layers },
    { name: 'Interactive Lab', href: '#lab', icon: FlaskConical },
    { name: 'Terminal', href: '#terminal', icon: Terminal },
    { name: 'Experience', href: '#experience', icon: Code2 },
    { name: 'Contact', href: '#contact', icon: Send },
  ];

  const handleNavClick = (href: string) => {
    playClickSound();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80 py-3 shadow-lg shadow-black/40' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand / Logo */}
        <a 
          id="nav-brand-logo"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            playClickSound(900);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-bold font-display text-lg shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            RB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-100 tracking-tight group-hover:text-amber-400 transition-colors">
                {PERSONAL_INFO.name}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5"></span>
                Available
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">Full Stack & Creative Engineer</p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 bg-neutral-900/60 p-1.5 rounded-full border border-neutral-800/70 backdrop-blur-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.name}
                id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 shadow-sm font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-neutral-950' : 'text-neutral-400'}`} />
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle"
            type="button"
            onClick={toggleSound}
            aria-label={soundActive ? "Mute audio effects" : "Enable audio effects"}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-amber-400 hover:border-neutral-700 transition-colors relative group"
            title={soundActive ? "Sound FX: On (Click to Mute)" : "Sound FX: Muted"}
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-500" />
            )}
            <span className="sr-only">Toggle Sound</span>
          </button>

          {/* Command Palette Trigger */}
          <button
            id="nav-command-menu-btn"
            type="button"
            onClick={() => {
              playClickSound();
              onOpenCommandMenu();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 text-xs transition-colors"
          >
            <Command className="w-3.5 h-3.5 text-amber-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-neutral-800 text-neutral-400 rounded border border-neutral-700">⌘K</kbd>
          </button>

          {/* Resume Modal Trigger */}
          <button
            id="nav-resume-btn"
            type="button"
            onClick={() => {
              playClickSound();
              onOpenResume();
            }}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400 hover:text-neutral-950 text-xs font-medium transition-all duration-200 shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume</span>
          </button>

          {/* Get in Touch CTA */}
          <a
            id="nav-contact-cta-btn"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 text-neutral-950 text-xs font-semibold hover:bg-amber-300 transition-all duration-200 shadow-sm hover:shadow-amber-400/20"
          >
            <span>Let's Talk</span>
            <Send className="w-3.5 h-3.5" />
          </a>

          {/* Mobile menu hamburger */}
          <button
            id="nav-mobile-hamburger-btn"
            type="button"
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="lg:hidden bg-neutral-950/95 border-b border-neutral-800 px-4 pt-4 pb-6 mt-2 shadow-2xl backdrop-blur-xl animate-fadeIn">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  id={`mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800/80 text-neutral-200 hover:text-amber-400 text-xs font-medium"
                >
                  <Icon className="w-4 h-4 text-amber-400" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
            <button
              id="mobile-nav-resume-btn"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-medium"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>View Resume</span>
            </button>

            <button
              id="mobile-nav-command-btn"
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandMenu();
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-medium"
            >
              <Command className="w-4 h-4 text-amber-400" />
              <span>Command Menu</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
