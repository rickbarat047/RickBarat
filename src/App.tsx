import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/motion/SplashScreen';
import { CinematicIntro } from './components/motion/CinematicIntro';
import { SpatialSphere } from './components/motion/SpatialSphere';
import { FlipDetailModal } from './components/motion/FlipDetailModal';
import { ExploreGridView } from './components/motion/ExploreGridView';
import { FullscreenMenu } from './components/motion/FullscreenMenu';
import { CustomCursor } from './components/motion/CustomCursor';
import { SPATIAL_OBJECTS, SpatialItem } from './data/spatialData';

export default function App() {
  const [phase, setPhase] = useState<'splash' | 'intro' | 'ready'>('splash');
  const [isExploreMode, setIsExploreMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SpatialItem | null>(null);
  const [sourceRect, setSourceRect] = useState<DOMRect | null>(null);

  // Lock body scroll during splash and intro
  useEffect(() => {
    if (phase !== 'ready') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  // Object selection for FLIP modal
  const handleSelectObject = (item: SpatialItem, rect: DOMRect) => {
    setSourceRect(rect);
    setSelectedItem(item);
  };

  // Fullscreen Menu Navigation Target Handler
  const handleMenuNavigate = (target: 'about' | 'world' | 'right-now' | 'projects' | 'explore') => {
    if (target === 'world') {
      setIsExploreMode(false);
      setSelectedItem(null);
    } else if (target === 'explore') {
      setIsExploreMode(true);
      setSelectedItem(null);
    } else if (target === 'about') {
      const aboutItem = SPATIAL_OBJECTS.find(o => o.id === 'who-am-i');
      if (aboutItem) {
        setSourceRect(null);
        setSelectedItem(aboutItem);
      }
    } else if (target === 'right-now') {
      const rightNowItem = SPATIAL_OBJECTS.find(o => o.id === 'right-now');
      if (rightNowItem) {
        setSourceRect(null);
        setSelectedItem(rightNowItem);
      }
    } else if (target === 'projects') {
      const projectItem = SPATIAL_OBJECTS.find(o => o.id === 'munjoy');
      if (projectItem) {
        setSourceRect(null);
        setSelectedItem(projectItem);
      }
    }
  };

  return (
    <div className="relative min-h-[170vh] bg-black text-neutral-100 selection:bg-amber-400 selection:text-neutral-950 font-sans antialiased overflow-x-hidden">
      {/* Custom Circular Cursor for fine pointer devices */}
      <CustomCursor />

      {/* Atmospheric Subtle Film Grain */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] z-0"
        aria-hidden="true"
      />

      {/* Step 1: Cinematic Splash Screen */}
      {phase === 'splash' && (
        <SplashScreen onComplete={() => setPhase('intro')} />
      )}

      {/* Step 2: Cinematic Intro Sequence */}
      {phase === 'intro' && (
        <CinematicIntro onComplete={() => setPhase('ready')} />
      )}

      {/* Persistent Minimal Header & Fullscreen Menu */}
      <FullscreenMenu
        onNavigate={handleMenuNavigate}
        isExploreMode={isExploreMode}
        onToggleExplore={() => setIsExploreMode(prev => !prev)}
      />

      {/* Sticky Stage Viewport Container: Drives Camera Dolly via Natural Scroll */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden">
        {isExploreMode ? (
          <div className="flex-1 overflow-y-auto">
            <ExploreGridView
              onSelectObject={handleSelectObject}
              onCloseGrid={() => setIsExploreMode(false)}
            />
          </div>
        ) : (
          <SpatialSphere
            onSelectObject={handleSelectObject}
            isExploreMode={isExploreMode}
          />
        )}
      </div>

      {/* FLIP Detail Transition Dialog */}
      <FlipDetailModal
        item={selectedItem}
        sourceRect={sourceRect}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
