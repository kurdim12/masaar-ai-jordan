import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "@/lib/leafletSetup";
import { useApp } from "@/context/AppContext";
import { governorates, forecastData, forecastInsights } from "@/data/jordan";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";

const oppColor = (o: "high" | "medium" | "low") =>
  o === "high" ? "hsl(17, 46%, 47%)" : o === "medium" ? "hsl(42, 82%, 64%)" : "hsl(170, 47%, 33%)";

const FORECAST_GOVS = ["Wadi Rum", "Petra", "Dead Sea", "Aqaba", "Jerash"];

export default function InvestorMap() {
  const { t, locale } = useApp();
  const nav = useNavigate();
  const top = [...governorates].sort((a, b) => b.priorityScore - a.priorityScore);
  const topOpp = top[0];

  return (
    <AppShell>
      <AppHeader />
      <div className="px-4 pt-3">
        <h1 className="font-display text-2xl">{t("فرص استثمارية", "Investment Opportunities")}</h1>
        <p className="text-muted-foreground text-sm">{t("بيانات السوق السياحي الأردني", "Jordan tourism market data")}</p>
      </div>

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card border border-border/30 h-[260px]">
        <MapContainer center={[31.5, 36.5]} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; OSM &copy; CARTO' />
          {governorates.map(g => (
            <CircleMarker key={g.id} center={[g.lat, g.lng]}
              radius={Math.max(14, g.priorityScore * 4)}
              pathOptions={{ color: oppColor(g.opportunity), fillColor: oppColor(g.opportunity), fillOpacity: 0.65, weight: 2 }}
              eventHandlers={{ click: () => nav(`/investor/opportunity/${g.id}`) }}>
              <Tooltip>{locale === "ar" ? g.nameAr : g.nameEn}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Stability index */}
      <div className="mx-4 mt-4 bg-primary text-primary-foreground rounded-2xl p-5">
        <div className="text-xs text-tertiary tracking-widest uppercase">{t("مؤشر الاستقرار السياحي", "Tourism Stability Index")}</div>
        <div className="font-display text-5xl mt-1">8.4 <span className="text-xl text-white/60">/ 10</span></div>
        <div className="mt-2 text-xs text-white/70">{t("الأردن — مستقر مع نمو إيجابي", "Jordan — stable with positive growth")}</div>
      </div>

      {/* Top opportunity */}
      <div className="mx-4 mt-3 rounded-2xl p-5 text-white relative overflow-hidden" style={{ background: "hsl(var(--secondary))" }}>
        <span className="text-[10px] tracking-widest uppercase text-tertiary">{t("الفرصة الأبرز", "Top Opportunity")}</span>
        <h3 className="font-display text-2xl mt-1">{t(topOpp.nameAr, topOpp.nameEn)}</h3>
        <p className="text-white/80 text-sm mt-1">{t(topOpp.opportunityType.ar, topOpp.opportunityType.en)}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-white/80">{t("نقاط الأولوية", "Priority Score")}</span>
          <span className="font-display text-2xl">{topOpp.priorityScore}/10</span>
        </div>
        <button onClick={() => nav(`/investor/opportunity/${topOpp.id}`)} className="mt-3 w-full bg-tertiary text-primary py-2.5 rounded-lg font-semibold">
          {t("عرض التفاصيل", "View Details")}
        </button>
      </div>

      {/* Ranking */}
      <section className="px-4 mt-5">
        <h3 className="font-display text-lg mb-2">{t("ترتيب الفرص", "Opportunity Ranking")}</h3>
        <div className="space-y-2">
          {top.map((g, i) => (
            <button key={g.id} onClick={() => nav(`/investor/opportunity/${g.id}`)}
              className="w-full card-masaar p-3 flex items-center gap-3 text-start">
              <span className="font-display text-2xl text-secondary w-9 text-center">{String(i+1).padStart(2,"0")}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{t(g.nameAr, g.nameEn)}</div>
                <div className="text-xs text-muted-foreground truncate">{t(g.opportunityType.ar, g.opportunityType.en)}</div>
                <div className="h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full" style={{ width: `${g.priorityScore*10}%`, background: oppColor(g.opportunity) }} />
                </div>
              </div>
              <div className="font-display text-base text-primary">{g.priorityScore}</div>
            </button>
          ))}
        </div>
      </section>

      <div className="px-4 mt-5">
        <button onClick={() => nav("/investor/simulator")} className="btn-primary w-full">
          🧮 {t("احسب العوائد", "Investment Simulator")}
        </button>
      </div>
      <div className="h-4" />
    </AppShell>
  );
}
