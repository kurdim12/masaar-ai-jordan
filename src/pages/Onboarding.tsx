import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { LocaleToggle } from "@/components/LocaleToggle";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3?w=1200&q=80",
    titleAr: "استكشف الأردن بذكاء", titleEn: "Explore Jordan Intelligently",
    subAr: "توصيات مخصصة بالذكاء الاصطناعي لرحلتك المثالية",
    subEn: "AI-powered recommendations for your perfect journey",
  },
  {
    img: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80",
    titleAr: "فرص استثمارية حقيقية", titleEn: "Real Investment Opportunities",
    subAr: "بيانات السياحة الأردنية لقرارات استثمارية ذكية",
    subEn: "Jordan tourism data for smart investment decisions",
  },
  {
    img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
    titleAr: "نمّ مشروعك السياحي", titleEn: "Grow Your Tourism Business",
    subAr: "عروض لحظية وتحليلات تساعدك تملأ غرفك دائماً",
    subEn: "Flash offers and analytics to keep your rooms full",
  },
];

export default function Onboarding() {
  const { t } = useApp();
  const nav = useNavigate();
  const [i, setI] = useState(0);
  const s = slides[i];
  const last = i === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-primary">
      <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" key={s.img} />
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="relative h-full flex flex-col">
        <div className="flex justify-end p-4"><LocaleToggle light /></div>
        <div className="flex-1" />
        <div className="px-6 pb-10 text-white animate-fade-in" key={i}>
          <h1 className="font-display text-4xl leading-tight mb-3">{t(s.titleAr, s.titleEn)}</h1>
          <p className="text-white/80 text-base leading-relaxed mb-8">{t(s.subAr, s.subEn)}</p>

          <div className="flex items-center gap-1.5 mb-6">
            {slides.map((_, idx) => (
              <span key={idx} className={`h-1 rounded-full transition-all ${idx === i ? "w-8 bg-tertiary" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>

          <div className="flex items-center justify-between gap-3">
            {!last ? (
              <>
                <button onClick={() => nav("/path")} className="text-white/70 text-sm py-3">
                  {t("تخطٍ", "Skip")}
                </button>
                <button onClick={() => setI(i + 1)} className="bg-white text-primary rounded-full px-6 py-3 font-semibold flex items-center gap-2">
                  {t("التالي", "Next")} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </>
            ) : (
              <button onClick={() => nav("/path")} className="w-full bg-tertiary text-primary rounded-full py-3.5 font-semibold shadow-gold">
                {t("ابدأ", "Get Started")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
