import { useNavigate, useParams } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function OpportunityDetail() {
  const { id } = useParams();
  const { t, locale } = useApp();
  const nav = useNavigate();
  const g = governorates.find(x => x.id === id);
  if (!g) return <div className="p-6">Not found</div>;

  const months = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const cap = 100;
  const data = months.map((m, i) => {
    const demand = Math.max(40, Math.round(70 + Math.sin((i + g.id.length) / 1.4) * 35 + (g.priorityScore - 7) * 8));
    return { m, demand, capacity: cap };
  });

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <div className="max-w-md mx-auto pb-8">
        <div className="relative h-[230px]">
          <img src={g.image} alt={t(g.nameAr, g.nameEn)} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-primary" />
          <button onClick={() => nav(-1)} className={`absolute top-4 ${locale==="ar"?"right-4":"left-4"} w-9 h-9 rounded-full glass flex items-center justify-center`}>
            <span className="material-symbols-outlined">{locale==="ar"?"arrow_forward":"arrow_back"}</span>
          </button>
          <div className="absolute bottom-4 inset-x-5 text-white">
            <div className="text-tertiary text-[10px] tracking-widest uppercase">{t("فرصة استثمارية", "Investment Opportunity")}</div>
            <h1 className="font-display text-3xl">{t(g.nameAr, g.nameEn)}</h1>
            <p className="text-white/80 text-sm mt-1">{t(g.opportunityType.ar, g.opportunityType.en)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 px-4 mt-4">
          {[
            { i: "trending_up", v: `+${g.growth}%`, l: t("نمو سنوي", "Annual Growth") },
            { i: "groups", v: `${(g.visitors/1000).toFixed(0)}K`, l: t("الزوار", "Visitors") },
            { i: "hotel", v: `${g.occupancy}%`, l: t("الإشغال", "Occupancy") },
            { i: "bed", v: `${g.bedGap}`, l: t("فجوة الأسرة", "Bed Gap") },
          ].map((s, i) => (
            <div key={i} className="card-masaar p-3 flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">{s.i}</span>
              <div>
                <div className="font-display text-xl">{s.v}</div>
                <div className="text-[11px] text-muted-foreground">{s.l}</div>
              </div>
            </div>
          ))}
        </div>

        <section className="px-4 mt-5">
          <h3 className="font-display text-lg mb-2">{t("الطلب مقابل الطاقة", "Demand vs Capacity")}</h3>
          <div className="card-masaar p-4">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="d" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.5}/>
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="m" axisLine={false} tickLine={false} fontSize={10}/>
                <Tooltip />
                <Area type="monotone" dataKey="capacity" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" fill="transparent" />
                <Area type="monotone" dataKey="demand" stroke="hsl(var(--secondary))" fill="url(#d)" strokeWidth={2}/>
              </AreaChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-1">{t("المساحة فوق الخط المنقط = فرصة سوق غير مغطاة", "Area above the dashed line = unmet market opportunity")}</p>
          </div>
        </section>

        <section className="px-4 mt-5">
          <div className="bg-primary text-primary-foreground rounded-2xl p-5">
            <div className="flex items-center gap-2 text-tertiary text-xs tracking-widest uppercase">
              <span className="material-symbols-outlined text-[18px]">checklist</span>
              {t("التوصية", "Recommendation")}
            </div>
            <h4 className="font-display text-xl mt-1">{t(g.opportunityType.ar, g.opportunityType.en)}</h4>
            <p className="text-white/80 text-sm mt-2 leading-relaxed">{t(g.recommendation.ar, g.recommendation.en)}</p>
            <div className="mt-3">
              <div className="text-xs text-tertiary mb-1.5">{t("نوع الاستثمار المقترح", "Suggested Investment")}</div>
              <div className="flex flex-wrap gap-2">
                {g.suggestedInvestments.map((s, i) => (
                  <span key={i} className="chip text-xs bg-white/10 text-white border-white/20">{t(s.ar, s.en)}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="px-4 mt-5">
          <button onClick={() => nav("/investor/simulator")} className="btn-primary w-full flex items-center justify-center gap-2">
            🧮 {t("احسب العوائد", "Calculate Returns")}
          </button>
        </div>
      </div>
    </div>
  );
}
