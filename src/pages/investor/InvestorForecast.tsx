import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { forecastData, forecastInsights, governorates } from "@/data/jordan";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const FORECAST_GOVS = ["Wadi Rum", "Petra", "Dead Sea", "Aqaba", "Jerash", "Karak"];

const govIdByName: Record<string, string> = {
  "Wadi Rum": "wadi_rum",
  "Petra": "petra",
  "Dead Sea": "dead_sea",
  "Aqaba": "aqaba",
  "Jerash": "jerash",
  "Karak": "karak",
};

export default function InvestorForecast() {
  const { t } = useApp();
  const nav = useNavigate();
  const [selected, setSelected] = useState<string>("Wadi Rum");
  const data = forecastData[selected] || forecastData["Wadi Rum"];
  const insight = forecastInsights[selected] || forecastInsights["Wadi Rum"];
  const govId = govIdByName[selected];
  const gov = governorates.find(g => g.id === govId);

  return (
    <AppShell>
      <AppHeader />
      <div className="px-6 pt-4 pb-8 space-y-8">
        <header className="space-y-1">
          <h1 className="font-display text-[24px] text-primary font-semibold">
            {t("توقعات الطلب", "Demand Forecast")}
          </h1>
          <p className="text-[13px] text-muted-foreground">
            {t("توقعات الذكاء الاصطناعي للزوار — 12 شهراً قادمة", "AI-projected visitor demand — next 12 months")}
          </p>
        </header>

        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-6 px-6">
          {FORECAST_GOVS.map(g => (
            <button
              key={g}
              onClick={() => setSelected(g)}
              className={`chip whitespace-nowrap ${selected === g ? "chip-active" : ""}`}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="card-clean">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="invForecastGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="visitors" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#invForecastGrad)" />
              <Area type="monotone" dataKey="forecast" stroke="hsl(var(--tertiary))" strokeWidth={2} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5" style={{ background: "hsl(var(--secondary))" }} />
              {t("تاريخي", "Historical")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-dashed" style={{ borderColor: "hsl(var(--tertiary))" }} />
              {t("توقع AI", "AI Forecast")}
            </span>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-5">
          <div className="text-[11px] text-tertiary tracking-[0.2em] uppercase mb-2">
            ✨ {t("رؤية الذكاء", "AI Insight")}
          </div>
          <p className="text-[14px] leading-relaxed">{t(insight.ar, insight.en)}</p>
        </div>

        {gov && (
          <button
            onClick={() => nav(`/investor/opportunity/${gov.id}`)}
            className="btn-primary w-full"
          >
            {t(`استثمر في ${gov.nameAr}`, `Invest in ${gov.nameEn}`)} →
          </button>
        )}
      </div>
    </AppShell>
  );
}
