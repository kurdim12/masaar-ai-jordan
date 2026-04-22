import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { Line, LineChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";

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
  const [result, setResult] = useState<null | { revenue: number; revLow: number; revHigh: number; bep: number; roi: number; occupancy: number; projection: { year: string; revenue: number; cumulative: number }[]; aiRec: string }>(null);

  const calc = () => {
    const t0 = types.find(x => x.id === type)!;
    const g = governorates.find(x => x.id === loc)!;
    const nightly = t0.avg || g.avgNight;
    const occ = g.occupancy / 100;
    const annualMid = Math.round(units * nightly * 365 * occ * 0.7);
    const annualLow = Math.round(annualMid * 0.78);
    const annualHigh = Math.round(annualMid * 1.21);
    const profit = annualMid * 0.4;
    const bep = +(investment / profit).toFixed(1);
    const roi = Math.round(((profit * years) / investment) * 100);

    const projection = Array.from({ length: years }, (_, i) => {
      const yr = i + 1;
      const growth = Math.pow(1.06, i); // 6% YoY growth
      const rev = Math.round(annualMid * growth);
      const cumulative = Math.round(annualMid * ((Math.pow(1.06, yr) - 1) / 0.06));
      return { year: `Y${yr}`, revenue: rev, cumulative };
    });

    const aiRec = roi > 250
      ? `Strong opportunity. Projected ROI of ${roi}% over ${years} years significantly outperforms the regional average. Consider scaling units after Year 3 to capture rising demand in ${t(g.nameAr, g.nameEn)}.`
      : roi > 120
      ? `Solid investment with ${roi}% ROI over ${years} years. ${t(g.nameAr, g.nameEn)} shows ${g.growth}% YoY growth. Optimize pricing during peak season (${g.bestTime}) to improve returns.`
      : `Modest return at ${roi}% ROI. Consider increasing units or selecting a higher-opportunity location like Wadi Rum or Dead Sea for better forecasted demand.`;

    setResult({ revenue: annualMid, revLow: annualLow, revHigh: annualHigh, bep, roi, occupancy: g.occupancy, projection, aiRec });
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
          <div className="space-y-3 animate-fade-in">
            <div className="bg-primary text-primary-foreground rounded-2xl p-5 text-center">
              <div className="text-xs text-tertiary tracking-widest uppercase">{t("الإيراد السنوي المتوقع", "Expected Annual Revenue")}</div>
              <div className="font-display text-4xl mt-1">{result.revenue.toLocaleString()} <span className="text-base text-white/60">JD</span></div>
              <div className="text-xs text-white/60 mt-1">{t(`بمعدل إشغال ${result.occupancy}%`, `Based on ${result.occupancy}% average occupancy`)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="card-masaar p-4">
                <div className="text-xs text-muted-foreground">{t("نقطة التعادل", "Break-even")}</div>
                <div className="font-display text-xl text-primary mt-1">{result.bep} {t("سنة", "yrs")}</div>
              </div>
              <div className="card-masaar p-4">
                <div className="text-xs text-muted-foreground">{t(`عائد ${years} سنة`, `${years}-Year ROI`)}</div>
                <div className="font-display text-xl text-secondary mt-1">{result.roi}%</div>
              </div>
              <div className="card-masaar p-4">
                <div className="text-xs text-muted-foreground">{t("تصنيف الفرصة", "Opportunity")}</div>
                <div className="font-display text-base mt-1" style={{color:"hsl(170, 47%, 33%)"}}>{"⭐".repeat(Math.min(5, Math.max(3, Math.round(result.roi / 80))))}</div>
              </div>
              <div className="card-masaar p-4">
                <div className="text-xs text-muted-foreground">{t("متوسط الإشغال", "Avg Occupancy")}</div>
                <div className="font-display text-xl text-primary mt-1">{result.occupancy}%</div>
              </div>
            </div>

            <div className="card-masaar p-4">
              <h4 className="font-display text-sm mb-2">{t(`توقع الإيراد — ${years} سنوات`, `Revenue Projection — ${years} Years`)}</h4>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={result.projection}>
                  <XAxis dataKey="year" tick={{fontSize:10}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:10}} axisLine={false} tickLine={false} />
                  <RTooltip formatter={(val: number) => `${val.toLocaleString()} JD`} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(17, 46%, 47%)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cumulative" stroke="hsl(42, 82%, 64%)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5" style={{background:"hsl(17, 46%, 47%)"}}/>{t("إيراد سنوي", "Annual Revenue")}</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 border-t border-dashed" style={{borderColor:"hsl(42, 82%, 64%)"}}/>{t("تراكمي", "Cumulative")}</span>
              </div>
            </div>

            <div className="card-masaar p-4 bg-background">
              <p className="text-xs font-bold uppercase text-secondary">✨ {t("توصية الذكاء", "AI Recommendation")}</p>
              <p className="text-sm mt-2 leading-snug">{result.aiRec}</p>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
