import { NavLink, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";

export const BottomNav = () => {
  const { t, userType, cart } = useApp();
  const loc = useLocation();
  if (!userType) return null;

  const cartCount = cart.length;

  const items =
    userType === "business"
      ? [
          { to: "/business/dashboard",  icon: "dashboard",      ar: "لوحتي",    en: "Dashboard" },
          { to: "/business/bookings",   icon: "hotel",          ar: "الحجوزات",  en: "Bookings"  },
          { to: "/business/chat",       icon: "auto_awesome",   ar: "الذكاء",   en: "AI"        },
          { to: "/business/profile",    icon: "person",         ar: "ملفي",     en: "Profile"   },
        ]
      : userType === "investor"
      ? [
          { to: "/investor/map",        icon: "explore",        ar: "الفرص",    en: "Explore"   },
          { to: "/investor/forecast",   icon: "show_chart",     ar: "التوقعات", en: "Forecast"  },
          { to: "/investor/tenders",    icon: "gavel",          ar: "العطاءات", en: "Tenders"   },
          { to: "/investor/profile",    icon: "person",         ar: "ملفي",     en: "Profile"   },
        ]
      : [
          { to: "/traveller/discover",  icon: "explore",        ar: "اكتشف",    en: "Discover"  },
          { to: "/traveller/chat",      icon: "auto_awesome",   ar: "الذكاء",   en: "AI Chat"   },
          { to: "/traveller/cart",      icon: "luggage",        ar: "رحلتي",    en: "Trip",     badge: cartCount },
          { to: "/traveller/profile",   icon: "person",         ar: "ملفي",     en: "Profile"   },
        ];

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 pb-[env(safe-area-inset-bottom)] nav-glass"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 h-16">
        {items.map((it) => {
          const active = loc.pathname === it.to || loc.pathname.startsWith(it.to + "/");
          return (
            <NavLink
              key={it.to}
              to={it.to}
              className="relative flex flex-col items-center justify-center gap-0.5"
            >
              {active && (
                <span
                  className="absolute top-0 h-[2px] w-8 rounded-full"
                  style={{ background: "hsl(211 100% 52%)" }}
                />
              )}
              <span className="relative">
                <span
                  className="material-symbols-outlined transition-all"
                  style={{
                    fontSize: 22,
                    color: active ? "hsl(211 100% 62%)" : "hsl(0 0% 42%)",
                    fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {it.icon}
                </span>
                {"badge" in it && (it.badge ?? 0) > 0 && (
                  <span
                    className="absolute -top-1 -end-2 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: "hsl(211 100% 52%)", color: "#fff" }}
                  >
                    {it.badge}
                  </span>
                )}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: active ? "hsl(211 100% 62%)" : "hsl(0 0% 42%)" }}
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
