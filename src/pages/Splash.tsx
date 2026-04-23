import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function Splash() {
  const nav = useNavigate();
  const { t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => nav("/onboarding"), 3200);
    return () => clearTimeout(timer);
  }, [nav]);

  // 70 random star particles
  const particles = useMemo(
    () =>
      Array.from({ length: 70 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 0.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.75,
        delay: Math.random() * 2,
      })),
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "hsl(var(--void))" }}>
      {/* Particle field */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-fade-in-slow"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(7,16,28,0.6) 75%, rgba(7,16,28,0.95) 100%)",
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-8">
        <div
          className="font-display text-white animate-fade-up delay-1"
          style={{
            fontSize: 52,
            letterSpacing: "0.22em",
            textShadow: "0 4px 28px rgba(0,0,0,0.5)",
          }}
        >
          MASAAR
        </div>
        <div
          className="mt-5 animate-fade-up delay-2"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            color: "hsl(var(--gold))",
          }}
        >
          {t("مسار — الذكاء السياحي", "JORDAN TOURISM INTELLIGENCE")}
        </div>
        <div
          className="mt-12 w-12 h-px animate-fade-up delay-3"
          style={{ background: "hsl(var(--gold) / 0.6)" }}
        />
        <div className="mt-8 animate-fade-up delay-4">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  );
}
