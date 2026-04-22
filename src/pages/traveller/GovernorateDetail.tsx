import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { getActiveDemoOffers } from "@/lib/demo";

export default function GovernorateDetail() {
  const { id } = useParams();
  const { t, locale, offers } = useApp();
  const nav = useNavigate();
  const g = governorates.find(x => x.id === id);
  if (!g) return <div className="p-6">Not found.</div>;

  const localOffers = offers.filter(o => o.governorateId === g.id);
  const similar = governorates.filter(x => x.id !== g.id && x.type.some(t2 => g.type.includes(t2))).slice(0, 3);

  // Mock 12-month crowd forecast
  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const base = g.crowd === "high" ? 70 : g.crowd === "medium" ? 50 : 30;
  const forecast = months.map((m, i) => ({ m, v: base + Math.round(Math.sin((i + g.id.length) / 1.4) * 25) }));

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-md mx-auto min-h-screen pb-10">
        {/* Cinematic header */}
        <div className="relative h-[260px]">
          <img src={g.image} alt={t(g.nameAr, g.nameEn)} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/40 to-primary" />
          <button onClick={() => nav(-1)} className={`absolute top-4 ${locale==="ar"?"right-4":"left-4"} w-9 h-9 rounded-full glass flex items-center justify-center`}>
            <span className="material-symbols-outlined">{locale==="ar"?"arrow_forward":"arrow_back"}</span>
          </button>
          <div className="absolute bottom-4 inset-x-5 text-white">
            <h1 className="font-display text-4xl mb-1">{t(g.nameAr, g.nameEn)}</h1>
            <p className="text-white/80 text-sm">{t(g.description.ar, g.description.en)}</p>
            <div className="flex gap-2 mt-3">
              <span className={`chip text-xs ${g.crowd === "high" ? "badge-crowd-high" : g.crowd === "medium" ? "badge-crowd-medium" : "badge-crowd-low"}`}>
                {g.crowd === "high" ? t("مزدحم", "High crowd") : g.crowd === "medium" ? t("متوسط", "Medium") : t("هادئ", "Quiet")}
              </span>
              <span className="chip text-xs bg-white/20 text-white border-white/30">{t(g.bestTimeAr, g.bestTime)}</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-2 px-4 mt-4">
          {[
            { i: "groups", v: `${(g.visitors/1000).toFixed(0)}K`, l: t("الزوار", "Visitors") },
            { i: "hotel", v: `${g.occupancy}%`, l: t("الإشغال", "Occupancy") },
            { i: "star", v: g.rating.toFixed(1), l: t("التقييم", "Rating") },
            { i: "payments", v: `${g.avgNight}`, l: t("د.أ/ليلة", "JD/night") },
          ].map((s, idx) => (
            <div key={idx} className="card-masaar p-2.5 text-center">
              <span className="material-symbols-outlined text-secondary text-[20px]">{s.i}</span>
              <div className="font-display text-base mt-0.5">{s.v}</div>
              <div className="text-[10px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Best time to visit */}
        <section className="px-4 mt-6">
          <h3 className="font-display text-lg mb-2">{t("أفضل وقت للزيارة", "Best Time to Visit")}</h3>
          <div className="card-masaar divide-y divide-border/30">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3"><span className="text-2xl">☀️</span>
                <div><div className="font-medium">{t(g.bestTimeAr, g.bestTime)}</div>
                <div className="text-xs text-muted-foreground">{t("الأفضل", "Best window")}</div></div>
              </div>
              <span className="chip text-xs" style={{ background: "hsl(var(--secondary-container))", color: "hsl(var(--secondary-container-foreground))" }}>{t("ذروة", "Peak")}</span>
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3"><span className="text-2xl">🌤</span>
                <div><div className="font-medium">{t(g.altTimeAr, g.altTime)}</div>
                <div className="text-xs text-muted-foreground">{t("بديل ممتاز", "Great alternative")}</div></div>
              </div>
              <span className="chip text-xs badge-crowd-low">{t("هادئ", "Quiet")}</span>
            </div>
          </div>
        </section>

        {/* Crowd forecast */}
        <section className="px-4 mt-6">
          <h3 className="font-display text-lg mb-2">{t("توقع الازدحام هذا الموسم", "Crowd Forecast This Season")}</h3>
          <div className="card-masaar p-4">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={forecast}>
                <XAxis dataKey="m" axisLine={false} tickLine={false} fontSize={10} />
                <Tooltip cursor={{ fill: "hsl(var(--muted))" }} />
                <Bar dataKey="v" radius={[4,4,0,0]} fill="hsl(var(--secondary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Flash Offers — cross-user, from masaar_active_offers */}
        {(() => {
          const flash = getActiveDemoOffers().filter((o) => o.location === g.id);
          if (flash.length === 0) return null;
          return (
            <section className="px-4 mt-6">
              <h3 className="font-display text-lg mb-2 flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ background: "hsl(var(--destructive))" }}
                />
                ⚡ {t("عروض لحظية", "Flash Offers")}
              </h3>
              <div className="space-y-3">
                {flash.map((o) => (
                  <div key={o.id} className="card-clean">
                    <div className="font-display text-lg">{o.businessName}</div>
                    <div className="text-sm text-muted-foreground">{o.roomType}</div>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-display text-2xl text-secondary">
                        {o.offerPrice} <span className="text-xs text-muted-foreground">{t("د.أ / ليلة", "JD / night")}</span>
                      </span>
                      <span className="text-xs text-muted-foreground line-through">{o.originalPrice} JD</span>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2">
                      <span>⏱ {o.expiresIn} {t("متبقية", "left")}</span>
                      <span>👁 {o.views} {t("سائح شاهد هذا", "travellers viewed this")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 leading-snug">
                      {t(o.descriptionAr, o.description)}
                    </p>
                    <button
                      className="w-full mt-3 rounded-lg py-3 font-semibold text-white"
                      style={{ background: "#8b4f33" }}
                    >
                      {t("عرض التفصيل", "View Offer")}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

        {/* Available offers (existing context offers) */}
        <section className="px-4 mt-6">
          <h3 className="font-display text-lg mb-2">{t("عروض متاحة الآن", "Available Now")}</h3>
          {localOffers.length === 0 ? (
            <div className="card-masaar p-5 text-center text-sm text-muted-foreground">
              {t("لا توجد عروض حالياً", "No current offers")}
            </div>
          ) : (
            <div className="space-y-3">
              {localOffers.map(o => (
                <div key={o.id} className="card-masaar p-4 relative">
                  {o.emergency && (
                    <span className={`absolute top-3 ${locale==="ar"?"right-3":"left-3"} chip text-[10px] badge-crowd-high`}>🔴 {t("عرض طارئ", "Emergency")}</span>
                  )}
                  <div className="font-display text-lg">{o.businessName}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-snug">{t(o.descAr || "", o.descEn || "")}</p>
                  <div className="flex items-end justify-between mt-3">
                    <div>
                      <span className="font-display text-2xl text-secondary">{o.offerPrice} <span className="text-xs text-muted-foreground">{t("د.أ", "JD")}</span></span>
                      <span className="text-xs text-muted-foreground line-through ms-2">{o.originalPrice}</span>
                    </div>
                    <button className="btn-primary text-xs py-2 px-4">{t("احجز", "Book")}</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Similar destinations */}
        <section className="px-4 mt-6">
          <h3 className="font-display text-lg mb-2">{t("بدائل قريبة", "Nearby Alternatives")}</h3>
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex gap-3">
              {similar.map(s => (
                <button key={s.id} onClick={() => nav(`/traveller/destination/${s.id}`)}
                  className="card-masaar w-44 shrink-0 overflow-hidden text-start">
                  <img src={s.image} alt={t(s.nameAr, s.nameEn)} className="w-full h-24 object-cover" />
                  <div className="p-3">
                    <div className="font-display text-sm">{t(s.nameAr, s.nameEn)}</div>
                    <div className="text-xs text-muted-foreground">{t(s.bestTimeAr, s.bestTime)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="px-4 mt-6">
          <button onClick={() => nav("/traveller/plan")} className="btn-primary w-full flex items-center justify-center gap-2">
            {t("خطط رحلتك", "Plan Your Trip")} <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}
