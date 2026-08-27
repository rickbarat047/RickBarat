import React, { useState, useRef, useEffect } from 'react';
import { 
  Terminal as TerminalIcon, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  CornerDownLeft, 
  RotateCcw,
  Copy,
  Check
} from 'lucide-react';
import { PERSONAL_INFO, PROJECTS, SKILL_CATEGORIES } from '../data/portfolioData';
import { playTerminalBeep, playSuccessChime } from '../utils/soundEffects';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system' | 'custom';
  content: React.ReactNode;
}

export const InteractiveTerminal: React.FC = () => {
  const [inputVal, setInputVal] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const initialLines: TerminalLine[] = [
    {
      id: 'init-1',
      type: 'system',
      content: (
        <div className="space-y-1">
          <div className="text-amber-400 font-bold">
            Rick Barat Interactive Developer Terminal [Version 2.6.0-prod]
          </div>
          <div className="text-neutral-400 text-xs">
            Type <span className="text-amber-300 font-semibold underline">help</span> to view available commands or click quick action buttons below.
          </div>
        </div>
      )
    },
    {
      id: 'init-2',
      type: 'output',
      content: (
        <div className="text-emerald-400 text-xs">
          ✓ Host connected: ais-rick-barat-node01.sanfrancisco.us-west.cloud (Ping: 11ms)
        </div>
      )
    }
  ];

  const [lines, setLines] = useState<TerminalLine[]>(initialLines);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [lines]);

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
          <div className="space-y-1.5 text-xs">
            <div className="text-amber-400 font-semibold mb-1">AVAILABLE COMMANDS:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-neutral-300">
              <div><span className="text-amber-300 font-mono">about</span> - Summary of Rick Barat</div>
              <div><span className="text-amber-300 font-mono">skills</span> - Breakdown of core technologies</div>
              <div><span className="text-amber-300 font-mono">projects</span> - List of featured case studies</div>
              <div><span className="text-amber-300 font-mono">contact</span> - Rick's email & social links</div>
              <div><span className="text-amber-300 font-mono">hire</span> - Interactive employment inquiry</div>
              <div><span className="text-amber-300 font-mono">neofetch</span> - System specs & bio banner</div>
              <div><span className="text-amber-300 font-mono">cat resume.json</span> - View raw credentials</div>
              <div><span className="text-amber-300 font-mono">matrix</span> - Toggle matrix rain mode</div>
              <div><span className="text-amber-300 font-mono">clear</span> - Clear terminal screen</div>
            </div>
          </div>
        );
        break;

      case 'about':
        outputContent = (
          <div className="text-xs space-y-1 text-neutral-300 leading-relaxed">
            <div className="font-bold text-white text-sm">{PERSONAL_INFO.name} // {PERSONAL_INFO.title}</div>
            <div>{PERSONAL_INFO.bio}</div>
            <div className="text-amber-300 pt-1">
              Location: {PERSONAL_INFO.location} | Timezone: {PERSONAL_INFO.timezone}
            </div>
          </div>
        );
        break;

      case 'skills':
        outputContent = (
          <div className="text-xs space-y-2">
            <div className="text-amber-400 font-semibold">ENGINEERING COMPETENCIES:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-300">
              {SKILL_CATEGORIES.map(cat => (
                <div key={cat.id} className="p-2 rounded bg-neutral-900 border border-neutral-800">
                  <div className="text-amber-300 font-bold mb-1">{cat.name}</div>
                  <div className="text-neutral-400 text-[11px]">
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
            <div className="text-amber-400 font-semibold">FEATURED REPOSITORIES & CASE STUDIES:</div>
            <div className="space-y-1">
              {PROJECTS.map(p => (
                <div key={p.id} className="flex items-center justify-between text-neutral-300 p-1.5 rounded bg-neutral-900/60 border border-neutral-800">
                  <div>
                    <span className="text-amber-300 font-bold">{p.title}</span> - <span className="text-neutral-400">{p.tagline}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">{p.year}</span>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case 'contact':
        outputContent = (
          <div className="text-xs space-y-1.5 text-neutral-300">
            <div className="text-amber-400 font-bold">DIRECT CONTACT CHANNELS:</div>
            <div>Email: <a href={`mailto:${PERSONAL_INFO.email}`} className="text-amber-300 underline">{PERSONAL_INFO.email}</a></div>
            <div>GitHub: <a href={PERSONAL_INFO.socials.github} target="_blank" rel="noreferrer" className="text-cyan-400 underline">{PERSONAL_INFO.socials.github}</a></div>
            <div>Instagram: <a href={PERSONAL_INFO.socials.instagram} target="_blank" rel="noreferrer" className="text-pink-400 underline">{PERSONAL_INFO.socials.instagram}</a></div>
          </div>
        );
        break;

      case 'hire':
        playSuccessChime();
        outputContent = (
          <div className="p-3 rounded-lg bg-neutral-900 border border-amber-500/40 text-xs space-y-2">
            <div className="text-amber-300 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>STATUS: AVAILABLE FOR EXCITING ROLES</span>
            </div>
            <div className="text-neutral-300">
              Rick is currently evaluating full-time staff/senior software engineering opportunities and high-impact design engineering contracts.
            </div>
            <div className="pt-1">
              <a 
                href={`mailto:${PERSONAL_INFO.email}?subject=Exciting%20Opportunity%20for%20Rick%20Barat`}
                className="inline-block px-3 py-1.5 rounded bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300"
              >
                Send Direct Offer / Message &rarr;
              </a>
            </div>
          </div>
        );
        break;

      case 'neofetch':
        outputContent = (
          <div className="font-mono text-xs text-neutral-300 grid grid-cols-1 sm:grid-cols-2 gap-4 p-2 bg-neutral-950 rounded">
            <pre className="text-amber-400 text-[10px] leading-tight select-none">
{`
   .---.     Rick Barat @ Portfolio
  /     \\    -----------------------
 | () () |   OS: ArchLinux / macOS Darwin
  \\  _  /    Kernel: 6.10.2-arch1-1
   \`---\`     Uptime: 6+ Years Engineering
  /|   |\\    Shell: zsh 5.9 (x86_64-apple-darwin)
 / |   | \\   Theme: Amber Obsidian Dark
   |___|     Editor: Neovim / VS Code
   |   |     Memory: 64GB DDR5 / 0 Memory Leaks
`}
            </pre>
            <div className="space-y-1 text-[11px] self-center">
              <div><span className="text-amber-400 font-bold">Role:</span> {PERSONAL_INFO.title}</div>
              <div><span className="text-amber-400 font-bold">Location:</span> {PERSONAL_INFO.location}</div>
              <div><span className="text-amber-400 font-bold">Primary:</span> TypeScript, React, Next.js, Node</div>
              <div><span className="text-amber-400 font-bold">Architecture:</span> Distributed CRDT, WebSockets, GCP</div>
              <div><span className="text-amber-400 font-bold">Availability:</span> {PERSONAL_INFO.status}</div>
            </div>
          </div>
        );
        break;

      case 'cat':
        if (args[0] === 'resume.json' || args[0] === 'resume') {
          outputContent = (
            <pre className="p-2 rounded bg-neutral-950 text-amber-300 text-[11px] font-mono overflow-x-auto max-h-60">
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

      case 'matrix':
        setIsMatrixMode(!isMatrixMode);
        outputContent = (
          <div className="text-emerald-400 text-xs font-mono">
            Matrix mode {isMatrixMode ? 'DEACTIVATED' : 'ACTIVATED'}. Wake up, Neo...
          </div>
        );
        break;

      case 'sudo':
        outputContent = <div className="text-amber-400 text-xs font-mono">rick is not in the sudoers file. This incident will be reported to the terminal gods.</div>;
        break;

      case 'clear':
        setLines([]);
        setInputVal('');
        return;

      default:
        outputContent = (
          <div className="text-xs text-neutral-400">
            command not found: <span className="text-red-400">{trimmed}</span>. Type <span className="text-amber-300 underline font-mono">help</span> for a list of available commands.
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
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/10 text-amber-400 text-xs font-mono border border-amber-400/20">
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>INTERACTIVE UNIX SHELL</span>
          </div>
          <h2 className="text-3xl font-bold text-white font-display tracking-tight">
            Developer Console & Playground
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Execute terminal commands directly in the browser to query skills, project history, or run live diagnostics.
          </p>
        </div>

        {/* Terminal Window Frame */}
        <div 
          className={`rounded-2xl border ${
            isMatrixMode ? 'border-emerald-500/60 shadow-emerald-500/20' : 'border-neutral-800 shadow-2xl shadow-black/80'
          } bg-neutral-950 overflow-hidden transition-all duration-300 flex flex-col font-mono text-sm`}
          style={{ height: isExpanded ? '680px' : '440px' }}
        >
          {/* Terminal Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-xs font-mono text-neutral-400">
                rick@barat-workspace:~ (zsh)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="terminal-clear-btn"
                type="button"
                onClick={() => setLines([])}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs transition-colors"
                title="Clear screen"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                id="terminal-expand-btn"
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 text-xs transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Terminal Output Area */}
          <div 
            className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3 bg-neutral-950 font-mono text-xs sm:text-sm text-neutral-200"
            onClick={() => inputRef.current?.focus()}
          >
            {lines.map((line) => (
              <div key={line.id} className="space-y-1">
                {line.type === 'input' ? (
                  <div className="flex items-center gap-2 text-neutral-400">
                    <span className="text-amber-400">rick@barat:~$</span>
                    <span className="text-white font-bold">{line.content}</span>
                  </div>
                ) : (
                  <div className="pl-4 border-l-2 border-neutral-800 py-0.5">
                    {line.content}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Terminal Input Line */}
          <div className="p-3 bg-neutral-900/70 border-t border-neutral-800 flex items-center gap-2">
            <span className="text-amber-400 font-mono text-xs sm:text-sm font-bold pl-2 shrink-0">
              rick@barat:~$
            </span>
            <input
              ref={inputRef}
              id="terminal-command-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a command (e.g. help, about, skills, neofetch, hire)..."
              className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-neutral-600"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              id="terminal-submit-btn"
              type="button"
              onClick={() => executeCommand(inputVal)}
              className="p-1.5 rounded-md bg-amber-400 text-neutral-950 hover:bg-amber-300 transition-colors"
              title="Execute command"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
          <span className="text-neutral-500 font-mono text-[11px] mr-1">QUICK SHORTCUTS:</span>
          {['help', 'about', 'skills', 'projects', 'neofetch', 'hire', 'cat resume.json', 'clear'].map((cmd) => (
            <button
              key={cmd}
              id={`terminal-quick-${cmd.replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => handleQuickCommand(cmd)}
              className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-400/50 text-neutral-300 hover:text-amber-300 font-mono text-xs transition-colors"
            >
              ${cmd}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
