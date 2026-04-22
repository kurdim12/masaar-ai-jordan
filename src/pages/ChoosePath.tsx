import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LocaleToggle } from "@/components/LocaleToggle";
import { loadInvestorDemo, loadBusinessDemo } from "@/lib/demo";
import { toast } from "sonner";

const cards = [
  {
    type: "traveller" as const, route: "/traveller/onboarding",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&q=80",
    icon: "explore", labelAr: "تجربة", labelEn: "EXPERIENCE",
    titleAr: "سائح", titleEn: "Traveller",
    descAr: "اكتشف الأردن بتوصيات AI مخصصة لاهتماماتك وميزانيتك",
    descEn: "Discover Jordan with AI recommendations tailored to your interests and budget",
    ctaAr: "ابدأ رحلتك", ctaEn: "Start Journey",
  },
  {
    type: "investor" as const, route: "/investor/map",
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=900&q=80",
    icon: "insights", labelAr: "ذكاء", labelEn: "INTELLIGENCE",
    titleAr: "مستثمر", titleEn: "Investor",
    descAr: "اكتشف الفرص الاستثمارية وحلّل السوق السياحي الأردني",
    descEn: "Discover investment opportunities and analyze Jordan's tourism market",
    ctaAr: "استكشف الفرص", ctaEn: "Explore Opportunities",
  },
  {
    type: "business" as const, route: "/business/onboarding",
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    icon: "hotel", labelAr: "أعمال", labelEn: "BUSINESS",
    titleAr: "صاحب مشروع", titleEn: "Business Owner",
    descAr: "نمّ مشروعك السياحي بعروض لحظية وتحليلات ذكية",
    descEn: "Grow your tourism business with flash offers and smart analytics",
    ctaAr: "أدر مشروعك", ctaEn: "Manage Business",
  },
];

export default function ChoosePath() {
  const { t, setUserType, setLocale, setInvestorProfile, setBusinessProfile } = useApp();
  const nav = useNavigate();

  const onInvestorDemo = () => {
    loadInvestorDemo();
    setLocale("ar");
    setInvestorProfile({ focus: "Camp / Eco-lodge, Wellness center", capital: "200K - 500K JD", region: "wadi_rum" });
    setUserType("investor");
    toast.success("مرحباً خالد 👋 جاهز للاستكشاف");
    nav("/investor/map");
  };

  const onBusinessDemo = () => {
    loadBusinessDemo();
    setLocale("en");
    setBusinessProfile({ name: "Rose City Guesthouse", type: "Guesthouse", location: "petra", rooms: 12, minPrice: 45, maxPrice: 85 });
    setUserType("business");
    toast.success("Welcome back, Nour 👋");
    nav("/business/dashboard");
  };
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-6 pb-10">
        <header className="flex items-center justify-between mb-6">
          <div className="leading-none">
            <div className="font-display text-base font-semibold tracking-[0.18em]">JORDAN</div>
            <div className="text-[10px] text-muted-foreground tracking-[0.3em]">INTELLIGENCE</div>
          </div>
          <LocaleToggle />
        </header>

        <div className="mb-7 animate-fade-in">
          <p className="text-[11px] tracking-[0.3em] text-secondary uppercase font-semibold">
            {t("اختر دورك", "Select Your Role")}
          </p>
          <h1 className="font-display text-3xl leading-tight mt-2">
            {t("خدمة مصممة لك", "Intelligence Tailored to You")}
          </h1>
        </div>

        <div className="space-y-4">
          {cards.map((c, idx) => {
            const demo =
              c.type === "investor"
                ? { onClick: onInvestorDemo, name: "خالد المحاميد", role: "مستثمر أردني" }
                : c.type === "business"
                ? { onClick: onBusinessDemo, name: "Nour Alkhatib", role: "Petra Guesthouse" }
                : null;
            return (
              <div key={c.type} className="space-y-2 animate-fade-in" style={{ animationDelay: `${idx * 80}ms` }}>
                <button
                  onClick={() => { localStorage.setItem("masaar_role", c.type); setUserType(c.type); nav(c.route); }}
                  className="group relative w-full overflow-hidden rounded-2xl text-start min-h-[220px] shadow-card"
                >
                  <img src={c.img} alt={t(c.titleAr, c.titleEn)} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/70 to-primary/95" />
                  <div className="relative p-5 h-full text-white flex flex-col justify-between min-h-[220px]">
                    <div className="flex items-start justify-between">
                      <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 32 }}>{c.icon}</span>
                      <span className="text-[10px] tracking-[0.3em] text-tertiary font-semibold">{t(c.labelAr, c.labelEn)}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl mb-1.5">{t(c.titleAr, c.titleEn)}</h3>
                      <p className="text-white/80 text-sm leading-snug mb-4">{t(c.descAr, c.descEn)}</p>
                      <span className="inline-flex items-center gap-1.5 text-tertiary text-sm font-semibold">
                        {t(c.ctaAr, c.ctaEn)}
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </span>
                    </div>
                  </div>
                </button>
                {demo && (
                  <button
                    onClick={demo.onClick}
                    className="w-full flex items-center justify-between transition-colors hover:bg-white"
                    style={{
                      background: "#fff9ef",
                      border: "1px solid rgba(200, 168, 130, 0.4)",
                      borderRadius: 10,
                      padding: "10px 16px",
                      fontFamily: "Manrope, system-ui, sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C8A882")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(200, 168, 130, 0.4)")}
                  >
                    <div className="text-start">
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1c2c" }}>
                        {t("جرّب نسخة تجريبية", "Try Demo")} · {demo.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#44474c" }}>{demo.role}</div>
                    </div>
                    <span style={{ color: "#0f1c2c", fontSize: 16 }}>→</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
