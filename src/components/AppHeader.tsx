import { useApp } from "@/context/AppContext";
import { LocaleToggle } from "./LocaleToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AppHeader = ({
  title,
  showBack = false,
  showBell = true,
  lightMode = false,
}: {
  title?: string;
  showBack?: boolean;
  showBell?: boolean;
  lightMode?: boolean;
}) => {
  const { t, notifications } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const headerClass = lightMode ? "glass-header-cream" : "glass-header";
  const wordmarkColor = lightMode ? "hsl(28 40% 12%)" : "hsl(var(--t1))";
  const subColor = lightMode ? "hsl(33 41% 30%)" : "hsl(var(--sand) / 0.6)";
  const iconBg = lightMode ? "hsl(33 41% 65% / 0.15)" : "hsl(var(--sand) / 0.10)";

  return (
    <header className={`sticky top-0 z-30 ${headerClass}`}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => nav(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: iconBg, border: "0.5px solid hsl(var(--sand) / 0.14)" }}
              aria-label="back"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: wordmarkColor }}>
                arrow_back
              </span>
            </button>
          )}
          {title ? (
            <h1
              className="font-display text-lg font-semibold tracking-tight"
              style={{ color: wordmarkColor }}
            >
              {title}
            </h1>
          ) : (
            <div className="leading-none">
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.20em",
                  color: wordmarkColor,
                }}
              >
                MASAAR
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  color: subColor,
                  marginTop: 2,
                }}
              >
                {t("مسار", "JORDAN INTELLIGENCE")}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LocaleToggle />
          {showBell && (
            <button
              onClick={() => setOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ background: iconBg, border: "0.5px solid hsl(var(--sand) / 0.14)" }}
              aria-label="notifications"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: wordmarkColor }}>
                notifications
              </span>
              {notifications.length > 0 && (
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: "hsl(var(--rose))" }}
                />
              )}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-foreground/40" onClick={() => setOpen(false)}>
          <div
            className="absolute top-14 inset-x-2 max-w-md mx-auto card-elevated max-h-[70vh] overflow-y-auto animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg">{t("الإشعارات", "Notifications")}</h3>
              <button
                onClick={() => setOpen(false)}
                className="material-symbols-outlined text-muted-foreground"
              >
                close
              </button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">
                {t("لا توجد إشعارات بعد", "No notifications yet")}
              </p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id} className="card-base !p-3 text-sm">
                    {t(n.titleAr, n.titleEn)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
