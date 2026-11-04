import React, { useState, useEffect } from "react";

interface LoadingIntroProps {
  onComplete: () => void;
  duration?: number;
}

export const LoadingIntro: React.FC<LoadingIntroProps> = ({
  onComplete,
  duration = 1800,
}) => {
  const [phase, setPhase] = useState<"draw" | "reveal" | "exit">("draw");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), duration * 0.6);
    const t2 = setTimeout(() => setPhase("exit"), duration * 0.85);
    const t3 = setTimeout(() => onComplete(), duration);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [duration, onComplete]);

  const isDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const bg = isDark ? "#0b0f1c" : "#eef0f4";
  const ink = isDark ? "#eaedf6" : "#1b2234";
  const blue = "#3b6ef0";
  const muted = isDark ? "#8790a8" : "#8a91a3";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: bg,
        transition: "opacity 0.5s ease",
        opacity: phase === "exit" ? 0 : 1,
        pointerEvents: phase === "exit" ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes ftp-draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes ftp-fade-in {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: none; }
        }
        @keyframes ftp-pulse-dot {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .ftp-loader-draw {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: ftp-draw 1.2s ease-out forwards;
        }
        .ftp-loader-draw-2 {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: ftp-draw 1.2s ease-out 0.2s forwards;
        }
        .ftp-loader-text {
          opacity: 0;
          animation: ftp-fade-in 0.6s ease-out 0.8s forwards;
        }
        .ftp-loader-dot {
          animation: ftp-pulse-dot 1.2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-8">
        {/* Hand-drawn doodle: a folder tab unfolding */}
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          stroke={ink}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Folder body */}
          <path
            className="ftp-loader-draw"
            d="M20 30 H50 L58 22 H100 V90 H20 Z"
            fill="none"
          />
          {/* Folder tab */}
          <path
            className="ftp-loader-draw-2"
            d="M20 30 H50 L58 22 H70"
            fill="none"
            stroke={blue}
          />
          {/* Doodle arrow */}
          <path
            className="ftp-loader-draw-2"
            d="M50 60 H80 M72 52 L80 60 L72 68"
            fill="none"
            stroke={muted}
          />
          {/* Small doodle circle */}
          <circle
            className="ftp-loader-draw"
            cx="95"
            cy="80"
            r="8"
            fill="none"
            stroke={blue}
            opacity="0.6"
          />
        </svg>

        {/* Loading text */}
        <div className="ftp-loader-text flex flex-col items-center gap-3">
          <span
            style={{
              fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: ink,
              letterSpacing: "-0.02em",
            }}
          >
            Portfolio
          </span>
          <div className="flex items-center gap-1.5">
            <span className="ftp-loader-dot w-1.5 h-1.5 rounded-full" style={{ background: blue, animationDelay: "0s" }} />
            <span className="ftp-loader-dot w-1.5 h-1.5 rounded-full" style={{ background: blue, animationDelay: "0.2s" }} />
            <span className="ftp-loader-dot w-1.5 h-1.5 rounded-full" style={{ background: blue, animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIntro;
