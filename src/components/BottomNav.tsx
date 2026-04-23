import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const BottomNav = () => {
  const { t, userType } = useApp();
  const loc = useLocation();
  if (!userType) return null;

  const items =
    userType === "business"
      ? [
          { to: "/business/dashboard", icon: "dashboard", ar: "لوحتي", en: "Dashboard" },
          { to: "/business/analytics", icon: "analytics", ar: "تحليلات", en: "Analytics" },
          { to: "/business/chat", icon: "auto_awesome", ar: "الذكاء", en: "AI" },
          { to: "/business/profile", icon: "person", ar: "ملفي", en: "Profile" },
        ]
      : userType === "investor"
      ? [
          { to: "/investor/map", icon: "explore", ar: "الفرص", en: "Opportunities" },
          { to: "/investor/forecast", icon: "show_chart", ar: "التوقعات", en: "Forecast" },
          { to: "/investor/tenders", icon: "gavel", ar: "العطاءات", en: "Tenders" },
          { to: "/investor/profile", icon: "person", ar: "ملفي", en: "Profile" },
        ]
      : [
          { to: "/traveller/discover", icon: "explore", ar: "اكتشف", en: "Discover" },
          { to: "/traveller/chat", icon: "auto_awesome", ar: "الذكاء", en: "AI Chat" },
          { to: "/traveller/plan", icon: "event_note", ar: "خطة", en: "Planner" },
          { to: "/traveller/profile", icon: "person", ar: "ملفي", en: "Profile" },
        ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)] glass"
      style={{ borderTop: "1px solid rgba(200,168,130,0.15)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {items.map((it) => {
          const active = loc.pathname.startsWith(it.to);
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {active && (
                <span
                  className="absolute top-0 h-[2px] w-8 rounded-full"
                  style={{ background: "var(--gradient-gold)" }}
                />
              )}
              <span
                className="material-symbols-outlined transition-all"
                style={{
                  fontSize: 22,
                  color: active ? "hsl(var(--gold))" : "hsl(var(--muted-foreground) / 0.6)",
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {it.icon}
              </span>
              <span
                className="text-[10px] font-medium tracking-wide"
                style={{
                  color: active ? "hsl(var(--gold))" : "hsl(var(--muted-foreground) / 0.6)",
                }}
              >
                {t(it.ar, it.en)}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
