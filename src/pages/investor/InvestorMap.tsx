import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useEffect, useRef, useState } from "react";
import { getInvestorWatchlist, setInvestorWatchlist } from "@/lib/demo";
import { toast } from "sonner";
import mapboxgl from "mapbox-gl";
import {
  MAPBOX_TOKEN,
  DARK_STYLE,
  JORDAN_CENTER,
  JORDAN_ZOOM,
  createInvestorMarker,
} from "@/lib/mapbox";

export default function InvestorMap() {
  const { t } = useApp();
  const nav = useNavigate();
  const top = [...governorates].sort((a, b) => b.priorityScore - a.priorityScore);
  const topOpp = top[0];

  const [watchlist, setWatchlist] = useState(() => getInvestorWatchlist());
  const [bannerDismissed, setBannerDismissed] = useState(
    () => !!localStorage.getItem("masaar_banner_investor_dismissed")
  );
  const investorProfile = (() => {
    try { return JSON.parse(localStorage.getItem("masaar_investor_profile") || "null"); } catch { return null; }
  })();

  useEffect(() => { setInvestorWatchlist(watchlist); }, [watchlist]);

  const isWatched = (id: string) => watchlist.some((w) => w.govId === id);
  const toggleWatch = (id: string, score: number) => {
    if (isWatched(id)) {
      setWatchlist(watchlist.filter((w) => w.govId !== id));
      toast(t("تمت الإزالة من قائمة المتابعة", "Removed from watchlist"));
    } else {
      setWatchlist([
        ...watchlist,
        { govId: id, savedAt: new Date().toISOString().slice(0, 10), note: "", score },
      ]);
      toast.success(t("تمت الإضافة إلى قائمة المتابعة", "Added to watchlist"));
    }
  };

  const dismissBanner = () => {
    localStorage.setItem("masaar_banner_investor_dismissed", "1");
    setBannerDismissed(true);
  };

  const watchedGovs = watchlist
    .map((w) => ({ entry: w, gov: governorates.find((g) => g.id === w.govId) }))
    .filter((x): x is { entry: typeof watchlist[number]; gov: NonNullable<typeof x.gov> } => !!x.gov);

  // === Mapbox GL ===
  const mapEl = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapEl.current || mapRef.current || !MAPBOX_TOKEN) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: DARK_STYLE,
      center: JORDAN_CENTER,
      zoom: JORDAN_ZOOM,
      attributionControl: false,
    });
    mapRef.current = map;

    map.on("load", () => {
      governorates.forEach((g) => {
        const el = createInvestorMarker(g.priorityScore, g.opportunity);
        new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([g.lng, g.lat])
          .addTo(map);
        el.addEventListener("click", () => {
          map.flyTo({ center: [g.lng, g.lat], zoom: 9.2, duration: 1100, essential: true });
          setTimeout(() => nav(`/investor/opportunity/${g.id}`), 600);
        });
      });
    });

    return () => { map.remove(); mapRef.current = null; };
  }, [nav]);

  return (
    <AppShell>
      <AppHeader />
      <div className="px-4 pt-3 animate-fade-up delay-1">
        <h1 className="font-display text-2xl">{t("فرص استثمارية", "Investment Opportunities")}</h1>
        <p className="text-muted-foreground text-sm">{t("بيانات السوق السياحي الأردني", "Jordan tourism market data")}</p>
      </div>

      {investorProfile && !bannerDismissed && (
        <div className="mx-4 mt-3 relative card-elevated">
          <button
            onClick={dismissBanner}
            aria-label="dismiss"
            className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--sand) / 0.10)", color: "hsl(var(--t1))" }}
          >×</button>
          <div className="text-sm leading-relaxed pe-8">
            {t(
              `مرحباً ${investorProfile.name?.split(" ")[0] || "خالد"} 👋`,
              `Welcome ${investorProfile.name?.split(" ")[0] || "Khaled"} 👋`
            )}
            <br />
            {t(
              "بناءً على اهتمامك بالإيكو لودج ومراكز العلاج، وجدنا فرصتين واعدتين في وادي رم والبحر الميت.",
              "Based on your interest in eco-lodges and wellness centers, we found two promising opportunities in Wadi Rum and the Dead Sea."
            )}
          </div>
        </div>
      )}

      {/* Mapbox map */}
      <div className="mx-4 mt-3 rounded-2xl overflow-hidden border border-border/20 animate-fade-up delay-2"
           style={{ height: 240, background: "hsl(var(--n2))" }}>
        {MAPBOX_TOKEN ? (
          <div ref={mapEl} style={{ width: "100%", height: "100%" }} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center px-6">
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "hsl(var(--gold))" }}>map</span>
            <p className="mt-2 text-sm font-medium">{t("الخريطة تتطلب رمز Mapbox", "Map requires Mapbox token")}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("أضف VITE_MAPBOX_TOKEN في .env", "Add VITE_MAPBOX_TOKEN to .env")}
            </p>
          </div>
        )}
      </div>

      {/* Stability index */}
      <div className="mx-4 mt-4 card-elevated animate-fade-up delay-3">
        <div className="section-label">{t("مؤشر الاستقرار السياحي", "Tourism Stability Index")}</div>
        <div className="mt-2 flex items-end gap-3">
          <span className="kpi-giant">8.4</span>
          <span className="font-mono text-base text-muted-foreground pb-2">/ 10</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <span className="delta-up">▲ +0.6 YoY</span>
          <span className="text-xs text-muted-foreground">{t("مستقر مع نمو إيجابي", "Stable with positive growth")}</span>
        </div>
      </div>

      {/* Top opportunity — rose gradient */}
      <div className="mx-4 mt-3 rounded-2xl p-5 text-white relative overflow-hidden animate-fade-up delay-4"
           style={{ background: "var(--gradient-rose)" }}>
        <span className="text-[10px] tracking-widest uppercase font-mono" style={{ color: "hsl(var(--gold))" }}>
          {t("الفرصة الأبرز", "Top Opportunity")}
        </span>
        <h3 className="font-display text-2xl mt-1">{t(topOpp.nameAr, topOpp.nameEn)}</h3>
        <p className="text-white/80 text-sm mt-1">{t(topOpp.opportunityType.ar, topOpp.opportunityType.en)}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-white/80">{t("نقاط الأولوية", "Priority Score")}</span>
          <span className="font-mono text-3xl">{topOpp.priorityScore}<span className="text-base text-white/60">/10</span></span>
        </div>
        <button onClick={() => nav(`/investor/opportunity/${topOpp.id}`)} className="mt-3 w-full bg-tertiary text-primary py-2.5 rounded-lg font-semibold">
          {t("عرض التفاصيل", "View Details")}
        </button>
      </div>

      {watchedGovs.length > 0 && (
        <section className="px-4 mt-5">
          <h3 className="font-display text-lg mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 20 }}>bookmark</span>
            {t("قائمة متابعتي", "My Watchlist")}
          </h3>
          <div className="space-y-2">
            {watchedGovs.map(({ entry, gov }) => (
              <div key={gov.id} className="card-clean">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-base">{t(gov.nameAr, gov.nameEn)}</span>
                      <span
                        className="text-[11px] font-mono px-2 py-0.5 rounded-full"
                        style={{ background: "hsl(var(--gold) / 0.15)", color: "hsl(var(--gold))" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs italic text-muted-foreground leading-snug">{entry.note}</p>
                    )}
                    <button
                      onClick={() => nav(`/investor/opportunity/${gov.id}`)}
                      className="mt-2 text-xs font-semibold"
                      style={{ color: "hsl(var(--gold))" }}
                    >
                      {t("عرض التفاصيل →", "View Details →")}
                    </button>
                  </div>
                  <button
                    onClick={() => toggleWatch(gov.id, gov.priorityScore)}
                    aria-label="unsave"
                    className="material-symbols-outlined text-tertiary"
                    style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}
                  >bookmark</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ranking — primitive rank rows */}
      <section className="px-4 mt-5">
        <h3 className="font-display text-lg mb-2">{t("ترتيب الفرص", "Opportunity Ranking")}</h3>
        <div className="space-y-2">
          {top.map((g, i) => {
            const watched = isWatched(g.id);
            return (
              <div key={g.id} className="rank-row" onClick={() => nav(`/investor/opportunity/${g.id}`)}>
                <span className="rank-num">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="rank-name truncate">{t(g.nameAr, g.nameEn)}</div>
                  <div className="rank-type truncate">{t(g.opportunityType.ar, g.opportunityType.en)}</div>
                  <div className="priority-bar-track">
                    <div className="priority-bar-fill" style={{ width: `${g.priorityScore * 10}%` }} />
                  </div>
                </div>
                <span className="rank-score">{g.priorityScore}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWatch(g.id, g.priorityScore); }}
                  aria-label={watched ? "unsave" : "save"}
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    color: watched ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
                    fontVariationSettings: watched ? "'FILL' 1" : "'FILL' 0",
                  }}
                >bookmark</button>
              </div>
            );
          })}
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
