import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Code2,
  ExternalLink,
  LogIn,
  LogOut,
  Bookmark,
  User as UserIcon,
  ShieldCheck,
  ChevronRight,
  Compass
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { useAuth } from '../context/AuthContext';
import { MagneticButton } from './MagneticButton';

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
  const { user, userData, signInWithGoogle, logout } = useAuth();
  const { soundEnabled, toggleSound, playClick, playHover, playTransition, playSwitch } = useUISounds();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleToggleSound = () => {
    const next = toggleSound();
    if (next) {
      playSwitch();
    }
  };

  const navLinks = [
    { name: 'Introduction', href: '#hero', id: 'hero', icon: Compass, tag: 'PORTRAIT & BIO', number: '01' },
    { name: 'Projects', href: '#projects', id: 'projects', icon: Layers, tag: '04 WORKS & CASE STUDIES', number: '02' },
    { name: 'Skills', href: '#skills', id: 'skills', icon: Code2, tag: 'TECH ARCHITECTURE', number: '03' },
    { name: 'Lab', href: '#lab', id: 'lab', icon: FlaskConical, tag: '3D GRAPHICS & SHADERS', number: '04' },
    { name: 'Terminal', href: '#terminal', id: 'terminal', icon: Terminal, tag: 'UNIX CLI SANDBOX', number: '05' },
    { name: 'Experience', href: '#experience', id: 'experience', icon: Briefcase, tag: 'ENTERPRISE MILESTONES', number: '06' },
    { name: 'Contact', href: '#contact', id: 'contact', icon: Send, tag: 'GET IN TOUCH', number: '07' },
  ];

  const desktopNavLinks = navLinks.filter((item) => item.id !== 'hero');

  const handleNavClick = (href: string) => {
    playClick();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        id="lithos-navigation"
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-all duration-300 ${
          isScrolled
            ? 'bg-neutral-950/80 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3.5'
            : 'bg-transparent'
        }`}
      >
        {/* Left: Brand Logo & Wordmark */}
        <div className="flex items-center gap-3">
          <a
            id="brand-logo-btn"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              playClick(900);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Rick Barat Home"
          >
            {/* Geometric SVG Icon */}
            <svg
              width="26"
              height="26"
              viewBox="0 0 256 256"
              fill="#ffffff"
              className="transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
            >
              <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="text-white text-xl sm:text-2xl font-display font-bold tracking-tight">
              {PERSONAL_INFO.name}
            </span>
          </a>
        </div>

        {/* Center pill (desktop navigation) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2 py-1.5 items-center gap-1 shadow-lg">
          {desktopNavLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                id={`nav-item-${item.id}`}
                href={item.href}
                onMouseEnter={() => playHover(1600)}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white bg-white/25 shadow-sm font-semibold'
                    : 'text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="nav-sound-toggle"
            type="button"
            onClick={handleToggleSound}
            onMouseEnter={() => playHover(1400)}
            aria-label={soundEnabled ? "Mute audio effects" : "Enable audio effects"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-colors"
            title={soundEnabled ? "Sound FX: Enabled" : "Sound FX: Muted"}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Command Palette Trigger */}
          <button
            id="nav-command-menu-btn"
            type="button"
            onMouseEnter={() => playHover(1400)}
            onClick={() => {
              playClick();
              playTransition('in');
              onOpenCommandMenu();
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium transition-colors"
            title="Open Command Menu"
          >
            <Command className="w-3.5 h-3.5 text-amber-400" />
            <span>Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-black/40 text-neutral-300 rounded border border-white/15">⌘K</kbd>
          </button>

          {/* Resume Trigger */}
          <MagneticButton
            id="nav-resume-btn"
            strength={0.28}
            onMouseEnter={() => playHover(1400)}
            onClick={() => {
              playClick();
              playTransition('in');
              onOpenResume();
            }}
            className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium cursor-pointer transition-colors duration-200"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300 mr-1" />
            <span>Resume</span>
          </MagneticButton>

          {/* Google Sign-in / User Profile Section */}
          {user ? (
            <div className="relative">
              <button
                id="nav-user-profile-btn"
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2 sm:px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-amber-400/40 transition-all text-left"
                title={user.displayName || user.email || 'User Profile'}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover border border-amber-400/60"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-bold font-mono">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden sm:inline-block text-xs text-neutral-200 font-medium max-w-[90px] truncate">
                  {user.displayName?.split(' ')[0] || 'Member'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div 
                  id="nav-user-dropdown-menu"
                  className="absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-900/95 border border-neutral-700/80 backdrop-blur-xl shadow-2xl p-4 z-50 text-neutral-200 animate-fadeIn"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-amber-400/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold">
                        {user.displayName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-white truncate flex items-center gap-1.5">
                        <span>{user.displayName || 'Visitor'}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <div className="text-xs text-neutral-400 truncate font-mono">
                        {user.email}
                      </div>
                    </div>
                  </div>

                  {/* Stored Stats */}
                  <div className="py-2.5 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-amber-400 font-bold font-mono text-sm">
                        {userData?.bookmarkedProjectIds?.length || 0}
                      </div>
                      <div className="text-[11px] text-neutral-400">Saved Projects</div>
                    </div>
                    <div className="p-2 rounded-xl bg-neutral-950/60 border border-neutral-800">
                      <div className="text-cyan-400 font-bold font-mono text-sm">
                        {userData?.starredLabIds?.length || 0}
                      </div>
                      <div className="text-[11px] text-neutral-400">Starred Labs</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('#projects');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors flex items-center justify-between text-neutral-300"
                    >
                      <span className="flex items-center gap-2">
                        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                        View Bookmarks
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">#projects</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              id="nav-google-signin-btn"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={() => {
                playClick();
                signInWithGoogle();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium transition-all cursor-pointer shadow-sm hover:shadow-md"
              title="Sign in with Google to sync bookmarks & guestbook"
            >
              {/* Google G Logo SVG */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign In</span>
            </button>
          )}

          {/* Right (desktop): Sign Up / Let's Talk button in high contrast white */}
          <a
            id="desktop-signup-btn"
            href="#contact"
            onMouseEnter={() => playHover(1400)}
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#contact');
            }}
            className="hidden md:block bg-white text-gray-900 text-xs font-semibold px-5 py-2 rounded-full hover:bg-gray-100 transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Let's Talk
          </a>

          {/* Mobile Hamburger Button */}
          <button
            id="mobile-menu-toggle"
            type="button"
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Sophisticated Full-Screen Mobile Clip-Path Overlay Navigation */}
      <AnimatePresence mode="wait">
        {mobileMenuOpen && (
          <>
            {/* Leading Ambient Accent Blade for Layered Clip-Path Entrance */}
            <motion.div
              key="mobile-nav-underlay"
              initial={{
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
                opacity: 0.9,
              }}
              animate={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                opacity: 1,
                transition: {
                  duration: 0.46,
                  ease: [0.19, 1, 0.22, 1],
                },
              }}
              exit={{
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
                opacity: 0,
                transition: {
                  duration: 0.32,
                  ease: [0.16, 1, 0.3, 1],
                },
              }}
              style={{
                WebkitClipPath: 'inherit',
              }}
              className="fixed inset-0 z-[104] bg-gradient-to-br from-amber-500/30 via-orange-600/20 to-neutral-900 pointer-events-none md:hidden"
            />

            {/* Main Luxury Full-Screen Navigation Canvas */}
            <motion.div
              id="mobile-nav-overlay"
              key="mobile-nav-main"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
                opacity: 0.6,
              }}
              animate={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                opacity: 1,
                transition: {
                  clipPath: {
                    duration: 0.54,
                    ease: [0.19, 1, 0.22, 1],
                    delay: 0.04,
                  },
                  opacity: { duration: 0.28 },
                },
              }}
              exit={{
                clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
                opacity: 0.3,
                transition: {
                  clipPath: {
                    duration: 0.38,
                    ease: [0.16, 1, 0.3, 1],
                  },
                  opacity: { duration: 0.22 },
                },
              }}
              style={{
                WebkitClipPath: 'inherit',
              }}
              className="fixed inset-0 z-[105] w-screen h-[100dvh] bg-neutral-950/98 backdrop-blur-3xl md:hidden flex flex-col justify-between overflow-y-auto overscroll-contain px-5 sm:px-7 py-5 select-none"
            >
              {/* Atmospheric Background Lighting */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/12 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute bottom-16 left-0 w-72 h-72 bg-neutral-800/25 rounded-full blur-3xl pointer-events-none -z-10" />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none -z-10" />

              {/* Top Bar: Brand, SFX Toggle & Tactile Close */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-white shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 256 256" fill="#ffffff">
                      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-base font-display font-bold tracking-tight leading-none">
                      {PERSONAL_INFO.name}
                    </span>
                    <span className="text-[10px] font-mono text-amber-400/90 tracking-wider uppercase mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      SYSTEM DIRECTORY
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Sound Effects Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    className="min-h-[44px] px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-neutral-300 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-[11px] text-amber-300 font-semibold">SFX ON</span>
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-4 h-4 text-neutral-400" />
                        <span className="text-[11px] text-neutral-400">MUTED</span>
                      </>
                    )}
                  </button>

                  {/* Tactile Close Button (44px min touch target) */}
                  <button
                    id="mobile-overlay-close-btn"
                    type="button"
                    onClick={() => {
                      playClick();
                      setMobileMenuOpen(false);
                    }}
                    className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                    aria-label="Close navigation overlay"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Navigation Directory with Touch-Optimized Targets */}
              <div className="py-6 flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between px-1 mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    INDEX DIRECTORY
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    SELECT SECTION
                  </span>
                </div>

                <div className="space-y-2">
                  {navLinks.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <motion.a
                        key={item.id}
                        href={item.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{
                          duration: 0.32,
                          delay: 0.08 + index * 0.035,
                          ease: [0.19, 1, 0.22, 1],
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavClick(item.href);
                        }}
                        className={`min-h-[56px] flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] ${
                          isActive
                            ? 'bg-white/15 border border-amber-400/40 text-white shadow-lg shadow-amber-500/10 font-semibold'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/12 border border-white/5 text-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          {/* Monospace index counter */}
                          <span className="font-mono text-xs text-amber-400/80 font-medium w-5">
                            {item.number}
                          </span>

                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                              isActive
                                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md shadow-amber-400/30'
                                : 'bg-white/10 text-amber-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>

                          <div className="flex flex-col text-left">
                            <span className="text-base font-display font-semibold tracking-tight text-white">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono text-neutral-400 tracking-wider">
                              {item.tag}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isActive && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-medium bg-amber-400/20 border border-amber-400/50 text-amber-300">
                              ACTIVE
                            </span>
                          )}
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              isActive ? 'text-amber-300 translate-x-0.5' : 'text-neutral-500'
                            }`}
                          />
                        </div>
                      </motion.a>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Actions Hub & Profile */}
              <div className="space-y-3 pt-4 border-t border-white/10 shrink-0">
                {/* 2-Column Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setMobileMenuOpen(false);
                      onOpenResume();
                    }}
                    className="min-h-[48px] rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-amber-300" />
                    <span>Credentials & CV</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setMobileMenuOpen(false);
                      onOpenCommandMenu();
                    }}
                    className="min-h-[48px] rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/15 text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Command className="w-4 h-4 text-amber-400" />
                    <span>Terminal ⌘K</span>
                  </button>
                </div>

                {/* Google Auth / Visitor Profile Card */}
                {user ? (
                  <div className="p-3 rounded-xl bg-white/10 border border-amber-400/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {user.displayName?.[0] || 'U'}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">
                          {user.displayName || 'Visitor'}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate font-mono">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-medium hover:bg-rose-500/30 active:scale-95 transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setMobileMenuOpen(false);
                      signInWithGoogle();
                    }}
                    className="w-full min-h-[48px] rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign in with Google</span>
                  </button>
                )}

                {/* High Contrast Primary CTA */}
                <MagneticButton
                  strength={0.25}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('#contact');
                  }}
                  className="w-full min-h-[52px] bg-[#e8702a] hover:bg-[#d2611f] active:scale-[0.98] text-white py-3.5 rounded-2xl text-sm font-semibold text-center flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#e8702a]/25 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Start a Conversation</span>
                </MagneticButton>

                {/* Editorial Monospace Footer */}
                <div className="text-center pt-1 pb-1 flex items-center justify-center gap-2 text-[10px] font-mono text-neutral-500 tracking-wider">
                  <span>RICK BARAT</span>
                  <span>•</span>
                  <span>22°34'N 88°21'E</span>
                  <span>•</span>
                  <span>ARCHIVE ED. 2026</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
