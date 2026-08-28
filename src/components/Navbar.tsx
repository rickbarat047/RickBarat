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
  Code2,
  ExternalLink,
  LogIn,
  LogOut,
  Bookmark,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playClickSound, playSwitchSound, getSoundState, setSoundState } from '../utils/soundEffects';
import { useAuth } from '../context/AuthContext';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setSoundActive(getSoundState());

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

  const toggleSound = () => {
    const newState = !soundActive;
    setSoundActive(newState);
    setSoundState(newState);
    if (newState) {
      playSwitchSound();
    }
  };

  const navLinks = [
    { name: 'Projects', href: '#projects', id: 'projects' },
    { name: 'Skills', href: '#skills', id: 'skills' },
    { name: 'Lab', href: '#lab', id: 'lab' },
    { name: 'Terminal', href: '#terminal', id: 'terminal' },
    { name: 'Experience', href: '#experience', id: 'experience' },
    { name: 'Contact', href: '#contact', id: 'contact' },
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
              playClickSound(900);
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
          {navLinks.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                id={`nav-item-${item.id}`}
                href={item.href}
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
            onClick={toggleSound}
            aria-label={soundActive ? "Mute audio effects" : "Enable audio effects"}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-colors"
            title={soundActive ? "Sound FX: Enabled" : "Sound FX: Muted"}
          >
            {soundActive ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-neutral-400" />
            )}
          </button>

          {/* Command Palette Trigger */}
          <button
            id="nav-command-menu-btn"
            type="button"
            onClick={() => {
              playClickSound();
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
          <button
            id="nav-resume-btn"
            type="button"
            onClick={() => {
              playClickSound();
              onOpenResume();
            }}
            className="hidden lg:flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-medium transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-amber-300" />
            <span>Resume</span>
          </button>

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
              onClick={() => {
                playClickSound();
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
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="fixed inset-0 z-[95] bg-black/90 backdrop-blur-2xl md:hidden pt-24 px-6 flex flex-col justify-between pb-10 animate-fadeIn"
        >
          <div className="space-y-3">
            <div className="text-xs uppercase tracking-widest text-neutral-400 font-mono mb-2">
              Portfolio Navigation
            </div>
            {navLinks.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium transition-all ${
                  activeSection === item.id
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span>{item.name}</span>
                <span className="text-xs font-mono text-neutral-500">#{item.id}</span>
              </a>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenResume();
                }}
                className="py-3 rounded-full bg-white/15 border border-white/20 text-white text-xs font-medium text-center hover:bg-white/25 flex items-center justify-center gap-1.5"
              >
                <FileText className="w-4 h-4 text-amber-300" />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCommandMenu();
                }}
                className="py-3 rounded-full bg-white/15 border border-white/20 text-white text-xs font-medium text-center hover:bg-white/25 flex items-center justify-center gap-1.5"
              >
                <Command className="w-4 h-4 text-amber-400" />
                <span>Command ⌘K</span>
              </button>
            </div>

            {/* Mobile Auth Button */}
            {user ? (
              <div className="p-3 rounded-2xl bg-white/10 border border-amber-400/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-amber-400/60" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{user.displayName || 'Member'}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{user.email}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs hover:bg-rose-500/30 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  signInWithGoogle();
                }}
                className="w-full py-3 rounded-full bg-white/15 border border-white/25 text-white text-xs font-semibold flex items-center justify-center gap-2 hover:bg-white/20 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Sign in with Google</span>
              </button>
            )}

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#contact');
              }}
              className="block w-full bg-[#e8702a] text-white py-3 rounded-full text-sm font-medium text-center hover:bg-[#d2611f] transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </>
  );
};
