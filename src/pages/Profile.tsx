import { useEffect, useRef, useState } from "react";
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
  const { t, userType, clearUserType, geminiKey, setGeminiKey } = useApp();
  const nav = useNavigate();
  const role = roleLabel(userType);
  const demo = isDemoMode();
  const [email, setEmail] = useState<string | null>(null);
  const [keyInput, setKeyInput] = useState(geminiKey);
  const [showKey, setShowKey] = useState(false);
  const keyRef = useRef<HTMLInputElement>(null);

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
            <div className="font-display text-[18px] text-primary truncate">
              {email || t("مرحباً بك", "Welcome")}
            </div>
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

        {/* Account section */}
        <section className="space-y-3">
          <h2 className="font-display text-[16px] text-primary font-semibold">{t("الحساب", "Account")}</h2>
          {isAuthed ? (
            <button
              onClick={logout}
              className="card-clean w-full flex items-center justify-between text-start"
            >
              <div>
                <div className="text-[14px] font-medium text-primary">{t("تسجيل الخروج", "Sign out")}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">
                  {t("سيتم إنهاء جلستك", "End your session on this device")}
                </div>
              </div>
              <span className="material-symbols-outlined text-muted-foreground">logout</span>
            </button>
          ) : (
            <button
              onClick={() => nav("/auth?mode=login")}
              className="card-clean w-full flex items-center justify-between text-start"
            >
              <div>
                <div className="text-[14px] font-medium text-primary">{t("تسجيل الدخول", "Sign in")}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">
                  {t("احفظ بياناتك عبر الأجهزة", "Save your data across devices")}
                </div>
              </div>
              <span className="material-symbols-outlined text-muted-foreground">login</span>
            </button>
          )}
        </section>

        {/* Gemini AI key */}
        <section className="space-y-3">
          <h2 className="font-display text-[16px] text-primary font-semibold">{t("الذكاء الاصطناعي", "AI Settings")}</h2>
          <div className="card-clean space-y-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-tertiary">auto_awesome</span>
              <div className="flex-1">
                <div className="text-[14px] font-medium text-primary">
                  {geminiKey ? t("Gemini مُفعّل ✓", "Gemini Active ✓") : t("وضع تجريبي", "Demo Mode")}
                </div>
                <div className="text-[12px] text-muted-foreground mt-0.5">
                  {geminiKey
                    ? t("ردود ذكاء اصطناعي كاملة مفعّلة", "Full AI responses enabled")
                    : t("أضف مفتاح Gemini لردود أذكى", "Add Gemini key for smarter replies")}
                </div>
              </div>
              <span className={`w-2 h-2 rounded-full ${geminiKey ? "bg-success" : "bg-muted-foreground"}`} />
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  ref={keyRef}
                  type={showKey ? "text" : "password"}
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  placeholder="AIza..."
                  className="w-full text-[13px] bg-background border border-border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-primary pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  className="absolute inset-y-0 end-2 flex items-center text-muted-foreground"
                >
                  <span className="material-symbols-outlined text-[18px]">{showKey ? "visibility_off" : "visibility"}</span>
                </button>
              </div>
              <button
                onClick={() => {
                  setGeminiKey(keyInput.trim());
                  toast.success(keyInput.trim() ? t("تم حفظ المفتاح", "Key saved") : t("تم مسح المفتاح", "Key cleared"));
                }}
                className="px-3 py-2 rounded-lg text-[13px] font-semibold"
                style={{ background: "hsl(var(--secondary))", color: "white" }}
              >
                {t("حفظ", "Save")}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {t(
                "احصل على مفتاحك المجاني من Google AI Studio. لا يُخزَّن إلا على جهازك.",
                "Get your free key from Google AI Studio. Stored only on your device."
              )}
            </p>
          </div>
        </section>

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
