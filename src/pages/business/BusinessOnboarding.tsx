import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { LocaleToggle } from "@/components/LocaleToggle";

const bizTypes = [
  { id: "hotel", ar: "🏨 فندق", en: "🏨 Hotel" },
  { id: "camp", ar: "🏕 مخيم", en: "🏕 Camp" },
  { id: "guest", ar: "🏡 استراحة", en: "🏡 Guesthouse" },
  { id: "rest", ar: "🍽 مطعم", en: "🍽 Restaurant" },
  { id: "well", ar: "🧘 مركز علاجي", en: "🧘 Wellness" },
  { id: "trans", ar: "🚌 نقل", en: "🚌 Transport" },
  { id: "guide", ar: "🗺 مرشد", en: "🗺 Tour Guide" },
];

export default function BusinessOnboarding() {
  const { t, businessProfile, setBusinessProfile } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const total = 5;
  const next = () => step < total - 1 ? setStep(s => s + 1) : nav("/business/dashboard");
  const prev = () => step > 0 ? setStep(s => s - 1) : nav("/path");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto min-h-screen flex flex-col px-5 pt-4 pb-6">
        <header className="flex items-center justify-between mb-4">
          <button onClick={prev} className="material-symbols-outlined p-1">arrow_back</button>
          <LocaleToggle />
        </header>
        <div className="h-1 bg-muted rounded-full overflow-hidden mb-8">
          <div className="h-full bg-primary transition-all" style={{ width: `${((step+1)/total)*100}%` }} />
        </div>
        <div className="flex-1 animate-fade-in" key={step}>
          {step === 0 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("نوع مشروعك", "Business Type")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("اختر النوع المناسب", "Select what fits")}</p>
              <div className="flex flex-wrap gap-2">
                {bizTypes.map(b => (
                  <button key={b.id} onClick={() => setBusinessProfile({ ...businessProfile, type: b.id })}
                    className={`chip ${businessProfile.type === b.id ? "chip-active" : ""}`}>{t(b.ar, b.en)}</button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("الموقع", "Location")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("اختر المحافظة", "Select governorate")}</p>
              <select value={businessProfile.location || ""} onChange={e => setBusinessProfile({ ...businessProfile, location: e.target.value })}
                className="w-full card-masaar px-4 py-3 outline-none">
                <option value="">{t("اختر…", "Choose…")}</option>
                {governorates.map(g => <option key={g.id} value={g.id}>{t(g.nameAr, g.nameEn)}</option>)}
              </select>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("الطاقة الاستيعابية", "Capacity")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("الغرف والأسرّة", "Rooms & beds")}</p>
              <label className="text-sm mb-1.5 block">{t("عدد الغرف", "Rooms / units")}</label>
              <input type="number" value={businessProfile.rooms || ""} onChange={e => setBusinessProfile({ ...businessProfile, rooms: +e.target.value })}
                className="w-full card-masaar px-4 py-3 mb-4 outline-none"/>
              <label className="text-sm mb-1.5 block">{t("السعة القصوى", "Max capacity")}</label>
              <input type="number" value={businessProfile.capacity || ""} onChange={e => setBusinessProfile({ ...businessProfile, capacity: +e.target.value })}
                className="w-full card-masaar px-4 py-3 outline-none"/>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("نطاق الأسعار", "Price Range")}</h2>
              <p className="text-muted-foreground text-sm mb-6">{t("بالدينار الأردني", "In Jordanian Dinar")}</p>
              <label className="text-sm mb-1.5 block">{t("أدنى سعر", "Min price")}</label>
              <input type="number" value={businessProfile.minPrice || ""} onChange={e => setBusinessProfile({ ...businessProfile, minPrice: +e.target.value })}
                className="w-full card-masaar px-4 py-3 mb-4 outline-none"/>
              <label className="text-sm mb-1.5 block">{t("أعلى سعر", "Max price")}</label>
              <input type="number" value={businessProfile.maxPrice || ""} onChange={e => setBusinessProfile({ ...businessProfile, maxPrice: +e.target.value })}
                className="w-full card-masaar px-4 py-3 outline-none"/>
            </>
          )}
          {step === 4 && (
            <>
              <h2 className="font-display text-3xl mb-1">{t("معلومات المشروع", "Business Info")}</h2>
              <input value={businessProfile.name || ""} onChange={e => setBusinessProfile({ ...businessProfile, name: e.target.value })}
                placeholder={t("اسم المشروع", "Business name")}
                className="w-full card-masaar px-4 py-3 mb-3 outline-none"/>
              <textarea value={businessProfile.description || ""} onChange={e => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                placeholder={t("وصف قصير", "Short description")} rows={4}
                className="w-full card-masaar px-4 py-3 outline-none resize-none"/>
            </>
          )}
        </div>
        <button onClick={next} className="btn-primary w-full mt-6">
          {step < total - 1 ? t("التالي", "Continue") : t("إنشاء حسابي", "Create Account")}
        </button>
      </div>
    </div>
  );
}
