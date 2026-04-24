import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LINE_COUNT = 220;

function WaveTexture() {
  return (
    <svg
      className="w-full h-full"
      viewBox="0 0 1000 640"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Left-to-right gradient: black → soft gray */}
        <linearGradient id="baseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#000000" />
          <stop offset="25%"  stopColor="#111111" />
          <stop offset="60%"  stopColor="#4a4a4a" />
          <stop offset="85%"  stopColor="#787878" />
          <stop offset="100%" stopColor="#969696" />
        </linearGradient>

        {/* Sphere shadow: large dark oval, lower-left of the texture area */}
        <radialGradient
          id="sphereShadow"
          cx="34%" cy="60%" r="56%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%"   stopColor="#000" stopOpacity="1" />
          <stop offset="42%"  stopColor="#000" stopOpacity="0.95" />
          <stop offset="65%"  stopColor="#000" stopOpacity="0.55" />
          <stop offset="82%"  stopColor="#000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base gradient fill */}
      <rect x="0" y="0" width="1000" height="640" fill="url(#baseGrad)" />

      {/* Fine horizontal scan lines */}
      {Array.from({ length: LINE_COUNT }, (_, i) => {
        const y = (i / LINE_COUNT) * 640;
        const opacity = 0.16 + (i % 5 === 0 ? 0.08 : 0) + (i % 11 === 0 ? 0.05 : 0);
        return (
          <line
            key={i}
            x1="0" y1={y}
            x2="1000" y2={y}
            stroke="#ffffff"
            strokeWidth="0.5"
            opacity={opacity}
          />
        );
      })}

      {/* Sphere shadow overlay (creates the 3-D dune/globe illusion) */}
      <rect x="0" y="0" width="1000" height="640" fill="url(#sphereShadow)" />
    </svg>
  );
}

export default function Splash() {
  const nav = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => nav("/onboarding"), 4000);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black select-none">

      {/* Wave texture — occupies right ~68% of screen */}
      <div className="absolute inset-y-0 right-0" style={{ left: "32%" }}>
        <WaveTexture />
      </div>

      {/* Black fade — keeps left portion pure black */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "55%",
          background: "linear-gradient(to right, #000 55%, transparent 100%)",
        }}
      />

      {/* Corner: EST · 2026 */}
      <div
        className="absolute font-mono"
        style={{
          top: 24,
          left: 28,
          color: "rgba(255,255,255,0.38)",
          fontSize: 10,
          letterSpacing: "0.3em",
        }}
      >
        EST · 2026
      </div>

      {/* Corner: AMMAN · JOR */}
      <div
        className="absolute font-mono"
        style={{
          top: 24,
          right: 28,
          color: "rgba(255,255,255,0.38)",
          fontSize: 10,
          letterSpacing: "0.3em",
        }}
      >
        AMMAN · JOR
      </div>

      {/* MASAAR — centered on full viewport */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          style={{
            color: "#ffffff",
            fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
            fontSize: "clamp(48px, 6.5vw, 88px)",
            fontWeight: 500,
            letterSpacing: "0.28em",
            textShadow: "0 2px 40px rgba(0,0,0,0.7)",
          }}
        >
          MASAAR
        </div>
      </div>
    </div>
  );
}
