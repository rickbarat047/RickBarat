import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Briefcase, 
  Layers, 
  FlaskConical, 
  Terminal, 
  Code2, 
  Send, 
  FileText, 
  Copy, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  X,
  Sparkles,
  Command as CommandIcon,
  Check,
  Zap
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { playClickSound, playSuccessChime, getSoundState, setSoundState } from '../utils/soundEffects';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (sectionId: string) => void;
  onOpenResume: () => void;
  onReplayIntro?: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
  onOpenResume,
  onReplayIntro
}) => {
  const [query, setQuery] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setSoundEnabled(getSoundState());
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Global key listener for Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        playClickSound();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'nav-projects',
      title: 'Navigate: Featured Projects',
      category: 'Navigation',
      icon: Briefcase,
      action: () => {
        onNavigateTo('projects');
        onClose();
      }
    },
    {
      id: 'nav-skills',
      title: 'Navigate: Technical Skills Matrix',
      category: 'Navigation',
      icon: Layers,
      action: () => {
        onNavigateTo('skills');
        onClose();
      }
    },
    {
      id: 'nav-lab',
      title: 'Navigate: Interactive Lab & Playground',
      category: 'Navigation',
      icon: FlaskConical,
      action: () => {
        onNavigateTo('lab');
        onClose();
      }
    },
    {
      id: 'nav-terminal',
      title: 'Navigate: Developer Terminal',
      category: 'Navigation',
      icon: Terminal,
      action: () => {
        onNavigateTo('terminal');
        onClose();
      }
    },
    {
      id: 'nav-experience',
      title: 'Navigate: Work Experience',
      category: 'Navigation',
      icon: Code2,
      action: () => {
        onNavigateTo('experience');
        onClose();
      }
    },
    {
      id: 'nav-contact',
      title: 'Navigate: Contact Rick Barat',
      category: 'Navigation',
      icon: Send,
      action: () => {
        onNavigateTo('contact');
        onClose();
      }
    },
    {
      id: 'action-gemini-chat',
      title: 'Ask Rick AI: Open Gemini 3 Chatbot (Multi-Turn)',
      category: 'AI Assistant',
      icon: Sparkles,
      action: () => {
        onClose();
        const btn = document.getElementById('open-gemini-chat-btn');
        if (btn) btn.click();
      }
    },
    {
      id: 'action-replay-intro',
      title: 'Replay System Intro & Boot Animation',
      category: 'Actions',
      icon: Zap,
      action: () => {
        onClose();
        if (onReplayIntro) {
          onReplayIntro();
        }
      }
    },
    {
      id: 'action-resume',
      title: 'Open Curriculum Vitae / Resume Modal',
      category: 'Actions',
      icon: FileText,
      action: () => {
        onClose();
        onOpenResume();
      }
    },
    {
      id: 'action-copy-email',
      title: `Copy Email: ${PERSONAL_INFO.email}`,
      category: 'Actions',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(PERSONAL_INFO.email);
        setCopiedEmail(true);
        playSuccessChime();
        setTimeout(() => {
          setCopiedEmail(false);
          onClose();
        }, 1500);
      }
    },
    {
      id: 'action-toggle-sound',
      title: soundEnabled ? 'Mute Sound Effects' : 'Unmute Sound Effects',
      category: 'Preferences',
      icon: soundEnabled ? VolumeX : Volume2,
      action: () => {
        const next = !soundEnabled;
        setSoundEnabled(next);
        setSoundState(next);
        playClickSound();
      }
    },
    {
      id: 'ext-github',
      title: 'Open GitHub Profile',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(PERSONAL_INFO.socials.github, '_blank');
        onClose();
      }
    },
    {
      id: 'ext-instagram',
      title: 'Open Instagram Profile (@rickbarat047)',
      category: 'External',
      icon: ExternalLink,
      action: () => {
        window.open(PERSONAL_INFO.socials.instagram, '_blank');
        onClose();
      }
    }
  ];

  const filteredActions = actions.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div 
      id="command-menu-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden text-left animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-800 bg-neutral-950/60">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            id="command-palette-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or jump to section..."
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-neutral-500"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-neutral-800 text-neutral-400 rounded border border-neutral-700">
            ESC to close
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 font-mono">
              No matching commands found for &quot;{query}&quot;.
            </div>
          ) : (
            filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`cmd-${item.id}`}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    item.action();
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-neutral-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 group-hover:text-amber-400 group-hover:border-amber-400/40 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-200 group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  {item.id === 'action-copy-email' && copiedEmail && (
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
          <span>Rick Barat — Navigation Spotlight</span>
          <span>Tip: Press ⌘K anywhere</span>
        </div>
      </div>
    </div>
  );
};
