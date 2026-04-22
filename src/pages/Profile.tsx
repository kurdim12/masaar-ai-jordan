import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { clearAllDemoKeys, isDemoMode } from "@/lib/demo";
import { supabase } from "@/integrations/supabase/client";

const roleLabel = (u: string | null) => {
  if (u === "traveller") return { ar: "سائح", en: "Traveller" };
  if (u === "investor") return { ar: "مستثمر", en: "Investor" };
  if (u === "business") return { ar: "صاحب أعمال", en: "Business Owner" };
  return { ar: "زائر", en: "Guest" };
};

export default function Profile() {
  const { t, userType, clearUserType } = useApp();
  const nav = useNavigate();
  const role = roleLabel(userType);
  const demo = isDemoMode();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setEmail(data.session?.user.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const isAuthed = !!email;

  const switchRole = () => {
    ["masaar.userType", "masaar.ip", "masaar.bp", "masaar.tp", "masaar.locale", "masaar.offers"].forEach((k) =>
      localStorage.removeItem(k)
    );
    clearAllDemoKeys();
    clearUserType();
    toast.success(t("اختر دوراً جديداً", "Pick a new role"));
    nav("/path");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    ["masaar.userType", "masaar.ip", "masaar.bp", "masaar.tp", "masaar.locale", "masaar.offers", "masaar_role"].forEach((k) =>
      localStorage.removeItem(k)
    );
    clearAllDemoKeys();
    clearUserType();
    toast.success(t("تم تسجيل الخروج", "Signed out"));
    nav("/path", { replace: true });
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
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="text-[11px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "hsl(var(--surface-cream))", color: "hsl(var(--secondary))" }}>
                {t(role.ar, role.en)}
              </span>
              {demo && (
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ background: "#eec058", color: "#0f1c2c", fontSize: 11, fontWeight: 700, fontFamily: "Manrope, system-ui, sans-serif" }}
                >
                  {t("تجريبي", "Demo")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* AI status */}
        <div className="card-clean">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
            <div className="flex-1">
              <div className="text-[14px] font-medium text-primary">
                {t("الذكاء الاصطناعي مُفعّل", "AI is active")}
              </div>
              <div className="text-[12px] text-muted-foreground mt-0.5">
                {t("مدعوم بـ Lovable AI — لا حاجة لمفتاح", "Powered by Lovable AI — no key needed")}
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-success" />
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
      </div>
    </AppShell>
  );
}
