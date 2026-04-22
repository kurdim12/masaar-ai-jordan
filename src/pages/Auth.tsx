import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useApp, UserType } from "@/context/AppContext";
import { LocaleToggle } from "@/components/LocaleToggle";
import { toast } from "sonner";

type Mode = "login" | "signup";

const roleHome = (r: UserType) =>
  r === "traveller" ? "/traveller/discover" :
  r === "investor" ? "/investor/map" :
  r === "business" ? "/business/dashboard" : "/path";

const roleMeta: Record<Exclude<UserType, null>, { ar: string; en: string; icon: string }> = {
  traveller: { ar: "سائح", en: "Traveller", icon: "explore" },
  investor:  { ar: "مستثمر", en: "Investor", icon: "insights" },
  business:  { ar: "صاحب أعمال", en: "Business Owner", icon: "hotel" },
};

export default function Auth() {
  const { t, setUserType } = useApp();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const initialMode = (params.get("mode") as Mode) || "login";
  const initialRole = (params.get("role") as Exclude<UserType, null>) || "traveller";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<Exclude<UserType, null>>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // If already logged in, route to their role home
  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active || !data.session) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).maybeSingle();
      const r = (roles?.role as UserType) || null;
      if (r) {
        setUserType(r);
        localStorage.setItem("masaar_role", r);
        nav(roleHome(r), { replace: true });
      }
    });
    return () => { active = false; };
  }, [nav, setUserType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        const userId = data.user?.id;
        if (userId) {
          const { error: roleErr } = await supabase.from("user_roles").insert({ user_id: userId, role });
          if (roleErr && !roleErr.message.includes("duplicate")) throw roleErr;
        }
        setUserType(role);
        localStorage.setItem("masaar_role", role);
        toast.success(t("تم إنشاء حسابك 👋", "Account created 👋"));
        nav(roleHome(role), { replace: true });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id).maybeSingle();
        const r = (roles?.role as UserType) || role;
        if (!roles) {
          // Self-heal: create role row if missing
          await supabase.from("user_roles").insert({ user_id: data.user.id, role });
        }
        setUserType(r);
        localStorage.setItem("masaar_role", r as string);
        toast.success(t("مرحباً بعودتك", "Welcome back"));
        nav(roleHome(r), { replace: true });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-6 pb-10">
        <header className="flex items-center justify-between mb-6">
          <Link to="/path" className="leading-none">
            <div className="font-display text-base font-semibold tracking-[0.18em]">JORDAN</div>
            <div className="text-[10px] text-muted-foreground tracking-[0.3em]">INTELLIGENCE</div>
          </Link>
          <LocaleToggle />
        </header>

        <div className="mb-6">
          <p className="text-[11px] tracking-[0.3em] text-secondary uppercase font-semibold">
            {mode === "signup" ? t("إنشاء حساب", "Sign Up") : t("تسجيل الدخول", "Sign In")}
          </p>
          <h1 className="font-display text-3xl leading-tight mt-2">
            {mode === "signup"
              ? t("ابدأ رحلتك مع مسار", "Start your journey with Masaar")
              : t("مرحباً بعودتك", "Welcome back")}
          </h1>
        </div>

        {/* Role selector — only on signup */}
        {mode === "signup" && (
          <div className="mb-5">
            <p className="text-xs text-muted-foreground mb-2">{t("اختر دورك", "Pick your role")}</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(roleMeta) as Array<Exclude<UserType, null>>).map((r) => {
                const active = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="rounded-xl p-3 text-center transition-all"
                    style={{
                      background: active ? "hsl(var(--primary))" : "#fff9ef",
                      color: active ? "white" : "#0f1c2c",
                      border: `1px solid ${active ? "hsl(var(--primary))" : "rgba(200,168,130,0.4)"}`,
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{roleMeta[r].icon}</span>
                    <div className="text-[11px] font-semibold mt-1">{t(roleMeta[r].ar, roleMeta[r].en)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("البريد الإلكتروني", "Email")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg px-3 py-2.5 text-sm"
              style={{ background: "white", border: "1px solid rgba(200,168,130,0.4)" }}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("كلمة المرور", "Password")}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-lg px-3 py-2.5 text-sm"
              style={{ background: "white", border: "1px solid rgba(200,168,130,0.4)" }}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full mt-2 disabled:opacity-60"
          >
            {busy
              ? t("جارٍ المعالجة...", "Working...")
              : mode === "signup" ? t("إنشاء حساب", "Create account") : t("تسجيل الدخول", "Sign in")}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-muted-foreground">
          {mode === "signup" ? (
            <>
              {t("لديك حساب؟", "Already have an account?")}{" "}
              <button onClick={() => setMode("login")} className="text-secondary font-semibold">
                {t("تسجيل الدخول", "Sign in")}
              </button>
            </>
          ) : (
            <>
              {t("ليس لديك حساب؟", "No account yet?")}{" "}
              <button onClick={() => setMode("signup")} className="text-secondary font-semibold">
                {t("أنشئ حساباً", "Create one")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
