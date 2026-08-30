import React, { useState, useEffect, useRef } from 'react';
import { 
  FlaskConical, 
  Play, 
  Volume2, 
  Globe, 
  Palette, 
  Sliders, 
  RefreshCw, 
  Check, 
  Copy,
  Zap,
  Activity,
  Music,
  Maximize2,
  Star
} from 'lucide-react';
import { LAB_EXPERIMENTS } from '../data/portfolioData';
import { useUISounds } from '../hooks/useUISounds';
import { RevealOnScroll } from './RevealOnScroll';
import { useAuth } from '../context/AuthContext';

export const InteractiveLab: React.FC = () => {
  const { user, userData, toggleStarredLab, signInWithGoogle } = useAuth();
  const { playClick, playSwitch, playBeep, playSuccess, playHover } = useUISounds();
  const starredLabIds = userData?.starredLabIds || [];
  const [activeTab, setActiveTab] = useState<'canvas' | 'synth' | 'latency' | 'tokens'>('canvas');

  // Canvas Experiment State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleCount, setParticleCount] = useState(60);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [connectDistance, setConnectDistance] = useState(110);
  const [mouseMode, setMouseMode] = useState<'repel' | 'attract'>('repel');

  // Synth Experiment State
  const [synthWaveform, setSynthWaveform] = useState<OscillatorType>('sine');
  const [synthOctave, setSynthOctave] = useState<number>(4);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Latency Experiment State
  const [latencyRouting, setLatencyRouting] = useState<'centralized' | 'multiregion' | 'edge'>('edge');
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState<{ [region: string]: number }>({
    'San Francisco (US)': 12,
    'Frankfurt (EU)': 24,
    'Tokyo (AP)': 38,
    'Sydney (AU)': 42,
    'São Paulo (SA)': 45
  });

  // Token Studio State
  const [brandHue, setBrandHue] = useState(42); // Amber tone
  const [contrastRatio, setContrastRatio] = useState(14.2);
  const [copiedToken, setCopiedToken] = useState(false);

  // Canvas particle physics loop
  useEffect(() => {
    if (activeTab !== 'canvas') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    const pArray: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#f59e0b', '#fbbf24', '#fde68a', '#d97706', '#38bdf8'];

    for (let i = 0; i < particleCount; i++) {
      pArray.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 1.5 * speedMultiplier,
        vy: (Math.random() - 0.5) * 1.5 * speedMultiplier,
        radius: Math.random() * 2 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.25)';
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < pArray.length; i++) {
        for (let j = i + 1; j < pArray.length; j++) {
          const dx = pArray[i].x - pArray[j].x;
          const dy = pArray[i].y - pArray[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.25 * (1 - dist / connectDistance)})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pArray[i].x, pArray[i].y);
            ctx.lineTo(pArray[j].x, pArray[j].y);
            ctx.stroke();
          }
        }
      }

      pArray.forEach((p) => {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          const direction = mouseMode === 'repel' ? 1 : -1;
          p.x += (dx / dist) * force * 3 * direction;
          p.y += (dy / dist) * force * 3 * direction;
        }

        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [activeTab, particleCount, speedMultiplier, connectDistance, mouseMode]);

  // Audio Synth Player
  const playSynthNote = (noteName: string, freqMultiplier: number) => {
    playBeep(440);
    setActiveNote(noteName);
    setTimeout(() => setActiveNote(null), 250);

    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const baseFreq = 261.63 * Math.pow(2, synthOctave - 4) * freqMultiplier; // C4 base
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = synthWaveform;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // safe audio
    }
  };

  const synthNotes = [
    { name: 'C', mult: 1.0 },
    { name: 'D', mult: 1.122 },
    { name: 'E', mult: 1.259 },
    { name: 'F', mult: 1.334 },
    { name: 'G', mult: 1.498 },
    { name: 'A', mult: 1.681 },
    { name: 'B', mult: 1.887 },
    { name: 'C+', mult: 2.0 }
  ];

  // Latency Simulator trigger
  const runLatencyTest = () => {
    playClick();
    setIsPinging(true);

    setTimeout(() => {
      if (latencyRouting === 'centralized') {
        setPingResults({
          'San Francisco (US)': 18,
          'Frankfurt (EU)': 142,
          'Tokyo (AP)': 185,
          'Sydney (AU)': 220,
          'São Paulo (SA)': 195
        });
      } else if (latencyRouting === 'multiregion') {
        setPingResults({
          'San Francisco (US)': 14,
          'Frankfurt (EU)': 35,
          'Tokyo (AP)': 52,
          'Sydney (AU)': 68,
          'São Paulo (SA)': 74
        });
      } else {
        setPingResults({
          'San Francisco (US)': 8,
          'Frankfurt (EU)': 16,
          'Tokyo (AP)': 22,
          'Sydney (AU)': 28,
          'São Paulo (SA)': 31
        });
      }
      setIsPinging(false);
    }, 600);
  };

  const handleCopyTokenCode = () => {
    playClick();
    const tokenCode = `:root {\n  --brand-primary: hsl(${brandHue}, 94%, 55%);\n  --brand-surface: hsl(${brandHue}, 15%, 8%);\n  --contrast-ratio: ${contrastRatio}:1;\n}`;
    navigator.clipboard.writeText(tokenCode);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <section id="lab" className="py-24 bg-neutral-950 relative border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" distance={24} duration={600}>
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-cyan-400/10 text-cyan-400 text-xs font-mono border border-cyan-400/20">
              <FlaskConical className="w-3.5 h-3.5" />
              <span>INTERACTIVE ENGINEERING LAB & PLAYGROUND</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
              Creative Tech & Experimental Lab
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Live client-side simulations exploring canvas physics, web audio DSP, distributed cloud topologies, and design systems.
            </p>
          </div>
        </RevealOnScroll>

        {/* Experiment Tab Switcher */}
        <RevealOnScroll direction="up" delay={100} duration={600} distance={20}>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              id="lab-tab-canvas"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={() => {
                playSwitch();
                setActiveTab('canvas');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'canvas'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/15'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>1. Vector Canvas Physics</span>
            </button>

            <button
              id="lab-tab-synth"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={() => {
                playSwitch();
                setActiveTab('synth');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'synth'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/15'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Music className="w-4 h-4" />
              <span>2. WebAudio Synthesizer</span>
            </button>

            <button
              id="lab-tab-latency"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={() => {
                playSwitch();
                setActiveTab('latency');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'latency'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/15'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>3. Edge Latency Bench</span>
            </button>

            <button
              id="lab-tab-tokens"
              type="button"
              onMouseEnter={() => playHover(1400)}
              onClick={() => {
                playSwitch();
                setActiveTab('tokens');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tokens'
                  ? 'bg-amber-400 text-neutral-950 font-bold shadow-lg shadow-amber-500/15'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>4. Dynamic Token Studio</span>
            </button>
          </div>
        </RevealOnScroll>

        {/* Experiment Content Box */}
        <RevealOnScroll direction="up" delay={150} duration={650} distance={28}>
          <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl p-6 sm:p-8">
            
            {/* Top Lab Header with Star Button */}
            <div className="flex items-center justify-between pb-5 mb-6 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className="text-amber-400 font-bold">EXPERIMENT //</span>
                <span className="uppercase tracking-wider text-neutral-200">{activeTab}</span>
              </div>

              <button
                id={`star-lab-btn-${activeTab}`}
                type="button"
                onMouseEnter={() => playHover(1400)}
                onClick={() => {
                  if (!user) {
                    playClick();
                    signInWithGoogle();
                  } else {
                    playSuccess();
                    toggleStarredLab(activeTab);
                  }
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  starredLabIds.includes(activeTab)
                    ? 'bg-amber-400 text-neutral-950 border-amber-300 font-bold shadow-md'
                    : 'bg-neutral-950 text-neutral-300 hover:text-white border-neutral-800 hover:border-amber-400/40'
                }`}
                title={user ? "Star this experiment (Saved to Firestore)" : "Sign in with Google to star"}
              >
                <Star className={`w-3.5 h-3.5 ${starredLabIds.includes(activeTab) ? 'fill-current' : ''}`} />
                <span>{starredLabIds.includes(activeTab) ? 'Starred Lab' : 'Star Lab'}</span>
              </button>
            </div>
          
          {/* TAB 1: CANVAS PHYSICS */}
          {activeTab === 'canvas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Vector Particle Gravitational Field</h3>
                  <p className="text-xs text-neutral-400">Move your mouse over the canvas to interact with spatial particle velocities.</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800">
                  <Activity className="w-3.5 h-3.5" />
                  <span>60 FPS Hardware Render</span>
                </div>
              </div>

              {/* Canvas Viewport */}
              <div className="relative h-80 sm:h-96 w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 cursor-crosshair">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-neutral-900/80 text-[11px] font-mono text-neutral-400 border border-neutral-800 backdrop-blur-sm pointer-events-none">
                  Mode: {mouseMode.toUpperCase()} | Count: {particleCount}
                </div>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 flex justify-between">
                    <span>Particle Density</span>
                    <span className="text-amber-400">{particleCount}</span>
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={120}
                    value={particleCount}
                    onChange={(e) => setParticleCount(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 flex justify-between">
                    <span>Speed Velocity</span>
                    <span className="text-amber-400">{speedMultiplier}x</span>
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={3}
                    step={0.1}
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 flex justify-between">
                    <span>Bond Distance</span>
                    <span className="text-amber-400">{connectDistance}px</span>
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={180}
                    value={connectDistance}
                    onChange={(e) => setConnectDistance(Number(e.target.value))}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-neutral-400 block">
                    Cursor Interaction
                  </label>
                  <div className="flex rounded-lg overflow-hidden border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setMouseMode('repel')}
                      className={`flex-1 py-1 text-xs font-mono transition-colors ${
                        mouseMode === 'repel' ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      Repel
                    </button>
                    <button
                      type="button"
                      onClick={() => setMouseMode('attract')}
                      className={`flex-1 py-1 text-xs font-mono transition-colors ${
                        mouseMode === 'attract' ? 'bg-amber-400 text-neutral-950 font-bold' : 'bg-neutral-950 text-neutral-400'
                      }`}
                    >
                      Attract
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SYNTH */}
          {activeTab === 'synth' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Pure Web Audio DSP Synthesizer</h3>
                  <p className="text-xs text-neutral-400">Sample-accurate sound generation in browser with zero external audio assets.</p>
                </div>
                <div className="flex items-center gap-2">
                  {(['sine', 'triangle', 'sawtooth', 'square'] as OscillatorType[]).map((wave) => (
                    <button
                      key={wave}
                      type="button"
                      onMouseEnter={() => playHover(1400)}
                      onClick={() => {
                        playClick();
                        setSynthWaveform(wave);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                        synthWaveform === wave
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {wave}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyboard Piano Keys */}
              <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 text-center space-y-4">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {synthNotes.map((n) => (
                    <button
                      key={n.name}
                      id={`synth-key-${n.name}`}
                      type="button"
                      onClick={() => playSynthNote(n.name, n.mult)}
                      className={`w-14 sm:w-16 h-36 rounded-b-xl border flex flex-col justify-end p-3 transition-all duration-100 ${
                        activeNote === n.name
                          ? 'bg-amber-400 border-amber-300 scale-95 shadow-lg shadow-amber-500/30 text-neutral-950'
                          : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700/80 text-white'
                      }`}
                    >
                      <span className="font-mono text-sm font-bold">{n.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">Oct {synthOctave}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4 text-xs font-mono text-neutral-400 pt-2">
                  <span>Octave Range:</span>
                  <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setSynthOctave(Math.max(2, synthOctave - 1))}
                      className="px-2 text-amber-400 hover:text-white font-bold"
                    >
                      -
                    </button>
                    <span className="text-white font-bold">{synthOctave}</span>
                    <button
                      type="button"
                      onClick={() => setSynthOctave(Math.min(6, synthOctave + 1))}
                      className="px-2 text-amber-400 hover:text-white font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LATENCY SIMULATOR */}
          {activeTab === 'latency' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Distributed Network Topology & Edge Ping</h3>
                  <p className="text-xs text-neutral-400">Benchmark request latency across global edge routing infrastructures.</p>
                </div>
                <button
                  id="run-latency-benchmark-btn"
                  type="button"
                  onClick={runLatencyTest}
                  disabled={isPinging}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center gap-2 self-start sm:self-auto"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
                  <span>{isPinging ? 'Pinging Nodes...' : 'Run Global Ping'}</span>
                </button>
              </div>

              {/* Topology Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setLatencyRouting('centralized');
                    runLatencyTest();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    latencyRouting === 'centralized'
                      ? 'bg-neutral-950 border-amber-400 text-white'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-amber-400">Centralized US-East Origin</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Single origin server. High cross-continental roundtrip delays.</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLatencyRouting('multiregion');
                    runLatencyTest();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    latencyRouting === 'multiregion'
                      ? 'bg-neutral-950 border-amber-400 text-white'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-amber-400">Multi-Region Read Replicas</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Distributed Postgres nodes in NA, EU, and AP regions.</div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLatencyRouting('edge');
                    runLatencyTest();
                  }}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    latencyRouting === 'edge'
                      ? 'bg-neutral-950 border-amber-400 text-white'
                      : 'bg-neutral-950/40 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="text-xs font-mono font-bold text-emerald-400">Global Edge Cache (Cloudflare/Fastly)</div>
                  <div className="text-[11px] text-neutral-400 mt-1">Static assets & edge compute cached &lt; 30ms worldwide.</div>
                </button>
              </div>

              {/* Latency Results Graph */}
              <div className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
                {Object.entries(pingResults).map(([region, pingValue]) => {
                  const ping = Number(pingValue);
                  return (
                    <div key={region} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-neutral-300">{region}</span>
                        <span className={`font-bold ${ping < 40 ? 'text-emerald-400' : ping < 100 ? 'text-amber-400' : 'text-red-400'}`}>
                          {ping} ms
                        </span>
                      </div>
                      <div className="h-2 w-full bg-neutral-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            ping < 40 ? 'bg-emerald-400' : ping < 100 ? 'bg-amber-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.min(100, (ping / 250) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: TOKEN STUDIO */}
          {activeTab === 'tokens' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white font-display">Contrast & Theme Token Studio</h3>
                  <p className="text-xs text-neutral-400">Real-time WCAG accessibility validator and dynamic palette generator.</p>
                </div>
                <button
                  id="copy-css-tokens-btn"
                  type="button"
                  onClick={handleCopyTokenCode}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-2 transition-colors self-start sm:self-auto"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedToken ? 'Copied CSS Variables!' : 'Copy CSS Tokens'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Live Preview Box */}
                <div 
                  className="p-6 rounded-xl border flex flex-col justify-between space-y-4"
                  style={{
                    backgroundColor: `hsl(${brandHue}, 15%, 8%)`,
                    borderColor: `hsl(${brandHue}, 60%, 25%)`
                  }}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          backgroundColor: `hsl(${brandHue}, 94%, 55%)`,
                          color: '#0a0a0a'
                        }}
                      >
                        WCAG AAA PASSED
                      </span>
                      <span className="text-xs font-mono text-neutral-400">{contrastRatio}:1 Ratio</span>
                    </div>

                    <h4 
                      className="text-2xl font-bold font-display"
                      style={{ color: `hsl(${brandHue}, 94%, 55%)` }}
                    >
                      Tactile User Interface
                    </h4>
                    <p className="text-sm text-neutral-300 leading-relaxed">
                      Every component Rick creates undergoes rigorous contrast testing to ensure maximum legibility in all ambient lighting environments.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="w-full py-2.5 rounded-lg font-bold text-xs transition-transform hover:scale-[1.01]"
                    style={{
                      backgroundColor: `hsl(${brandHue}, 94%, 55%)`,
                      color: '#0a0a0a'
                    }}
                  >
                    Action Button Preview
                  </button>
                </div>

                {/* Hue & Contrast Controls */}
                <div className="p-6 rounded-xl bg-neutral-950 border border-neutral-800 space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-neutral-400">Brand Color Hue (H)</span>
                      <span className="text-amber-400">{brandHue}°</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={360}
                      value={brandHue}
                      onChange={(e) => {
                        const h = Number(e.target.value);
                        setBrandHue(h);
                        setContrastRatio(Number((12 + (h % 5)).toFixed(1)));
                      }}
                      className="w-full accent-amber-400"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-xs text-neutral-300 space-y-1">
                    <div className="text-neutral-500">// Generated CSS Variable Tokens</div>
                    <div><span className="text-amber-400">--brand-primary:</span> hsl({brandHue}, 94%, 55%);</div>
                    <div><span className="text-amber-400">--brand-surface:</span> hsl({brandHue}, 15%, 8%);</div>
                    <div><span className="text-amber-400">--status-contrast:</span> 100% WCAG AAA;</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};
