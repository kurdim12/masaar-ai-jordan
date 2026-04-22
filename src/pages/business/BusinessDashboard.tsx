import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getActiveDemoOffers, type DemoOffer } from "@/lib/demo";
import { businessForecast, governorates } from "@/data/jordan";

const insights = [
  { ar: "الطلب مرتفع الأسبوع القادم — فكّر في رفع أسعارك 15%", en: "High demand next week — consider raising prices 15%" },
  { ar: "موسم الذروة قادم في مارس — جهّز عروضاً مبكرة", en: "Peak season in March — prep early offers" },
  { ar: "سياح من ألمانيا يبحثون عن تجارب في منطقتك", en: "German travellers searching your area for experiences" },
];

export default function BusinessDashboard() {
  const { t, businessProfile, offers } = useApp();
  const nav = useNavigate();
  const [tip, setTip] = useState(0);
  useEffect(() => { const id = setInterval(() => setTip(i => (i+1) % insights.length), 5000); return () => clearInterval(id); }, []);

  const demoOffers: DemoOffer[] = getActiveDemoOffers();
  const myOffers = offers.filter(o => !businessProfile.location || o.governorateId === businessProfile.location || o.businessName === businessProfile.name);
  const occupancyData = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ d: i+1, v: 50 + Math.round(Math.sin(i/2.5)*20 + Math.random()*8) })), []);

  const [aiBannerDismissed, setAiBannerDismissed] = useState(
    () => !!localStorage.getItem("masaar_banner_business_dismissed")
  );
  const dismissAi = () => {
    localStorage.setItem("masaar_banner_business_dismissed", "1");
    setAiBannerDismissed(true);
  };
  const isPetraDemo = businessProfile.location === "petra";

  return (
    <AppShell>
      <AppHeader title={businessProfile.name || t("لوحتي", "Dashboard")} />
      <div className="px-4 pt-4 space-y-4">
        <div className="bg-primary text-primary-foreground rounded-2xl p-4">
          <div className="text-xs text-tertiary tracking-widest uppercase">{t("اليوم", "Today")}</div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div><div className="text-xs text-white/60">{t("غرف فاضية","Empty rooms")}</div><div className="font-display text-3xl">8</div></div>
            <div><div className="text-xs text-white/60">{t("الإشغال","Occupancy")}</div><div className="font-display text-3xl">60%</div></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { i: "trending_up", v: "68%", l: t("هذا الأسبوع","This week"), s: "+5%" },
            { i: "payments", v: "1,200", l: t("الإيراد المتوقع","Expected revenue"), s: "JD" },
            { i: "visibility", v: "142", l: t("مشاهدات","Profile views"), s: "" },
            { i: "event_available", v: "12", l: t("حجوزات","Bookings"), s: "" },
          ].map((k, i) => (
            <div key={i} className="card-masaar p-3">
              <span className="material-symbols-outlined text-secondary">{k.i}</span>
              <div className="font-display text-2xl mt-1">{k.v} <span className="text-xs text-success">{k.s}</span></div>
              <div className="text-[11px] text-muted-foreground">{k.l}</div>
            </div>
          ))}
        </div>

        {/* Personalized AI insight banner for Nour (Petra) */}
        {isPetraDemo && !aiBannerDismissed && (
          <div className="rounded-2xl p-4 bg-gradient-gold text-primary shadow-gold relative">
            <button
              onClick={dismissAi}
              aria-label="dismiss"
              className="absolute top-2 end-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(15,28,44,0.1)" }}
            >×</button>
            <div className="flex items-start gap-2 pe-8">
              <span className="material-symbols-outlined">auto_awesome</span>
              <p className="text-sm font-medium leading-snug">
                {t(
                  "✨ طلب مرتفع متوقع للبتراء الأسبوع القادم. فكّر في رفع السعر الأساسي إلى 65 د.أ وإنشاء حزمة 3 ليالٍ.",
                  "✨ High demand expected for Petra next week. Consider raising your base price to 65 JD and creating a 3-night package."
                )}
              </p>
            </div>
          </div>
        )}

        <div className="rounded-2xl p-4 bg-gradient-gold text-primary shadow-gold animate-fade-in" key={tip}>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined">auto_awesome</span>
            <p className="text-sm font-medium leading-snug">{t(insights[tip].ar, insights[tip].en)}</p>
          </div>
        </div>

        <section>
          <h3 className="font-display text-lg mb-2">{t("الإشغال (30 يوم)", "Occupancy (30 days)")}</h3>
          <div className="card-masaar p-4">
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={occupancyData}>
                <XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={9}/>
                <Tooltip />
                <Bar dataKey="v" radius={[3,3,0,0]} fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-2">{t("عروضك النشطة", "Active Offers")}</h3>
          {demoOffers.length > 0 ? (
            <div className="space-y-2">
              {demoOffers.map((o) => (
                <div key={o.id} className="card-clean relative">
                  <span
                    className="absolute top-3 end-3 text-[10px] font-bold px-2 py-1 rounded-full"
                    style={{ background: "hsl(var(--destructive))", color: "white" }}
                  >🔴 {t("نشط", "ACTIVE")}</span>
                  <div className="font-display text-base mb-1">{o.roomType} · {o.rooms} {t("متاحة", "available")}</div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-display text-2xl text-secondary">{o.offerPrice} <span className="text-xs text-muted-foreground">JD</span></span>
                    <span className="text-xs text-muted-foreground line-through">{o.originalPrice} JD</span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                    <span>⏱ {t(`تنتهي خلال ${o.expiresIn}`, `Expires in ${o.expiresIn}`)}</span>
                    <span>👁 {o.views} {t("مشاهدة", "views")}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-snug mb-3">
                    {t(o.descriptionAr, o.description)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => nav("/business/offer")}
                      className="flex-1 rounded-lg py-2 px-3 text-xs font-semibold border"
                      style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--primary))" }}
                    >{t("تعديل", "Edit")}</button>
                    <button
                      className="flex-1 rounded-lg py-2 px-3 text-xs font-semibold text-white"
                      style={{ background: "hsl(var(--secondary))" }}
                    >{t("ترويج 🔥", "Boost 🔥")}</button>
                  </div>
                </div>
              ))}
            </div>
          ) : myOffers.length === 0 ? (
            <div className="card-masaar p-4 text-center text-sm text-muted-foreground">{t("لا توجد عروض بعد", "No active offers")}</div>
          ) : (
            <div className="space-y-2">
              {myOffers.slice(0,3).map(o => (
                <div key={o.id} className="card-masaar p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{o.businessName} • {o.roomType}</div>
                    <div className="text-xs text-muted-foreground">{o.duration} • 👁 {o.views}</div>
                  </div>
                  <div className="font-display text-secondary">{o.offerPrice} <span className="text-xs text-muted-foreground">JD</span></div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid grid-cols-2 gap-2">
          <button onClick={() => nav("/business/offer")} className="btn-primary text-sm">➕ {t("عرض جديد","New Offer")}</button>
          <button onClick={() => nav("/business/emergency")} className="rounded-lg py-3 px-4 font-medium text-white text-sm" style={{ background: "hsl(var(--destructive))" }}>📢 {t("طارئ","Emergency")}</button>
        </div>
        <button onClick={() => nav("/business/analytics")} className="btn-ghost-sand w-full">📊 {t("تحليل مفصل","Detailed Analytics")}</button>
        <div className="h-2"/>
      </div>
    </AppShell>
  );
}
