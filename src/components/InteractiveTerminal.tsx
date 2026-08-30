import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Terminal as TerminalIcon, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CornerDownLeft, 
  RotateCcw,
  Monitor,
  Cpu,
  Palette,
  Check,
  Zap,
  Info
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';
import { playTerminalBeep, playSuccessChime, playSwitchSound } from '../utils/soundEffects';
import { RevealOnScroll } from './RevealOnScroll';

export type TerminalTheme = 'modern' | 'crt' | 'hacker';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'custom';
  content: React.ReactNode;
}

interface ThemeConfig {
  id: TerminalTheme;
  name: string;
  shortName: string;
  badge: string;
  tag: string;
  host: string;
  prompt: string;
  cursorColor: string;
  windowClass: string;
  titlebarClass: string;
  outputClass: string;
  inputBarClass: string;
  submitBtnClass: string;
  chipClass: string;
  accentText: string;
  highlightText: string;
  subtleText: string;
  boxClass: string;
  hasScanlines: boolean;
  hasVignette: boolean;
}

const THEMES: Record<TerminalTheme, ThemeConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern Dark',
    shortName: 'Modern',
    badge: 'ZSH',
    tag: 'macOS / zsh',
    host: 'rick@barat-workspace:~ (zsh)',
    prompt: 'rick@barat:~$',
    cursorColor: 'bg-amber-400',
    windowClass: 'border-neutral-800 shadow-2xl shadow-black/90 bg-neutral-950',
    titlebarClass: 'bg-neutral-900/90 border-neutral-800 text-neutral-300',
    outputClass: 'bg-neutral-950 text-neutral-200',
    inputBarClass: 'bg-neutral-900/70 border-neutral-800',
    submitBtnClass: 'bg-amber-400 text-neutral-950 hover:bg-amber-300 shadow-sm',
    chipClass: 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 hover:border-amber-400/50 text-neutral-300 hover:text-amber-300',
    accentText: 'text-amber-400 font-bold',
    highlightText: 'text-amber-300',
    subtleText: 'text-neutral-400',
    boxClass: 'bg-neutral-900 border-neutral-800 text-neutral-300',
    hasScanlines: false,
    hasVignette: false,
  },
  crt: {
    id: 'crt',
    name: 'Classic CRT',
    shortName: 'Classic CRT',
    badge: 'VT100',
    tag: 'Amber Phosphor CRT',
    host: 'rick@vt100-crt-mon01:~ (tty1)',
    prompt: 'rick@crt:~$',
    cursorColor: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    windowClass: 'border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.18)] bg-[#0a0701]',
    titlebarClass: 'bg-[#181102]/95 border-amber-500/30 text-amber-300',
    outputClass: 'bg-[#0a0701] text-amber-200 crt-amber-glow',
    inputBarClass: 'bg-[#181102]/90 border-amber-500/30',
    submitBtnClass: 'bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-[0_0_14px_rgba(245,158,11,0.4)]',
    chipClass: 'bg-amber-950/40 hover:bg-amber-950/80 border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 crt-amber-glow',
    accentText: 'text-amber-400 font-bold crt-amber-glow',
    highlightText: 'text-amber-300 crt-amber-glow',
    subtleText: 'text-amber-500/80',
    boxClass: 'bg-[#181102]/70 border-amber-500/30 text-amber-200',
    hasScanlines: true,
    hasVignette: true,
  },
  hacker: {
    id: 'hacker',
    name: 'Hacker Green',
    shortName: 'Hacker Green',
    badge: 'MATRIX',
    tag: 'Matrix Cyber Shell',
    host: 'rick@matrix-node01:~ (root)',
    prompt: 'rick@matrix:~$',
    cursorColor: 'bg-emerald-400 shadow-[0_0_8px_#10b981]',
    windowClass: 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.22)] bg-[#020b04]',
    titlebarClass: 'bg-[#021808]/95 border-emerald-500/30 text-emerald-300',
    outputClass: 'bg-[#020b04] text-emerald-200 crt-green-glow',
    inputBarClass: 'bg-[#021808]/90 border-emerald-500/30',
    submitBtnClass: 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.45)]',
    chipClass: 'bg-emerald-950/40 hover:bg-emerald-950/80 border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 crt-green-glow',
    accentText: 'text-emerald-400 font-bold crt-green-glow',
    highlightText: 'text-emerald-300 crt-green-glow',
    subtleText: 'text-emerald-500/80',
    boxClass: 'bg-[#021808]/70 border-emerald-500/30 text-emerald-200',
    hasScanlines: true,
    hasVignette: true,
  },
};

const THEME_STORAGE_KEY = 'rick_terminal_theme';

export const InteractiveTerminal: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<TerminalTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as TerminalTheme;
      if (saved && (saved === 'modern' || saved === 'crt' || saved === 'hacker')) {
        return saved;
      }
    }
    return 'modern';
  });

  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const terminalOutputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isFirstMount = useRef<boolean>(true);

  const activeTheme = useMemo(() => THEMES[currentTheme], [currentTheme]);

  const initialLines: TerminalLine[] = [
    {
      id: 'init-1',
      type: 'system',
      content: (
        <div className="space-y-1">
          <div className="font-bold">
            Rick Barat Interactive Developer Terminal [Version 2.6.0-prod]
          </div>
          <div className="text-xs opacity-90">
            Type <span className="font-semibold underline">help</span> or switch themes via the titlebar controls to experience CRT, Hacker-Green, or Modern Dark mode.
          </div>
        </div>
      )
    },
    {
      id: 'init-2',
      type: 'output',
      content: (
        <div className="text-xs font-mono">
          ✓ Host connected: ais-rick-barat-node01.sanfrancisco.us-west.cloud (Latency: 11ms)
        </div>
      )
    }
  ];

  const [lines, setLines] = useState<TerminalLine[]>(initialLines);

  const scrollToBottom = () => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    scrollToBottom();
  }, [lines]);

  const changeTheme = (newTheme: TerminalTheme, logNotification = true) => {
    playSwitchSound();
    setCurrentTheme(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      // storage safety
    }

    if (logNotification) {
      const config = THEMES[newTheme];
      setLines((prev) => [
        ...prev,
        {
          id: `theme-switch-${Date.now()}`,
          type: 'system',
          content: (
            <div className="p-2 rounded border text-xs font-mono space-y-1 flex items-center justify-between"
              style={{
                borderColor: newTheme === 'hacker' ? 'rgba(16,185,129,0.4)' : newTheme === 'crt' ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.15)',
                backgroundColor: newTheme === 'hacker' ? 'rgba(2,24,8,0.7)' : newTheme === 'crt' ? 'rgba(24,17,2,0.7)' : 'rgba(23,23,23,0.7)'
              }}
            >
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" />
                <span>Theme switched to <strong>{config.name}</strong> ({config.tag})</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded border opacity-80 uppercase">
                {config.badge}
              </span>
            </div>
          )
        }
      ]);
    }
  };

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    playTerminalBeep(900);
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const newLines: TerminalLine[] = [
      ...lines,
      {
        id: `input-${Date.now()}`,
        type: 'input',
        content: trimmed
      }
    ];

    const lower = trimmed.toLowerCase();
    const args = lower.split(' ').slice(1);
    const command = lower.split(' ')[0];

    let outputContent: React.ReactNode = null;
    let lineType: TerminalLine['type'] = 'output';

    switch (command) {
      case 'help':
        outputContent = (
          <div className="space-y-2 text-xs">
            <div className="font-semibold uppercase tracking-wider">AVAILABLE COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 opacity-90">
              <div><span className="font-bold underline">about</span> - Summary of Rick Barat</div>
              <div><span className="font-bold underline">skills</span> - Breakdown of core technologies</div>
              <div><span className="font-bold underline">projects</span> - List of featured case studies</div>
              <div><span className="font-bold underline">contact</span> - Rick's email & social links</div>
              <div><span className="font-bold underline">hire</span> - Interactive employment inquiry</div>
              <div><span className="font-bold underline">theme &lt;name&gt;</span> - Switch terminal theme (crt, hacker, modern)</div>
              <div><span className="font-bold underline">neofetch</span> - System specs & bio banner</div>
              <div><span className="font-bold underline">cat resume.json</span> - View raw credentials</div>
              <div><span className="font-bold underline">ai &lt;question&gt;</span> - Query Rick's Gemini AI brain</div>
              <div><span className="font-bold underline">matrix</span> - Instant hacker green mode</div>
              <div><span className="font-bold underline">clear</span> - Clear terminal screen</div>
            </div>
          </div>
        );
        break;

      case 'theme':
        if (args.length === 0) {
          // Cycle or show list
          outputContent = (
            <div className="space-y-2 text-xs">
              <div className="font-bold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>TERMINAL THEME SELECTOR (Current: {activeTheme.name})</span>
              </div>
              <div className="space-y-1.5 pl-2 border-l-2 border-current opacity-90">
                <div>• <span className="font-bold underline">theme modern</span> - Clean, high-contrast modern dark mode</div>
                <div>• <span className="font-bold underline">theme crt</span> - Vintage amber phosphor CRT with scanlines</div>
                <div>• <span className="font-bold underline">theme hacker</span> - Cyberpunk matrix phosphor green</div>
              </div>
              <div className="text-[11px] opacity-75">
                Tip: You can also use the theme buttons in the terminal top bar.
              </div>
            </div>
          );
        } else {
          const target = args[0].toLowerCase();
          if (target === 'crt' || target === 'classic' || target === 'amber' || target === 'retro') {
            changeTheme('crt', false);
            outputContent = (
              <div className="text-xs font-mono space-y-1">
                <div>✓ Classic CRT Mode Activated: Warm amber phosphor raster scanlines enabled.</div>
              </div>
            );
          } else if (target === 'hacker' || target === 'matrix' || target === 'green' || target === 'cyber') {
            changeTheme('hacker', false);
            outputContent = (
              <div className="text-xs font-mono space-y-1">
                <div>✓ Hacker Green Mode Activated: Matrix cyber shell initialized.</div>
              </div>
            );
          } else if (target === 'modern' || target === 'dark' || target === 'zsh' || target === 'default') {
            changeTheme('modern', false);
            outputContent = (
              <div className="text-xs font-mono space-y-1">
                <div>✓ Modern Dark Mode Activated: Crisp obsidian developer aesthetic restored.</div>
              </div>
            );
          } else {
            outputContent = (
              <div className="text-xs text-red-400">
                Unknown theme: "{args[0]}". Valid options: <span className="font-bold underline">modern</span>, <span className="font-bold underline">crt</span>, <span className="font-bold underline">hacker</span>.
              </div>
            );
            lineType = 'error';
          }
        }
        break;

      case 'crt':
      case 'retro':
        changeTheme('crt', false);
        outputContent = <div className="text-xs font-mono">✓ Classic CRT Theme Activated.</div>;
        break;

      case 'matrix':
      case 'hacker':
        changeTheme('hacker', false);
        outputContent = <div className="text-xs font-mono">✓ Hacker Green Theme Activated. Wake up, Neo...</div>;
        break;

      case 'modern':
      case 'dark':
        changeTheme('modern', false);
        outputContent = <div className="text-xs font-mono">✓ Modern Dark Theme Activated.</div>;
        break;

      case 'about':
        outputContent = (
          <div className="text-xs space-y-1 leading-relaxed">
            <div className="font-bold text-sm">{PERSONAL_INFO.name} // {PERSONAL_INFO.title}</div>
            <div>{PERSONAL_INFO.bio}</div>
            <div className="pt-1 opacity-80">
              Location: {PERSONAL_INFO.location} | Timezone: {PERSONAL_INFO.timezone}
            </div>
          </div>
        );
        break;

      case 'skills':
        outputContent = (
          <div className="text-xs space-y-2">
            <div className="font-semibold">ENGINEERING COMPETENCIES:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SKILL_CATEGORIES.map(cat => (
                <div key={cat.id} className="p-2 rounded border"
                  style={{
                    backgroundColor: currentTheme === 'hacker' ? 'rgba(2,24,8,0.5)' : currentTheme === 'crt' ? 'rgba(24,17,2,0.5)' : 'rgba(23,23,23,0.6)',
                    borderColor: currentTheme === 'hacker' ? 'rgba(16,185,129,0.3)' : currentTheme === 'crt' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'
                  }}
                >
                  <div className="font-bold mb-1">{cat.name}</div>
                  <div className="text-[11px] opacity-80">
                    {cat.skills.map(s => s.name.split(' ')[0]).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'projects':
        outputContent = (
          <div className="text-xs space-y-1.5">
            <div className="font-semibold">FEATURED REPOSITORIES & CASE STUDIES:</div>
            <div className="space-y-1">
              {PROJECTS.map(p => (
                <div key={p.id} className="flex items-center justify-between p-1.5 rounded border"
                  style={{
                    backgroundColor: currentTheme === 'hacker' ? 'rgba(2,24,8,0.4)' : currentTheme === 'crt' ? 'rgba(24,17,2,0.4)' : 'rgba(23,23,23,0.5)',
                    borderColor: currentTheme === 'hacker' ? 'rgba(16,185,129,0.25)' : currentTheme === 'crt' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'
                  }}
                >
                  <div>
                    <span className="font-bold">{p.title}</span> - <span className="opacity-80">{p.tagline}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-90">{p.year}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        outputContent = (
          <div className="text-xs space-y-1.5">
            <div className="font-bold">DIRECT CONTACT CHANNELS:</div>
            <div>Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="underline font-semibold">{PERSONAL_INFO.email}</a></div>
            <div>GitHub: <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" className="underline">{PERSONAL_INFO.socials.github}</a></div>
            <div>Instagram: <a href={PERSONAL_INFO.socials.instagram} target="_blank" rel="noreferrer" className="underline">{PERSONAL_INFO.socials.instagram}</a></div>
          </div>
        );
        break;

      case 'hire':
        playSuccessChime();
        outputContent = (
          <div className="p-3 rounded-lg border text-xs space-y-2"
            style={{
              backgroundColor: currentTheme === 'hacker' ? 'rgba(2,24,8,0.7)' : currentTheme === 'crt' ? 'rgba(24,17,2,0.7)' : 'rgba(23,23,23,0.8)',
              borderColor: currentTheme === 'hacker' ? 'rgba(16,185,129,0.5)' : currentTheme === 'crt' ? 'rgba(245,158,11,0.5)' : 'rgba(245,158,11,0.4)'
            }}
          >
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>STATUS: AVAILABLE FOR HIGH-IMPACT ROLES & CONTRACTS</span>
            </div>
            <div className="opacity-90">
              Rick is currently evaluating full-time staff/senior software engineering opportunities and high-impact design engineering contracts.
            </div>
            <div className="pt-1">
              <a 
                href={`mailto:${PERSONAL_INFO.email}?subject=Exciting%20Opportunity%20for%20Rick%20Barat`}
                className={`inline-block px-3 py-1.5 rounded font-bold text-xs ${activeTheme.submitBtnClass}`}
              >
                Send Direct Message / Offer &rarr;
              </a>
            </div>
          </div>
        );
        break;

      case 'neofetch':
        outputContent = (
          <div className="font-mono text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 rounded"
            style={{
              backgroundColor: currentTheme === 'hacker' ? 'rgba(2,24,8,0.6)' : currentTheme === 'crt' ? 'rgba(24,17,2,0.6)' : 'rgba(10,10,10,0.8)'
            }}
          >
            <pre className="text-[10px] leading-tight select-none opacity-90">
{`
   .---.     Rick Barat @ Portfolio
  /     \\    -----------------------
 | () () |   OS: ArchLinux / macOS Darwin
  \\  _  /    Kernel: 6.10.2-arch1-1
   \`---\`     Uptime: 6+ Years Engineering
  /|   |\\    Shell: ${activeTheme.badge.toLowerCase()} 5.9 (x86_64-apple-darwin)
 / |   | \\   Theme: ${activeTheme.name}
   |___|     Editor: Neovim / VS Code
   |   |     Memory: 64GB DDR5 / 0 Leaks
`}
            </pre>
            <div className="space-y-1 text-[11px] self-center">
              <div><span className="font-bold">Role:</span> {PERSONAL_INFO.title}</div>
              <div><span className="font-bold">Location:</span> {PERSONAL_INFO.location}</div>
              <div><span className="font-bold">Primary:</span> TypeScript, React 19, Next.js, Node</div>
              <div><span className="font-bold">Architecture:</span> Distributed CRDT, WebSockets, Three.js</div>
              <div><span className="font-bold">Availability:</span> {PERSONAL_INFO.status}</div>
            </div>
          </div>
        );
        break;

      case 'cat':
        if (args[0] === 'resume.json' || args[0] === 'resume') {
          outputContent = (
            <pre className="p-2 rounded text-[11px] font-mono overflow-x-auto max-h-60 border"
              style={{
                backgroundColor: currentTheme === 'hacker' ? 'rgba(2,24,8,0.8)' : currentTheme === 'crt' ? 'rgba(24,17,2,0.8)' : 'rgba(10,10,10,0.8)',
                borderColor: currentTheme === 'hacker' ? 'rgba(16,185,129,0.3)' : currentTheme === 'crt' ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.1)'
              }}
            >
{JSON.stringify({
  candidate: PERSONAL_INFO.name,
  role: PERSONAL_INFO.title,
  email: PERSONAL_INFO.email,
  years_experience: PERSONAL_INFO.yearsOfExp,
  delivered_projects: PERSONAL_INFO.completedProjects,
  primary_technologies: ["Three.js / WebGL", "TypeScript", "React 19", "Next.js", "Node.js", "PostgreSQL", "Gemini AI", "Redis"],
  client_engagements: "Indian D2C Brands & Enterprise Clients, Synapse Cloud (US), Studio Kroma (India), Apex Interactive"
}, null, 2)}
            </pre>
          );
        } else {
          outputContent = <div className="text-red-400 text-xs">cat: {args[0] || 'file'}: No such file or directory. Try `cat resume.json`</div>;
          lineType = 'error';
        }
        break;

      case 'ai':
      case 'ask':
      case 'chat':
        if (args.length === 0) {
          const btn = document.getElementById('open-gemini-chat-btn');
          if (btn) btn.click();
          outputContent = (
            <div className="text-xs font-mono opacity-90">
              Opening Rick Barat Gemini AI multi-turn assistant... You can also query inline using `ai &lt;your question&gt;`
            </div>
          );
        } else {
          const userQuery = trimmed.replace(/^(ai|ask|chat)\s+/i, '');
          outputContent = (
            <div className="space-y-1.5 text-xs">
              <div className="font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Gemini AI Response:</span>
              </div>
              <div className="pl-2 border-l-2 border-current leading-relaxed opacity-95">
                {`Thinking on "${userQuery}"... Launching interactive multi-turn session in the floating assistant widget.`}
              </div>
            </div>
          );
          setTimeout(() => {
            const btn = document.getElementById('open-gemini-chat-btn');
            if (btn) btn.click();
          }, 300);
        }
        break;

      case 'sudo':
        outputContent = <div className="text-xs font-mono opacity-90">rick is not in the sudoers file. This incident will be reported to the terminal gods.</div>;
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      default:
        outputContent = (
          <div className="text-xs opacity-80">
            command not found: <span className="text-red-400 font-bold">{trimmed}</span>. Type <span className="underline font-mono font-bold">help</span> or <span className="underline font-mono font-bold">theme</span> for available commands.
          </div>
        );
        lineType = 'error';
        break;
    }

    setLines([...newLines, { id: `out-${Date.now()}`, type: lineType, content: outputContent }]);
    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(history[nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= history.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(history[nextIdx] || '');
      }
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setInputVal(cmd);
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <section id="terminal" className="py-20 bg-neutral-950 relative border-t border-neutral-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>INTERACTIVE UNIX SHELL</span>
            </div>
            <h2 className="text-3xl font-bold text-white font-display tracking-tight">
              Developer Console & Playground
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Execute terminal commands directly in the browser with customizable theme aesthetics (Classic CRT, Hacker Green, and Modern Dark).
            </p>
          </div>
        </RevealOnScroll>

        {/* Terminal Window Frame */}
        <RevealOnScroll direction="up" delay={120} duration={650} distance={28}>
          <div 
            className={`rounded-2xl border ${activeTheme.windowClass} overflow-hidden transition-all duration-300 flex flex-col font-mono text-sm relative group`}
            style={{ height: isExpanded ? '680px' : '460px' }}
          >
            {/* CRT Raster Scanline & Vignette Overlays for CRT & Hacker Green themes */}
            {activeTheme.hasScanlines && (
              <div className="absolute inset-0 crt-scanlines opacity-75 pointer-events-none z-20" />
            )}
            {activeTheme.hasVignette && (
              <div className="absolute inset-0 crt-vignette opacity-60 pointer-events-none z-20" />
            )}

            {/* Terminal Titlebar */}
            <div className={`flex flex-wrap items-center justify-between px-4 py-2.5 ${activeTheme.titlebarClass} border-b select-none relative z-30 gap-2`}>
              
              {/* Window Controls & Host Info */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="ml-2 text-xs font-mono truncate max-w-[200px] sm:max-w-none">
                  {activeTheme.host}
                </span>
              </div>

              {/* Theme Switcher Segmented Control & Actions */}
              <div className="flex items-center gap-2">
                
                {/* Theme Switcher Segmented Pills */}
                <div 
                  id="terminal-theme-switcher"
                  className="flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-[11px] font-mono"
                >
                  <button
                    id="terminal-theme-modern-btn"
                    type="button"
                    onClick={() => changeTheme('modern')}
                    className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                      currentTheme === 'modern' 
                        ? 'bg-neutral-800 text-amber-400 font-bold shadow-sm' 
                        : 'text-neutral-400 hover:text-neutral-200'
                    }`}
                    title="Switch to Modern Dark Mode"
                  >
                    <TerminalIcon className="w-3 h-3" />
                    <span className="hidden sm:inline">Modern</span>
                  </button>

                  <button
                    id="terminal-theme-crt-btn"
                    type="button"
                    onClick={() => changeTheme('crt')}
                    className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                      currentTheme === 'crt' 
                        ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm crt-amber-glow' 
                        : 'text-neutral-400 hover:text-amber-300'
                    }`}
                    title="Switch to Classic CRT Amber Phosphor Mode"
                  >
                    <Monitor className="w-3 h-3" />
                    <span className="hidden sm:inline">Classic CRT</span>
                  </button>

                  <button
                    id="terminal-theme-hacker-btn"
                    type="button"
                    onClick={() => changeTheme('hacker')}
                    className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all ${
                      currentTheme === 'hacker' 
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 shadow-sm crt-green-glow' 
                        : 'text-neutral-400 hover:text-emerald-300'
                    }`}
                    title="Switch to Hacker Green Matrix Mode"
                  >
                    <Cpu className="w-3 h-3" />
                    <span className="hidden sm:inline">Hacker Green</span>
                  </button>
                </div>

                {/* Clear Screen */}
                <button
                  id="terminal-clear-btn"
                  type="button"
                  onClick={() => setLines([])}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
                  title="Clear screen"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                {/* Expand / Collapse */}
                <button
                  id="terminal-expand-btn"
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 text-xs transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Terminal Output Area */}
            <div 
              ref={terminalOutputRef}
              className={`flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 font-mono text-xs sm:text-sm ${activeTheme.outputClass} relative z-10 transition-colors duration-200`}
              onClick={() => inputRef.current?.focus()}
            >
              {lines.map((line) => (
                <div key={line.id} className="space-y-1">
                  {line.type === 'input' ? (
                    <div className="flex items-center gap-2">
                      <span className="font-bold opacity-90">{activeTheme.prompt}</span>
                      <span className="font-bold">{line.content}</span>
                    </div>
                  ) : (
                    <div className="pl-4 border-l-2 border-current/25 py-0.5">
                      {line.content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Input Line */}
            <div className={`p-3 ${activeTheme.inputBarClass} border-t flex items-center gap-2 relative z-30 transition-colors duration-200`}>
              <span className="font-mono text-xs sm:text-sm font-bold pl-2 shrink-0">
                {activeTheme.prompt}
              </span>
              <input
                ref={inputRef}
                id="terminal-command-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Type a command (e.g. help, theme ${currentTheme === 'crt' ? 'hacker' : currentTheme === 'hacker' ? 'modern' : 'crt'}, skills)...`}
                className="flex-1 bg-transparent font-mono text-xs sm:text-sm focus:outline-none placeholder:opacity-40"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                id="terminal-submit-btn"
                type="button"
                onClick={() => executeCommand(inputVal)}
                className={`p-1.5 rounded-md ${activeTheme.submitBtnClass} transition-colors`}
                title="Execute command"
              >
                <CornerDownLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* Quick Command & Theme Switcher Chips */}
        <RevealOnScroll direction="up" delay={200} duration={600} distance={15}>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-neutral-500 font-mono text-[11px] mr-1">QUICK SHORTCUTS:</span>
            {[
              { label: '$help', cmd: 'help' },
              { label: '$about', cmd: 'about' },
              { label: '$skills', cmd: 'skills' },
              { label: '$projects', cmd: 'projects' },
              { label: '$theme crt', cmd: 'theme crt' },
              { label: '$theme hacker', cmd: 'theme hacker' },
              { label: '$theme modern', cmd: 'theme modern' },
              { label: '$neofetch', cmd: 'neofetch' },
              { label: '$hire', cmd: 'hire' },
              { label: '$clear', cmd: 'clear' }
            ].map(({ label, cmd }) => (
              <button
                key={cmd}
                id={`terminal-quick-${cmd.replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => handleQuickCommand(cmd)}
                className={`px-2.5 py-1 rounded font-mono text-xs transition-colors ${activeTheme.chipClass}`}
              >
                {label}
              </button>
            ))}
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
