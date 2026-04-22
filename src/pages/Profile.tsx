import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { t, userType, setUserType, geminiKey, setGeminiKey } = useApp();
  const nav = useNavigate();
  const switchTo = (u: "traveller" | "investor" | "business") => {
    setUserType(u);
    nav(u === "traveller" ? "/traveller/discover" : u === "investor" ? "/investor/map" : "/business/dashboard");
  };
  return (
    <AppShell>
      <AppHeader title={t("ملفي", "Profile")} />
      <div className="px-4 pt-5 space-y-5">
        <div className="card-masaar p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center font-display text-2xl text-primary">M</div>
          <div>
            <div className="font-display text-lg">{t("مرحباً بك", "Welcome")}</div>
            <div className="text-xs text-muted-foreground capitalize">{userType}</div>
          </div>
        </div>

        <section>
          <h3 className="font-display text-lg mb-2">{t("بدّل دورك", "Switch Role")}</h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "traveller" as const, ar: "سائح", en: "Traveller", i: "explore" },
              { k: "investor" as const, ar: "مستثمر", en: "Investor", i: "insights" },
              { k: "business" as const, ar: "أعمال", en: "Business", i: "hotel" },
            ].map(r => (
              <button key={r.k} onClick={() => switchTo(r.k)}
                className={`card-masaar p-3 text-center ${userType === r.k ? "ring-2 ring-primary" : ""}`}>
                <span className="material-symbols-outlined text-secondary">{r.i}</span>
                <div className="text-xs mt-1 font-medium">{t(r.ar, r.en)}</div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-2">{t("مفتاح Gemini AI", "Gemini AI Key")}</h3>
          <div className="card-masaar p-4 space-y-2">
            <p className="text-xs text-muted-foreground leading-snug">
              {t("ألصق مفتاحك من Google AI Studio لتفعيل ردود الذكاء الاصطناعي الكاملة. الردود تعمل بدون مفتاح أيضاً (وضع تجريبي).",
                 "Paste your key from Google AI Studio to enable full AI responses. Replies still work without a key (demo mode).")}
            </p>
            <input value={geminiKey} onChange={e => setGeminiKey(e.target.value)} type="password"
              placeholder="AIza…" className="w-full bg-muted rounded-lg px-3 py-2 text-sm outline-none" />
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-2">{t("عن مسار", "About Masaar")}</h3>
          <div className="card-masaar p-4 text-sm text-muted-foreground leading-relaxed">
            {t("مسار منصة ذكاء سياحي للأردن تجمع السياح والمستثمرين وأصحاب المشاريع في مكان واحد، مدعومة بالذكاء الاصطناعي.",
               "Masaar is a Jordan tourism intelligence platform connecting travellers, investors, and business owners — powered by AI.")}
          </div>
        </section>

        <button onClick={() => { setUserType(null); nav("/path"); }} className="btn-ghost-sand w-full">
          {t("تسجيل الخروج", "Log out")}
        </button>
      </div>
    </AppShell>
  );
}
