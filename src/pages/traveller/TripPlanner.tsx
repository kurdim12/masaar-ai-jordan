import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";

export default function TripPlanner() {
  const { t } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [days, setDays] = useState(3);
  const [stage, setStage] = useState<"pick" | "loading" | "result">("pick");
  const [itinerary, setItinerary] = useState<{ ar: string; en: string }[]>([]);

  const generate = () => {
    setStage("loading");
    setTimeout(() => {
      const picks = (selected.length ? selected : ["amman","petra","wadi_rum"]).slice(0, days);
      const out: { ar: string; en: string }[] = [];
      for (let i = 0; i < days; i++) {
        const g = governorates.find(x => x.id === picks[i % picks.length])!;
        out.push({
          ar: `🌅 الصباح: استكشاف ${g.nameAr}\n🌞 الظهر: تجربة محلية وغداء\n🌇 المساء: مغيب وراحة`,
          en: `🌅 Morning: Explore ${g.nameEn}\n🌞 Midday: Local experience & lunch\n🌇 Evening: Sunset & rest`,
        });
      }
      setItinerary(out);
      setStage("result");
    }, 1400);
  };

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <AppShell>
      <AppHeader title={t("خطط رحلتك", "Plan Your Trip")} showBack />
      <div className="px-4 pt-4 space-y-5">
        {stage === "pick" && (
          <>
            <section>
              <h3 className="font-display text-lg mb-2">{t("اختر الوجهات", "Select Destinations")}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {governorates.map(g => {
                  const on = selected.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggle(g.id)}
                      className={`card-masaar p-3 text-start relative ${on ? "ring-2 ring-primary" : ""}`}>
                      <img src={g.image} alt="" className="w-full h-16 object-cover rounded-lg mb-2"/>
                      <div className="font-medium text-sm">{t(g.nameAr, g.nameEn)}</div>
                      {on && <span className="absolute top-2 end-2 material-symbols-outlined text-primary">check_circle</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="font-display text-lg mb-2">{t("كم يوم عندك؟", "How many days?")}</h3>
              <div className="card-masaar p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{t("المدة", "Duration")}</span>
                  <span className="font-display text-2xl">{days} {t("يوم", "days")}</span>
                </div>
                <input type="range" min={1} max={14} value={days} onChange={e => setDays(parseInt(e.target.value))}
                  className="w-full accent-primary" />
              </div>
            </section>

            <button onClick={generate} className="btn-primary w-full">
              ✨ {t("ولّد جدولي", "Generate My Itinerary")}
            </button>
          </>
        )}

        {stage === "loading" && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-tertiary animate-pulse" style={{fontSize:64}}>auto_awesome</span>
            <p className="mt-4 text-muted-foreground">{t("الذكاء الاصطناعي يخطط رحلتك…", "AI is planning your trip…")}</p>
          </div>
        )}

        {stage === "result" && (
          <>
            <h3 className="font-display text-xl">{t("جدول رحلتك", "Your Itinerary")}</h3>
            <div className="space-y-3">
              {itinerary.map((d, i) => (
                <div key={i} className="card-masaar p-4">
                  <div className="font-display text-lg mb-2 text-primary">
                    {t(`اليوم ${i+1}`, `Day ${i+1}`)}
                  </div>
                  <pre className="font-sans text-sm whitespace-pre-wrap leading-relaxed">{t(d.ar, d.en)}</pre>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStage("pick")} className="btn-ghost-sand flex-1">{t("تعديل", "Edit")}</button>
              <button className="btn-primary flex-1">{t("حفظ ومشاركة", "Save & Share")}</button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
