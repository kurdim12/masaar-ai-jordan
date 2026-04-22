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
          { to: "/traveller/plan", icon: "event_note", ar: "خطة", en: "Trip Planner" },
          { to: "/traveller/profile", icon: "person", ar: "ملفي", en: "Profile" },
        ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)]"
      style={{
        background: "#ffffff",
        borderTop: "1px solid hsl(var(--border) / 0.15)",
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {items.map(it => {
          const active = loc.pathname.startsWith(it.to);
          return (
            <NavLink key={it.to} to={it.to} className="flex flex-col items-center justify-center gap-0.5">
              <span
                className="material-symbols-outlined transition-all"
                style={{
                  fontSize: 24,
                  color: active ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground) / 0.5)",
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {it.icon}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "hsl(var(--secondary))" : "hsl(var(--muted-foreground) / 0.5)" }}
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
