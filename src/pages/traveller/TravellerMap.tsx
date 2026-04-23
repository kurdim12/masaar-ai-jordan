import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import mapboxgl from "mapbox-gl";
import {
  MAPBOX_TOKEN,
  WARM_STYLE,
  JORDAN_CENTER,
  JORDAN_ZOOM,
  createTravellerMarker,
  CROWD_COLOR,
} from "@/lib/mapbox";

export default function TravellerMap() {
  const { t, locale } = useApp();
  const nav = useNavigate();
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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

    map.on("load", () => {
      governorates.forEach((g) => {
        const label = locale === "ar" ? g.nameAr : g.nameEn;
        const el = createTravellerMarker(g.crowd, label);
        new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([g.lng, g.lat])
          .addTo(map);
        el.addEventListener("click", () => nav(`/traveller/destination/${g.id}`));
      });
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [nav, locale]);

  return (
    <AppShell lightMode>
      <AppHeader title={t("الخريطة", "Map")} lightMode />
      <div className="h-[calc(100vh-9rem)] mx-3 mt-2 rounded-2xl overflow-hidden border border-border/30 shadow-card"
           style={{ background: "#e8d9b8" }}>
        {MAPBOX_TOKEN ? (
          <div ref={mapEl} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <span className="material-symbols-outlined" style={{ fontSize: 48, color: "hsl(var(--secondary))" }}>map</span>
            <p className="mt-2 text-sm font-medium">{t("الخريطة تتطلب رمز Mapbox", "Map requires Mapbox token")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("أضف VITE_MAPBOX_TOKEN في .env", "Add VITE_MAPBOX_TOKEN to .env")}
            </p>
          </div>
        )}
      </div>
      <div className="px-4 mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:CROWD_COLOR.high}}/>{t("مزدحم","High")}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:CROWD_COLOR.medium}}/>{t("متوسط","Medium")}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:CROWD_COLOR.low}}/>{t("هادئ","Quiet")}</span>
      </div>
    </AppShell>
  );
}
