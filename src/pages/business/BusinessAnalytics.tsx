import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { Area, AreaChart, Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { businessForecast, governorates } from "@/data/jordan";

const COLORS = ["hsl(213, 49%, 12%)","hsl(17, 46%, 37%)","hsl(42, 82%, 64%)","hsl(170, 47%, 33%)"];

export default function BusinessAnalytics() {
  const { t, businessProfile } = useApp();
  const [period, setPeriod] = useState<"week"|"month"|"year"|"forecast">("month");
  const businessLocGov = governorates.find(g => g.id === businessProfile.location);
  const businessLocation = businessLocGov ? t(businessLocGov.nameAr, businessLocGov.nameEn) : t("منطقتك", "your area");
  const occupancy = Array.from({ length: 30 }, (_, i) => ({ d: i+1, v: 55 + Math.round(Math.sin(i/3)*15 + Math.random()*8) }));
  const revenue = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m,i) => ({ m, v: 4000 + Math.round(Math.sin(i/2)*1500 + i*120) }));
  const nationalities = [
    { name: t("أردنيون","Jordanians"), value: 35 },
    { name: t("خليجيون","Gulf"), value: 28 },
    { name: t("أوروبيون","Europeans"), value: 22 },
    { name: t("أمريكيون","Americans"), value: 15 },
  ];
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => ({ d, v: Math.round(40 + Math.random()*50) }));
  const tips = [
    t("ارفع أسعار نهاية الأسبوع 10–15%", "Raise weekend prices 10–15%"),
    t("قدم حزماً عائلية للسياح الخليجيين في الصيف", "Offer family bundles to Gulf travellers in summer"),
    t("أضف باقة سبا قصيرة لجذب الزوار اليوميين", "Add a short spa package to attract day visitors"),
  ];

  return (
    <AppShell>
      <AppHeader title={t("تحليلات مشروعك","Business Analytics")} />
      <div className="px-4 pt-4 space-y-4">
        <div className="flex gap-2">
          {(["week","month","year"] as const).map(p => (
            <button key={p} onClick={()=>setPeriod(p)} className={`chip flex-1 justify-center ${period===p?"chip-active":""}`}>
              {t({week:"الأسبوع",month:"الشهر",year:"السنة"}[p], {week:"Week",month:"Month",year:"Year"}[p])}
            </button>
          ))}
        </div>

        <div className="card-masaar p-4">
          <h3 className="font-display mb-2">{t("اتجاه الإشغال","Occupancy Trend")}</h3>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={occupancy}><XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={9}/><Tooltip/><Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={2} dot={false}/></LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-masaar p-4">
          <h3 className="font-display mb-2">{t("الإيراد الشهري","Monthly Revenue")}</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={revenue}><XAxis dataKey="m" axisLine={false} tickLine={false} fontSize={9}/><Tooltip/><Bar dataKey="v" fill="hsl(var(--secondary))" radius={[3,3,0,0]}/></BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card-masaar p-3">
            <h3 className="font-display text-sm mb-1">{t("جنسيات الزوار","Nationalities")}</h3>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={nationalities} dataKey="value" innerRadius={28} outerRadius={55}>
                  {nationalities.map((_,i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card-masaar p-3">
            <h3 className="font-display text-sm mb-1">{t("أفضل الأيام","Best Days")}</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={days}><XAxis dataKey="d" axisLine={false} tickLine={false} fontSize={9}/><Bar dataKey="v" fill="hsl(var(--tertiary))" radius={[3,3,0,0]}/></BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-2xl p-4">
          <div className="text-xs text-tertiary uppercase tracking-widest">{t("مقارنة المنطقة","vs Region")}</div>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div><div className="text-xs text-white/60">{t("إشغالك","You")}</div><div className="font-display text-2xl">68%</div></div>
            <div><div className="text-xs text-white/60">{t("المتوسط","Average")}</div><div className="font-display text-2xl">62%</div></div>
          </div>
          <div className="mt-2 text-sm text-tertiary">✅ {t("أعلى من المتوسط بـ 6%","6% above average")}</div>
        </div>

        <div>
          <h3 className="font-display mb-2">✨ {t("توصيات الذكاء الاصطناعي","AI Recommendations")}</h3>
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <div key={i} className="card-masaar p-3 text-sm flex gap-2">
                <span className="text-tertiary">•</span><span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
