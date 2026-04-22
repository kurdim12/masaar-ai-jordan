import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";

const types = [
  { id: "hotel3", ar: "فندق 3 نجوم", en: "3-star hotel", avg: 60 },
  { id: "hotel5", ar: "فندق 4-5 نجوم", en: "4-5 star hotel", avg: 140 },
  { id: "eco", ar: "مخيم/إيكو لودج", en: "Camp / Eco-lodge", avg: 90 },
  { id: "rest", ar: "مطعم", en: "Restaurant", avg: 0 },
  { id: "med", ar: "مركز علاجي", en: "Wellness center", avg: 0 },
];

export default function InvestmentSimulator() {
  const { t } = useApp();
  const [type, setType] = useState(types[0].id);
  const [units, setUnits] = useState(20);
  const [investment, setInvestment] = useState(500000);
  const [loc, setLoc] = useState("wadi_rum");
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<null | { revLow: number; revHigh: number; bep: number; roi: number }>(null);

  const calc = () => {
    const t0 = types.find(x => x.id === type)!;
    const g = governorates.find(x => x.id === loc)!;
    const nightly = t0.avg || g.avgNight;
    const occ = g.occupancy / 100;
    const annualLow = Math.round(units * nightly * 365 * occ * 0.55);
    const annualHigh = Math.round(units * nightly * 365 * occ * 0.85);
    const annualMid = (annualLow + annualHigh) / 2;
    const profit = annualMid * 0.4;
    const bep = +(investment / profit).toFixed(1);
    const roi = Math.round(((profit * years) / investment) * 100);
    setResult({ revLow: annualLow, revHigh: annualHigh, bep, roi });
  };

  return (
    <AppShell>
      <AppHeader title={t("محاكي الاستثمار", "Investment Simulator")} showBack />
      <div className="px-4 pt-4 space-y-4">
        <div className="card-masaar p-4 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">{t("نوع المشروع", "Project Type")}</label>
            <div className="flex flex-wrap gap-2">
              {types.map(o => (
                <button key={o.id} onClick={() => setType(o.id)}
                  className={`chip text-xs ${type === o.id ? "chip-active" : ""}`}>{t(o.ar, o.en)}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("عدد الوحدات", "Units")}</label>
            <input type="number" value={units} onChange={e => setUnits(+e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("الاستثمار المبدئي (د.أ)", "Initial Investment (JD)")}</label>
            <input type="number" value={investment} onChange={e => setInvestment(+e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("الموقع", "Location")}</label>
            <select value={loc} onChange={e => setLoc(e.target.value)}
              className="w-full bg-muted rounded-lg px-3 py-2 outline-none">
              {governorates.map(g => <option key={g.id} value={g.id}>{t(g.nameAr, g.nameEn)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("فترة التشغيل", "Operating Period")}</label>
            <div className="flex gap-2">
              {[5, 10, 15].map(y => (
                <button key={y} onClick={() => setYears(y)}
                  className={`chip flex-1 justify-center ${years === y ? "chip-active" : ""}`}>{y} {t("سنوات", "yrs")}</button>
              ))}
            </div>
          </div>
          <button onClick={calc} className="btn-primary w-full">{t("احسب", "Calculate")}</button>
        </div>

        {result && (
          <div className="bg-primary text-primary-foreground rounded-2xl p-5 space-y-4 animate-fade-in">
            <div className="flex items-center gap-2 text-tertiary text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-[18px]">analytics</span>
              {t("نتائج المحاكاة", "Simulation Results")}
            </div>
            <div>
              <div className="text-xs text-white/60 mb-1">{t("الإيراد السنوي المتوقع", "Expected Annual Revenue")}</div>
              <div className="font-display text-2xl">{result.revLow.toLocaleString()} – {result.revHigh.toLocaleString()} <span className="text-sm text-white/60">JD</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-xs text-white/60">{t("نقطة التعادل", "Break-even")}</div>
                <div className="font-display text-2xl">{result.bep} <span className="text-sm">{t("سنة", "yrs")}</span></div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-xs text-white/60">{t(`عائد ${years} سنة`, `${years}-yr ROI`)}</div>
                <div className="font-display text-2xl">{result.roi}%</div>
              </div>
            </div>
            <div className="bg-tertiary text-primary rounded-xl p-3 text-center">
              <div className="text-xs">{t("تصنيف الفرصة", "Opportunity Rating")}</div>
              <div className="font-display text-lg">{"⭐".repeat(Math.min(5, Math.max(3, Math.round(result.roi / 80))))} {t("ممتازة", "Excellent")}</div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
