import { useApp } from "@/context/AppContext";
import { LocaleToggle } from "./LocaleToggle";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const AppHeader = ({
  title,
  showBack = false,
  showBell = true,
}: {
  title?: string;
  showBack?: boolean;
  showBell?: boolean;
}) => {
  const { t, notifications } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30 glass"
      style={{ borderBottom: "1px solid rgba(200,168,130,0.15)" }}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => nav(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(200,168,130,0.1)" }}
              aria-label="back"
            >
              <span className="material-symbols-outlined text-foreground" style={{ fontSize: 20 }}>
                arrow_back
              </span>
            </button>
          )}
          {title ? (
            <h1 className="font-display text-lg font-semibold tracking-tight">{title}</h1>
          ) : (
            <div className="leading-none">
              <div className="font-display text-base font-semibold tracking-[0.18em] text-foreground">
                MASAAR
              </div>
              <div className="text-[10px] text-muted-foreground tracking-[0.25em] mt-0.5">
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
              style={{ background: "rgba(200,168,130,0.08)" }}
              aria-label="notifications"
            >
              <span className="material-symbols-outlined text-foreground" style={{ fontSize: 20 }}>
                notifications
              </span>
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
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
