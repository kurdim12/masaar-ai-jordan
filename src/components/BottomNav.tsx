import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const BottomNav = () => {
  const { t, userType } = useApp();
  const loc = useLocation();
  if (!userType) return null;

  const base = userType === "traveller" ? "/traveller" : userType === "investor" ? "/investor" : "/business";
  const items = userType === "business"
    ? [
        { to: `${base}/dashboard`, icon: "dashboard", ar: "لوحتي", en: "Dashboard" },
        { to: `${base}/analytics`, icon: "analytics", ar: "تحليلات", en: "Analytics" },
        { to: `${base}/chat`, icon: "auto_awesome", ar: "الذكاء", en: "AI" },
        { to: `${base}/profile`, icon: "person", ar: "ملفي", en: "Profile" },
      ]
    : userType === "investor"
    ? [
        { to: `${base}/map`, icon: "explore", ar: "الفرص", en: "Opportunities" },
        { to: `${base}/tenders`, icon: "gavel", ar: "العطاءات", en: "Tenders" },
        { to: `${base}/chat`, icon: "auto_awesome", ar: "الذكاء", en: "AI" },
        { to: `${base}/profile`, icon: "person", ar: "ملفي", en: "Profile" },
      ]
    : [
        { to: `${base}/discover`, icon: "explore", ar: "اكتشف", en: "Discover" },
        { to: `${base}/map`, icon: "map", ar: "الخريطة", en: "Map" },
        { to: `${base}/chat`, icon: "auto_awesome", ar: "الذكاء", en: "AI" },
        { to: `${base}/profile`, icon: "person", ar: "ملفي", en: "Profile" },
      ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 glass border-t border-border/40 pb-[env(safe-area-inset-bottom)]"
      style={{ background: "hsl(var(--nav-surface) / 0.85)" }}
    >
      <div className="max-w-md mx-auto grid grid-cols-4">
        {items.map(it => {
          const active = loc.pathname.startsWith(it.to);
          return (
            <NavLink key={it.to} to={it.to} className="flex flex-col items-center justify-center py-2.5 gap-0.5">
              <span
                className={`material-symbols-outlined transition-all ${active ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontSize: 24, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
              >{it.icon}</span>
              <span className={`text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>{t(it.ar, it.en)}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
