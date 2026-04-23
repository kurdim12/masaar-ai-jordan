import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "@/lib/leafletSetup";
import { useApp } from "@/context/AppContext";
import { aiTips, filterTypes, governorates, type GovernorateType } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";

const crowdColor = (c: "high" | "medium" | "low") =>
  c === "high" ? "hsl(12, 55%, 56%)" : c === "medium" ? "hsl(45, 65%, 55%)" : "hsl(170, 47%, 33%)";

export default function TravellerDiscover() {
  const { t, locale } = useApp();
  const nav = useNavigate();
  const [filter, setFilter] = useState<GovernorateType | "all">("all");
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTipIdx(i => (i + 1) % aiTips.length), 5000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(
    () => filter === "all" ? governorates : governorates.filter(g => g.type.includes(filter)),
    [filter]
  );

  return (
    <AppShell lightMode>
      <AppHeader />

      <div className="px-4 pt-3">
        <h1 className="font-display text-2xl leading-tight">
          {t("اكتشف الأردن", "Discover Jordan")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("توصيات ذكية مخصصة لك", "AI-curated for you")}
        </p>
      </div>

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card border border-border/30 h-[300px] relative">
        <MapContainer center={[31.5, 36.5]} zoom={7} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM &copy; CARTO'
          />
          {filtered.map(g => (
            <CircleMarker
              key={g.id} center={[g.lat, g.lng]}
              radius={Math.max(15, Math.min(40, g.visitors / 60000))}
              pathOptions={{ color: crowdColor(g.crowd), fillColor: crowdColor(g.crowd), fillOpacity: 0.6, weight: 2 }}
              eventHandlers={{ click: () => nav(`/traveller/destination/${g.id}`) }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                <span className="font-semibold">{locale === "ar" ? g.nameAr : g.nameEn}</span>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Filter chips */}
      <div className="mt-4 px-4 overflow-x-auto scrollbar-none">
        <div className="flex gap-2 pb-1">
          {filterTypes.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id as any)}
              className={`chip ${filter === f.id ? "chip-active" : ""}`}>
              <span className="material-symbols-outlined text-[16px]">{f.icon}</span>
              {t(f.ar, f.en)}
            </button>
          ))}
        </div>
      </div>

      {/* AI Tip Banner */}
      <div className="mx-4 mt-4 rounded-2xl p-4 bg-gradient-gold text-primary shadow-gold animate-fade-in" key={tipIdx}>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined">auto_awesome</span>
          <p className="text-sm font-medium leading-snug">{t(aiTips[tipIdx].ar, aiTips[tipIdx].en)}</p>
        </div>
      </div>

      {/* Destination cards */}
      <div className="mt-5 px-4 space-y-4">
        <h2 className="font-display text-lg">{t("وجهات مقترحة", "Suggested Destinations")}</h2>
        {filtered.map(g => (
          <button key={g.id} onClick={() => nav(`/traveller/destination/${g.id}`)}
            className="block w-full text-start card-masaar overflow-hidden hover:shadow-elevated transition-shadow">
            <div className="relative h-[180px]">
              <img src={g.image} alt={t(g.nameAr, g.nameEn)} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
              <span className={`absolute top-3 ${locale==="ar"?"right-3":"left-3"} chip text-xs ${
                g.crowd === "high" ? "badge-crowd-high" : g.crowd === "medium" ? "badge-crowd-medium" : "badge-crowd-low"
              }`}>
                {g.crowd === "high" ? t("مزدحم", "High") : g.crowd === "medium" ? t("متوسط", "Medium") : t("هادئ", "Quiet")}
              </span>
              <div className={`absolute bottom-3 ${locale==="ar"?"right-3":"left-3"} text-white`}>
                <h3 className="font-display text-2xl">{t(g.nameAr, g.nameEn)}</h3>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-2 leading-snug">{t(g.description.ar, g.description.en)}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-secondary font-medium">
                  {t("أفضل وقت:", "Best time:")} {t(g.bestTimeAr, g.bestTime)}
                </p>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="h-4" />
    </AppShell>
  );
}
