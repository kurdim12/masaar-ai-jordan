import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { interestChips } from "@/data/jordan";
import { LocaleToggle } from "@/components/LocaleToggle";

const countries = [
  { id: "JO", ar: "الأردن", en: "Jordan" },
  { id: "SA", ar: "السعودية", en: "Saudi Arabia" },
  { id: "AE", ar: "الإمارات", en: "UAE" },
  { id: "US", ar: "الولايات المتحدة", en: "USA" },
  { id: "UK", ar: "بريطانيا", en: "UK" },
  { id: "DE", ar: "ألمانيا", en: "Germany" },
  { id: "FR", ar: "فرنسا", en: "France" },
  { id: "OT", ar: "أخرى", en: "Other" },
];
const groups = [
  { id: "1", ar: "1", en: "1" },
  { id: "2", ar: "2", en: "2" },
  { id: "3-5", ar: "3-5", en: "3-5" },
  { id: "6+", ar: "+6", en: "6+" },
];
const budgets = [
  { id: "<50", ar: "أقل من 50 د.أ", en: "Under 50 JD" },
  { id: "50-100", ar: "50-100 د.أ", en: "50-100 JD" },
  { id: "100-200", ar: "100-200 د.أ", en: "100-200 JD" },
  { id: "200+", ar: "+200 د.أ", en: "200+ JD" },
];

export default function TravellerOnboarding() {
  const { t, travellerProfile, setTravellerProfile } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const total = 5;

  const next = () => step < total - 1 ? setStep(s => s + 1) : nav("/traveller/discover");
  const prev = () => step > 0 ? setStep(s => s - 1) : nav("/path");

  const toggleInterest = (id: string) => {
    const has = travellerProfile.interests.includes(id);
    setTravellerProfile({
      ...travellerProfile,
      interests: has ? travellerProfile.interests.filter(x => x !== id) : [...travellerProfile.interests, id],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-5 pt-4 pb-6">
        <header className="flex items-center justify-between mb-4">
          <button onClick={prev} className="material-symbols-outlined text-foreground p-1">arrow_back</button>
          <LocaleToggle />
        </header>
        <div className="h-1 bg-muted rounded-full overflow-hidden mb-8">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>

        <div className="flex-1 animate-fade-in" key={step}>
          {step === 0 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("من أين أنت؟", "Where are you from?")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("نخصص توصياتنا حسب جنسيتك", "We tailor recommendations to your nationality")}</p>
              <div className="grid grid-cols-2 gap-2.5">
                {countries.map(c => (
                  <button key={c.id} onClick={() => setTravellerProfile({ ...travellerProfile, nationality: c.id })}
                    className={`card-masaar py-4 px-3 text-sm font-medium ${travellerProfile.nationality === c.id ? "ring-2 ring-primary" : ""}`}>
                    {t(c.ar, c.en)}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("ما يهمك؟", "What interests you?")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("اختر كل ما يناسبك", "Pick everything that suits you")}</p>
              <div className="flex flex-wrap gap-2">
                {interestChips.map(c => {
                  const on = travellerProfile.interests.includes(c.id);
                  return (
                    <button key={c.id} onClick={() => toggleInterest(c.id)} className={`chip ${on ? "chip-active" : ""}`}>
                      {t(c.ar, c.en)}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("كم عدد المسافرين؟", "How many travellers?")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("شامل الأطفال", "Including children")}</p>
              <div className="grid grid-cols-4 gap-2">
                {groups.map(g => (
                  <button key={g.id} onClick={() => setTravellerProfile({ ...travellerProfile, groupSize: g.id })}
                    className={`card-masaar py-5 text-lg font-display ${travellerProfile.groupSize === g.id ? "ring-2 ring-primary bg-primary text-primary-foreground" : ""}`}>
                    {t(g.ar, g.en)}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("ما ميزانيتك اليومية؟", "What's your daily budget?")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("للشخص الواحد، شامل الإقامة", "Per person, including stay")}</p>
              <div className="space-y-2.5">
                {budgets.map(b => (
                  <button key={b.id} onClick={() => setTravellerProfile({ ...travellerProfile, budget: b.id })}
                    className={`w-full card-masaar py-4 px-5 text-start font-medium flex items-center justify-between ${travellerProfile.budget === b.id ? "ring-2 ring-primary" : ""}`}>
                    <span>{t(b.ar, b.en)}</span>
                    {travellerProfile.budget === b.id && <span className="material-symbols-outlined text-primary">check_circle</span>}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("متى بتجي؟", "When are you visiting?")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("نقترح أفضل الأماكن لتاريخك", "We'll suggest the best spots for your dates")}</p>
              <label className="block text-sm font-medium mb-1.5">{t("من", "From")}</label>
              <input type="date" className="w-full card-masaar px-4 py-3 mb-4 outline-none"
                value={travellerProfile.dateFrom || ""}
                onChange={e => setTravellerProfile({ ...travellerProfile, dateFrom: e.target.value })}/>
              <label className="block text-sm font-medium mb-1.5">{t("إلى", "To")}</label>
              <input type="date" className="w-full card-masaar px-4 py-3 outline-none"
                value={travellerProfile.dateTo || ""}
                onChange={e => setTravellerProfile({ ...travellerProfile, dateTo: e.target.value })}/>
            </>
          )}
        </div>

        <button onClick={next} className="btn-primary w-full mt-6">
          {step < total - 1 ? t("التالي", "Continue") : t("ابدأ الاكتشاف", "Start Discovering")}
        </button>
      </div>
    </div>
  );
}
