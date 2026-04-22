import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const nav = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => nav("/onboarding"), 2500);
    return () => clearTimeout(t);
  }, [nav]);

  return (
    <div className="fixed inset-0 bg-primary overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80"
        alt="Wadi Rum desert at dusk — Masaar"
        className="absolute inset-0 w-full h-full object-cover scale-105 animate-fade-in-slow"
      />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-8 animate-fade-in">
        <div className="font-display text-white text-6xl tracking-[0.25em] font-medium">MASAAR</div>
        <div className="mt-3 text-tertiary text-3xl font-arabic font-semibold">مسار</div>
        <div className="mt-12 w-12 h-px bg-tertiary/60" />
        <p className="mt-6 text-white/70 text-xs tracking-[0.3em] uppercase">Jordan Smart Tourism</p>
      </div>
    </div>
  );
}
