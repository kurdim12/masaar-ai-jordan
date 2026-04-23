import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { aiTips, filterTypes, governorates, type GovernorateType } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import mapboxgl from "mapbox-gl";
import {
  MAPBOX_TOKEN,
  WARM_STYLE,
  JORDAN_CENTER,
  JORDAN_ZOOM,
  createTravellerMarker,
} from "@/lib/mapbox";

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

  // === Mapbox map (warm outdoors style) ===
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapEl.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: WARM_STYLE,
      center: JORDAN_CENTER,
      zoom: JORDAN_ZOOM,
      attributionControl: false,
    });
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; markersRef.current = []; };
  }, []);

  // Refresh markers on filter change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const addMarkers = () => {
      filtered.forEach((g) => {
        const label = locale === "ar" ? g.nameAr : g.nameEn;
        const el = createTravellerMarker(g.crowd, label);
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([g.lng, g.lat])
          .addTo(map);
        el.addEventListener("click", () => nav(`/traveller/destination/${g.id}`));
        markersRef.current.push(marker);
      });
    };

    if (map.isStyleLoaded()) addMarkers();
    else map.once("load", addMarkers);
  }, [filtered, locale, nav]);

  return (
    <AppShell lightMode>
      <AppHeader lightMode />

      <div className="px-4 pt-3 animate-fade-up delay-1">
        <h1 className="font-display text-2xl leading-tight">
          {t("اكتشف الأردن", "Discover Jordan")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {t("توصيات ذكية مخصصة لك", "AI-curated for you")}
        </p>
      </div>

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card border border-border/30 animate-fade-up delay-2"
           style={{ height: 220, background: "#e8d9b8" }}>
        {MAPBOX_TOKEN ? (
          <div ref={mapEl} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "hsl(var(--secondary))" }}>map</span>
            <p className="mt-2 text-sm font-medium">{t("الخريطة تتطلب رمز Mapbox", "Map requires Mapbox token")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("أضف VITE_MAPBOX_TOKEN في .env", "Add VITE_MAPBOX_TOKEN to .env")}
            </p>
          </div>
        )}
      </div>

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

      <div className="mx-4 mt-4 rounded-2xl p-4 bg-gradient-gold text-primary shadow-gold animate-fade-in" key={tipIdx}>
        <div className="flex items-start gap-2">
          <span className="material-symbols-outlined">auto_awesome</span>
          <p className="text-sm font-medium leading-snug">{t(aiTips[tipIdx].ar, aiTips[tipIdx].en)}</p>
        </div>
      </div>

      <div className="mt-5 px-4 space-y-4">
        <h2 className="font-display text-lg">{t("وجهات مقترحة", "Suggested Destinations")}</h2>
        {filtered.map(g => (
          <button key={g.id} onClick={() => nav(`/traveller/destination/${g.id}`)}
            className="block w-full text-start card-masaar overflow-hidden hover:shadow-elevated transition-shadow">
            <div className="relative h-[210px]">
              <img src={g.image} alt={t(g.nameAr, g.nameEn)} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 destination-card-overlay" />
              <span className={`absolute top-3 ${locale==="ar"?"right-3":"left-3"} chip text-xs ${
                g.crowd === "high" ? "badge-crowd-high" : g.crowd === "medium" ? "badge-crowd-medium" : "badge-crowd-low"
              }`}>
                {g.crowd === "high" ? t("مزدحم", "High") : g.crowd === "medium" ? t("متوسط", "Medium") : t("هادئ", "Quiet")}
              </span>
              <div className={`absolute bottom-3 ${locale==="ar"?"right-3":"left-3"} text-white`}>
                <h3 className="destination-card-title">{t(g.nameAr, g.nameEn)}</h3>
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
