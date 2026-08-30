import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  playHoverSound,
  playClickSound,
  playTransitionSound,
  playPopSound,
  playSwitchSound,
  playTerminalBeep,
  playBootSound,
  playSuccessChime,
  getSoundState,
  setSoundState,
  toggleSoundState,
} from '../utils/soundEffects';

export interface UseUISoundsReturn {
  soundEnabled: boolean;
  setSound: (enabled: boolean) => void;
  toggleSound: () => boolean;
  playHover: (pitch?: number) => void;
  playClick: (pitch?: number) => void;
  playTransition: (direction?: 'in' | 'out') => void;
  playPop: (freq?: number) => void;
  playSwitch: () => void;
  playSuccess: () => void;
  playBeep: (freq?: number) => void;
  playBoot: () => void;
  
  // Convenient event prop helpers for clean JSX binding
  hoverProps: { onMouseEnter: () => void };
  clickProps: { onClick: () => void };
  interactiveProps: { onMouseEnter: () => void; onClick: () => void };
  
  // Higher-order function wrappers
  withClick: <T extends (...args: any[]) => any>(fn?: T, pitch?: number) => (...args: Parameters<T>) => ReturnType<T> | void;
  withHover: <T extends (...args: any[]) => any>(fn?: T, pitch?: number) => (...args: Parameters<T>) => ReturnType<T> | void;
  withTransition: <T extends (...args: any[]) => any>(fn?: T, direction?: 'in' | 'out') => (...args: Parameters<T>) => ReturnType<T> | void;
}

/**
 * Custom React hook for seamless, responsive UI sound feedback.
 * Automatically synchronizes sound toggle state across all components and tabs.
 */
export function useUISounds(): UseUISoundsReturn {
  const [soundEnabled, setLocalSoundEnabled] = useState<boolean>(() => getSoundState());

  useEffect(() => {
    const handleSoundChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ enabled: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.enabled === 'boolean') {
        setLocalSoundEnabled(customEvent.detail.enabled);
      } else {
        setLocalSoundEnabled(getSoundState());
      }
    };

    window.addEventListener('portfolio_sound_changed', handleSoundChange);
    window.addEventListener('storage', (e) => {
      if (e.key === 'rick_portfolio_sound') {
        setLocalSoundEnabled(e.newValue === 'true');
      }
    });

    return () => {
      window.removeEventListener('portfolio_sound_changed', handleSoundChange);
    };
  }, []);

  const setSound = useCallback((enabled: boolean) => {
    setSoundState(enabled);
    setLocalSoundEnabled(enabled);
  }, []);

  const toggleSound = useCallback(() => {
    const next = toggleSoundState();
    setLocalSoundEnabled(next);
    return next;
  }, []);

  const playHover = useCallback((pitch?: number) => {
    playHoverSound(pitch);
  }, []);

  const playClick = useCallback((pitch?: number) => {
    playClickSound(pitch);
  }, []);

  const playTransition = useCallback((direction?: 'in' | 'out') => {
    playTransitionSound(direction);
  }, []);

  const playPop = useCallback((freq?: number) => {
    playPopSound(freq);
  }, []);

  const playSwitch = useCallback(() => {
    playSwitchSound();
  }, []);

  const playSuccess = useCallback(() => {
    playSuccessChime();
  }, []);

  const playBeep = useCallback((freq?: number) => {
    playTerminalBeep(freq);
  }, []);

  const playBoot = useCallback(() => {
    playBootSound();
  }, []);

  const hoverProps = useMemo(() => ({
    onMouseEnter: () => playHoverSound()
  }), []);

  const clickProps = useMemo(() => ({
    onClick: () => playClickSound()
  }), []);

  const interactiveProps = useMemo(() => ({
    onMouseEnter: () => playHoverSound(),
    onClick: () => playClickSound()
  }), []);

  const withClick = useCallback(<T extends (...args: any[]) => any>(fn?: T, pitch?: number) => {
    return (...args: Parameters<T>) => {
      playClickSound(pitch);
      if (fn) return fn(...args);
    };
  }, []);

  const withHover = useCallback(<T extends (...args: any[]) => any>(fn?: T, pitch?: number) => {
    return (...args: Parameters<T>) => {
      playHoverSound(pitch);
      if (fn) return fn(...args);
    };
  }, []);

  const withTransition = useCallback(<T extends (...args: any[]) => any>(fn?: T, direction?: 'in' | 'out') => {
    return (...args: Parameters<T>) => {
      playTransitionSound(direction);
      if (fn) return fn(...args);
    };
  }, []);

  return {
    soundEnabled,
    setSound,
    toggleSound,
    playHover,
    playClick,
    playTransition,
    playPop,
    playSwitch,
    playSuccess,
    playBeep,
    playBoot,
    hoverProps,
    clickProps,
    interactiveProps,
    withClick,
    withHover,
    withTransition
  };
}
