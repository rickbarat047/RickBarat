import React, { useRef, useEffect, useState } from 'react';

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
  spotlightRadius?: number;
}

const DEFAULT_SPOTLIGHT_R = 260;

export const RevealLayer: React.FC<RevealLayerProps> = ({
  image,
  cursorX,
  cursorY,
  spotlightRadius = DEFAULT_SPOTLIGHT_R,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealDivRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update canvas mask and apply to reveal layer
  useEffect(() => {
    const canvas = canvasRef.current;
    const revealDiv = revealDivRef.current;
    if (!canvas || !revealDiv) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear entire canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Only draw gradient if cursor has valid coordinate on screen
    if (cursorX > -500 && cursorY > -500) {
      const gradient = ctx.createRadialGradient(
        cursorX,
        cursorY,
        0,
        cursorX,
        cursorY,
        spotlightRadius
      );

      // Soft circular gradient stops matching exact specifications:
      // 0 → rgba(255,255,255,1), 0.4 → 1, 0.6 → 0.75, 0.75 → 0.4, 0.88 → 0.12, 1 → 0
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.75)');
      gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.4)');
      gradient.addColorStop(0.88, 'rgba(255, 255, 255, 0.12)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.arc(cursorX, cursorY, spotlightRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    try {
      const maskDataUrl = canvas.toDataURL();
      const maskValue = `url(${maskDataUrl})`;

      revealDiv.style.maskImage = maskValue;
      revealDiv.style.webkitMaskImage = maskValue;
      revealDiv.style.maskSize = '100% 100%';
      revealDiv.style.webkitMaskSize = '100% 100%';
      revealDiv.style.maskRepeat = 'no-repeat';
      revealDiv.style.webkitMaskRepeat = 'no-repeat';
    } catch {
      // Fallback
    }
  }, [cursorX, cursorY, dimensions, spotlightRadius]);

  return (
    <>
      {/* Hidden canvas used for generating the alpha mask */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
        width={dimensions.width}
        height={dimensions.height}
      />

      {/* Masked reveal layer */}
      <div
        ref={revealDivRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none transition-[opacity] duration-300"
        style={{
          backgroundImage: `url("${image}")`,
        }}
      />
    </>
  );
};
