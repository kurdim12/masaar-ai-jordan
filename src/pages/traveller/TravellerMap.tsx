import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "@/lib/leafletSetup";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { MapMount } from "@/components/MapMount";

const crowdColor = (c: "high" | "medium" | "low") =>
  c === "high" ? "hsl(12, 55%, 56%)" : c === "medium" ? "hsl(45, 65%, 55%)" : "hsl(170, 47%, 33%)";

export default function TravellerMap() {
  const { t, locale } = useApp();
  const nav = useNavigate();

  return (
    <AppShell>
      <AppHeader title={t("الخريطة", "Map")} />
      <div className="h-[calc(100vh-9rem)] mx-3 mt-2 rounded-2xl overflow-hidden border border-border/30 shadow-card">
        <MapMount>
        <MapContainer center={[31.5, 36.5]} zoom={7} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OSM &copy; CARTO'
          />
          {governorates.map(g => (
            <CircleMarker key={g.id} center={[g.lat, g.lng]}
              radius={Math.max(14, Math.min(40, g.visitors / 60000))}
              pathOptions={{ color: crowdColor(g.crowd), fillColor: crowdColor(g.crowd), fillOpacity: 0.6, weight: 2 }}
              eventHandlers={{ click: () => nav(`/traveller/destination/${g.id}`) }}>
              <Tooltip direction="top">{locale === "ar" ? g.nameAr : g.nameEn}</Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
        </MapMount>
      </div>
      <div className="px-4 mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:crowdColor("high")}}/>{t("مزدحم","High")}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:crowdColor("medium")}}/>{t("متوسط","Medium")}</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{background:crowdColor("low")}}/>{t("هادئ","Quiet")}</span>
      </div>
    </AppShell>
  );
}
