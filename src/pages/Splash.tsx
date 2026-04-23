import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export default function Splash() {
  const nav = useNavigate();
  const { t } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => nav("/onboarding"), 3200);
    return () => clearTimeout(timer);
  }, [nav]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "hsl(var(--void))" }}>
      <img
        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600&q=80"
        alt="Wadi Rum desert at dusk — Masaar"
        className="absolute inset-0 w-full h-full object-cover scale-110 animate-fade-in-slow"
        style={{ opacity: 0.55 }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,22,40,0.4) 0%, rgba(10,22,40,0.7) 60%, rgba(10,22,40,0.96) 100%)",
        }}
      />
      <div className="relative h-full flex flex-col items-center justify-center text-center px-8 animate-fade-in">
        <div
          className="font-display text-white text-6xl tracking-[0.25em] font-medium"
          style={{ textShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          MASAAR
        </div>
        <div
          className="mt-4 text-[10px] tracking-[0.4em] font-semibold"
          style={{ color: "hsl(var(--gold))" }}
        >
          {t("مسار — الذكاء السياحي", "JORDAN TOURISM INTELLIGENCE")}
        </div>
        <div className="mt-12 w-12 h-px" style={{ background: "hsl(var(--gold) / 0.6)" }} />
        <div className="mt-8">
          <div className="loading-dots">
            <span /><span /><span />
          </div>
        </div>
      </div>
    </div>
  );
}
