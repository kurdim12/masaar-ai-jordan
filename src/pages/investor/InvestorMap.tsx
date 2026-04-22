import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "@/lib/leafletSetup";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { MapMount } from "@/components/MapMount";
import { useEffect, useState } from "react";
import { getInvestorWatchlist, setInvestorWatchlist } from "@/lib/demo";
import { toast } from "sonner";

const oppColor = (o: "high" | "medium" | "low") =>
  o === "high" ? "hsl(17, 46%, 47%)" : o === "medium" ? "hsl(42, 82%, 64%)" : "hsl(170, 47%, 33%)";

export default function InvestorMap() {
  const { t, locale } = useApp();
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

  return (
    <AppShell>
      <AppHeader />
      <div className="px-4 pt-3">
        <h1 className="font-display text-2xl">{t("فرص استثمارية", "Investment Opportunities")}</h1>
        <p className="text-muted-foreground text-sm">{t("بيانات السوق السياحي الأردني", "Jordan tourism market data")}</p>
      </div>

      {/* Personalized banner for investor demo */}
      {investorProfile && !bannerDismissed && (
        <div className="mx-4 mt-3 relative" style={{ background: "#0f1c2c", color: "white", borderRadius: 12, padding: 16 }}>
          <button
            onClick={dismissBanner}
            aria-label="dismiss"
            className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.1)", color: "white" }}
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

      <div className="mx-4 mt-3 rounded-2xl overflow-hidden shadow-card border border-border/30 h-[260px]">
        <MapMount height={260}>
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
        </MapMount>
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

      {/* My Watchlist */}
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
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: "hsl(var(--secondary-container))", color: "hsl(var(--secondary-container-foreground))" }}
                      >
                        {entry.score}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-xs italic text-muted-foreground leading-snug">{entry.note}</p>
                    )}
                    <button
                      onClick={() => nav(`/investor/opportunity/${gov.id}`)}
                      className="mt-2 text-xs font-semibold text-secondary"
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

      {/* Ranking */}
      <section className="px-4 mt-5">
        <h3 className="font-display text-lg mb-2">{t("ترتيب الفرص", "Opportunity Ranking")}</h3>
        <div className="space-y-2">
          {top.map((g, i) => {
            const watched = isWatched(g.id);
            return (
              <div key={g.id} className="w-full card-clean flex items-center gap-3">
                <button onClick={() => nav(`/investor/opportunity/${g.id}`)} className="flex-1 flex items-center gap-3 text-start min-w-0">
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
                <button
                  onClick={(e) => { e.stopPropagation(); toggleWatch(g.id, g.priorityScore); }}
                  aria-label={watched ? "unsave" : "save"}
                  className="material-symbols-outlined"
                  style={{
                    fontSize: 22,
                    color: watched ? "hsl(var(--tertiary))" : "hsl(var(--muted-foreground))",
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
