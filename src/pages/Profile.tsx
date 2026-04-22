import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const roleLabel = (u: string | null) => {
  if (u === "traveller") return { ar: "سائح", en: "Traveller" };
  if (u === "investor") return { ar: "مستثمر", en: "Investor" };
  if (u === "business") return { ar: "صاحب أعمال", en: "Business Owner" };
  return { ar: "زائر", en: "Guest" };
};

export default function Profile() {
  const { t, userType, clearUserType, geminiKey, setGeminiKey } = useApp();
  const nav = useNavigate();
  const role = roleLabel(userType);

  const switchRole = () => {
    localStorage.removeItem("masaar_role");
    clearUserType();
    toast.success(t("اختر دوراً جديداً", "Pick a new role"));
    nav("/path");
  };

  return (
    <AppShell>
      <AppHeader title={t("ملفي", "Profile")} />
      <div className="px-6 pt-6 pb-10 space-y-8">
        {/* Identity */}
        <div className="card-clean flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center font-display text-2xl text-primary">
            M
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display text-[18px] text-primary">{t("مرحباً بك", "Welcome")}</div>
            <span className="inline-block mt-1 text-[11px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "hsl(var(--surface-cream))", color: "hsl(var(--secondary))" }}>
              {t(role.ar, role.en)}
            </span>
          </div>
        </div>

        {/* Switch role */}
        <section className="space-y-3">
          <h2 className="font-display text-[16px] text-primary font-semibold">{t("الدور", "Role")}</h2>
          <button onClick={switchRole} className="card-clean w-full flex items-center justify-between text-start">
            <div>
              <div className="text-[14px] font-medium text-primary">{t("تغيير الدور", "Switch Role")}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                {t("ابدأ من جديد كسائح أو مستثمر أو صاحب أعمال", "Start fresh as traveller, investor or business owner")}
              </div>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
          </button>
        </section>

        {/* About */}
        <section className="space-y-3">
          <h2 className="font-display text-[16px] text-primary font-semibold">{t("معلومات", "Information")}</h2>
          <button onClick={() => nav("/about")} className="card-clean w-full flex items-center justify-between text-start">
            <div>
              <div className="text-[14px] font-medium text-primary">{t("عن مسار وخارطة الطريق", "About & Roadmap")}</div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                {t("الإصدار، المراحل، والفريق", "Version, phases, and team")}
              </div>
            </div>
            <span className="material-symbols-outlined text-muted-foreground">chevron_right</span>
          </button>
        </section>

        {/* Gemini key */}
        <section className="space-y-3">
          <h2 className="font-display text-[16px] text-primary font-semibold">{t("مفتاح Gemini AI", "Gemini AI Key")}</h2>
          <div className="card-clean space-y-2">
            <p className="text-[13px] text-muted-foreground leading-snug">
              {t(
                "ألصق مفتاحك من Google AI Studio لتفعيل ردود الذكاء الاصطناعي الكاملة.",
                "Paste your key from Google AI Studio to enable full AI responses."
              )}
            </p>
            <input
              value={geminiKey}
              onChange={e => setGeminiKey(e.target.value)}
              type="password"
              placeholder="AIza…"
              className="w-full bg-muted rounded-lg px-3 py-2 text-[13px] outline-none"
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
