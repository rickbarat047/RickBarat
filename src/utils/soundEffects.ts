/**
 * Web Audio API procedural sound engine
 * Zero external audio files required, completely synthesized and safe.
 * Specially optimized for mobile touch devices (iOS Safari / Android Chrome) and desktop browsers.
 */

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let isUnlocked = false;
let lastHoverTimestamp = 0;
let lastClickTimestamp = 0;
let lastTransitionTimestamp = 0;
let lastTouchTimestamp = 0;
const unlockListeners: Array<() => void> = [];

// Initialize sound state from localStorage
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('rick_portfolio_sound');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  } catch {
    soundEnabled = true;
  }
}

/**
 * Detect if interaction is coming from touch device or recent touch event
 * to prevent synthetic mouseenter triggers from firing hover sounds right before clicks on mobile.
 */
export function isTouchDeviceOrRecentTouch(): boolean {
  if (typeof window === 'undefined') return false;
  const now = performance.now();
  // If a touch occurred in the last 1500ms, suppress hover sound
  if (now - lastTouchTimestamp < 1500) return true;
  // If device does not support hover (mobile phones / touchscreens)
  if (window.matchMedia && window.matchMedia('(hover: none)').matches) {
    return true;
  }
  return false;
}

/**
 * Retrieve or instantiate the centralized AudioContext.
 */
export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
}

/**
 * Mobile-compatible AudioContext Unlocker.
 * iOS Safari and Chrome Android require an explicit user gesture to activate audio hardware.
 */
export function unlockAudioContext(): boolean {
  if (typeof window === 'undefined') return false;
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  // Play an ultra-short silent buffer to wake up iOS WebKit audio hardware pipeline
  try {
    const buffer = ctx.createBuffer(1, 1, 22050);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    source.start(0);
  } catch {
    // safe fallback
  }

  isUnlocked = true;
  while (unlockListeners.length > 0) {
    const cb = unlockListeners.shift();
    try {
      cb?.();
    } catch {
      // ignore
    }
  }

  window.dispatchEvent(new CustomEvent('portfolio_audio_unlocked'));
  return true;
}

export function isAudioUnlocked(): boolean {
  if (!audioCtx) return false;
  return audioCtx.state === 'running' || isUnlocked;
}

export function onAudioUnlocked(callback: () => void) {
  if (isAudioUnlocked()) {
    callback();
    return () => {};
  }
  unlockListeners.push(callback);
  return () => {
    const idx = unlockListeners.indexOf(callback);
    if (idx !== -1) unlockListeners.splice(idx, 1);
  };
}

// Attach early gesture listeners to unlock AudioContext on first mobile touch/click
if (typeof window !== 'undefined') {
  const handleTouchStart = () => {
    lastTouchTimestamp = performance.now();
  };

  const handleFirstGesture = () => {
    lastTouchTimestamp = performance.now();
    unlockAudioContext();
    window.removeEventListener('touchstart', handleFirstGesture, true);
    window.removeEventListener('touchend', handleFirstGesture, true);
    window.removeEventListener('pointerdown', handleFirstGesture, true);
    window.removeEventListener('click', handleFirstGesture, true);
    window.removeEventListener('keydown', handleFirstGesture, true);
  };

  window.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      lastTouchTimestamp = performance.now();
    }
  }, { capture: true, passive: true });

  window.addEventListener('touchstart', handleFirstGesture, { capture: true, passive: true });
  window.addEventListener('touchend', handleFirstGesture, { capture: true, passive: true });
  window.addEventListener('pointerdown', handleFirstGesture, { capture: true, passive: true });
  window.addEventListener('click', handleFirstGesture, { capture: true, passive: true });
  window.addEventListener('keydown', handleFirstGesture, { capture: true, passive: true });
}

export function setSoundState(enabled: boolean) {
  soundEnabled = enabled;
  try {
    localStorage.setItem('rick_portfolio_sound', enabled ? 'true' : 'false');
    window.dispatchEvent(new CustomEvent('portfolio_sound_changed', { detail: { enabled } }));
  } catch {
    // ignore
  }
}

export function getSoundState(): boolean {
  return soundEnabled;
}

export function toggleSoundState(): boolean {
  const next = !soundEnabled;
  setSoundState(next);
  return next;
}

/**
 * Subtle tactile micro-tick for UI hover interactions.
 * Automatically suppressed on touch interactions & mobile to prevent "double click" sounds.
 */
export function playHoverSound(pitch = 1400) {
  if (!soundEnabled) return;
  if (isTouchDeviceOrRecentTouch()) return; // Prevent mobile double-sound glitch

  const now = performance.now();
  if (now - lastHoverTimestamp < 50) return; // Throttle 50ms
  lastHoverTimestamp = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.25, ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.012, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.015);
  } catch {
    // audio safety
  }
}

/**
 * Crisp tactile feedback for button clicks & toggle switches.
 * Throttled (75ms) to prevent double clicks from mobile synthetic events or event bubbling.
 */
export function playClickSound(pitch = 800) {
  if (!soundEnabled) return;

  const now = performance.now();
  if (now - lastClickTimestamp < 75) return; // Debounce 75ms
  lastClickTimestamp = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // audio safety
  }
}

/**
 * Soft smooth frequency sweep for section changes, modals, and route transitions.
 */
export function playTransitionSound(direction: 'in' | 'out' = 'in') {
  if (!soundEnabled) return;

  const now = performance.now();
  if (now - lastTransitionTimestamp < 90) return;
  lastTransitionTimestamp = now;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const startFreq = direction === 'in' ? 240 : 380;
    const endFreq = direction === 'in' ? 440 : 220;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch {
    // audio safety
  }
}

/**
 * Soft pop sound for badges, chips, or modal triggers.
 */
export function playPopSound(freq = 600) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.8, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // audio safety
  }
}

/**
 * Clean dual-frequency switch toggle.
 */
export function playSwitchSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch {
    // audio safety
  }
}

/**
 * Retro terminal beep.
 */
export function playTerminalBeep(freq = 1200) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch {
    // audio safety
  }
}

/**
 * Cybernetic boot chord sequence.
 * Tuned with audible harmonics designed for clear projection on mobile phone micro-speakers.
 */
export function playBootSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const playSynthesizedBoot = () => {
    try {
      // Harmonic chord: A3 (220Hz), E4 (329.63Hz), A4 (440Hz), C#5 (554.37Hz), E5 (659.25Hz), A5 (880Hz)
      const chord = [220, 329.63, 440, 554.37, 659.25, 880];
      const now = ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Mix sawtooth and triangle for punchy phone speaker presence
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq * 0.82, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.22);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.05 / (1 + idx * 0.3), now + 0.18);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.1);
      });
    } catch {
      // audio safety
    }
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      playSynthesizedBoot();
    }).catch(() => {
      playSynthesizedBoot();
    });
  } else {
    playSynthesizedBoot();
  }
}

/**
 * Harmonic success chime.
 */
export function playSuccessChime() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const playSynthesizedChime = () => {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.04, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.22);
      });
    } catch {
      // audio safety
    }
  };

  if (ctx.state === 'suspended') {
    ctx.resume().then(() => {
      playSynthesizedChime();
    }).catch(() => {
      playSynthesizedChime();
    });
  } else {
    playSynthesizedChime();
  }
}
