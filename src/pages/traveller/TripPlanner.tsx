import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { governorates } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { toast } from "sonner";
import { callGemini } from "@/lib/gemini";

interface DayPlan {
  day: number;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  tip: string;
}

const fallbackDay = (i: number, name: string): DayPlan => ({
  day: i + 1,
  title: `Day ${i + 1} — ${name}`,
  morning: `Explore highlights of ${name}.`,
  afternoon: "Local lunch and a guided experience.",
  evening: "Sunset view and dinner.",
  tip: "Carry water and start early to beat the crowds.",
});

export default function TripPlanner() {
  const { t, locale, travellerProfile, geminiKey } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const [days, setDays] = useState(3);
  const [stage, setStage] = useState<"pick" | "loading" | "result">("pick");
  const [itinerary, setItinerary] = useState<DayPlan[]>([]);

  const generate = async () => {
    setStage("loading");
    const picks = (selected.length ? selected : ["amman", "petra", "wadi_rum"]);
    const placeNames = picks
      .map((id) => governorates.find((g) => g.id === id))
      .filter(Boolean)
      .map((g) => (locale === "ar" ? g!.nameAr : g!.nameEn));
    const interests = travellerProfile.interests?.join(", ") || "general sightseeing";
    const budget = travellerProfile.budget || "mid-range";

    const langInstruction = locale === "ar"
      ? "Respond in Arabic (العربية)."
      : "Respond in English.";

    const userPrompt = `Create a detailed day-by-day Jordan travel itinerary for ${days} days visiting ${placeNames.join(", ")}.
User interests: ${interests}.
Budget: ${budget}.
${langInstruction}
Return ONLY valid JSON, no markdown, no commentary, in this exact shape:
{"days":[{"day":1,"title":"","morning":"","afternoon":"","evening":"","tip":""}]}`;

    try {
      const raw = await callGemini({
        apiKey: geminiKey,
        systemPrompt: "You are Masaar AI, a Jordan tourism expert. Output only strict JSON matching the requested schema. No markdown fences.",
        history: [],
        userMessage: userPrompt,
      });

      // Strip code fences if model added them
      const cleaned = raw.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
      const firstBrace = cleaned.indexOf("{");
      const lastBrace = cleaned.lastIndexOf("}");
      const jsonSlice = firstBrace >= 0 && lastBrace > firstBrace ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned;
      const parsed = JSON.parse(jsonSlice);

      if (Array.isArray(parsed?.days) && parsed.days.length > 0) {
        const safe: DayPlan[] = parsed.days.slice(0, days).map((d: Partial<DayPlan>, i: number) => ({
          day: d.day ?? i + 1,
          title: d.title || `Day ${i + 1}`,
          morning: d.morning || "",
          afternoon: d.afternoon || "",
          evening: d.evening || "",
          tip: d.tip || "",
        }));
        setItinerary(safe);
      } else {
        throw new Error("invalid shape");
      }
    } catch (e) {
      console.error("itinerary parse error", e);
      toast.error(t("تعذّر توليد الجدول، عرض اقتراح أساسي", "Couldn't parse AI plan — showing a basic one"));
      setItinerary(Array.from({ length: days }, (_, i) =>
        fallbackDay(i, placeNames[i % placeNames.length] || "Jordan")
      ));
    }
    setStage("result");
  };

  const toggle = (id: string) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <AppShell>
      <AppHeader title={t("خطط رحلتك", "Plan Your Trip")} showBack />
      <div className="px-6 pt-6 pb-10 space-y-8">
        {stage === "pick" && (
          <>
            <section className="space-y-3">
              <h3 className="font-display text-[18px] text-primary font-semibold">{t("اختر الوجهات", "Select Destinations")}</h3>
              <div className="grid grid-cols-2 gap-4">
                {governorates.map(g => {
                  const on = selected.includes(g.id);
                  return (
                    <button key={g.id} onClick={() => toggle(g.id)}
                      className={`card-clean !p-3 text-start relative ${on ? "ring-2 ring-primary" : ""}`}>
                      <img src={g.image} alt="" className="w-full h-16 object-cover rounded-lg mb-2"/>
                      <div className="font-medium text-[13px] text-primary">{t(g.nameAr, g.nameEn)}</div>
                      {on && <span className="absolute top-2 end-2 material-symbols-outlined text-primary">check_circle</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="font-display text-[18px] text-primary font-semibold">{t("كم يوم عندك؟", "How many days?")}</h3>
              <div className="card-clean">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[13px] text-muted-foreground">{t("المدة", "Duration")}</span>
                  <span className="font-display text-2xl text-primary">{days} {t("يوم", "days")}</span>
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
          <div className="space-y-4 py-8">
            <div className="text-center space-y-3">
              <span className="material-symbols-outlined text-tertiary animate-pulse" style={{fontSize:64}}>auto_awesome</span>
              <p className="text-[13px] text-muted-foreground">
                {t("الذكاء الاصطناعي يخطط رحلتك…", "AI is planning your trip…")}
              </p>
              <span className="loading-dots inline-flex"><span/><span/><span/></span>
            </div>
            <div className="space-y-4">
              {Array.from({ length: Math.min(days, 3) }).map((_, i) => (
                <div key={i} className="card-clean space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-full" />
                  <div className="skeleton h-3 w-5/6" />
                  <div className="skeleton h-3 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        )}

        {stage === "result" && (
          <>
            <h3 className="font-display text-[24px] text-primary font-semibold">{t("جدول رحلتك", "Your Itinerary")}</h3>
            <div className="space-y-4">
              {itinerary.map((d) => (
                <div key={d.day} className="card-clean space-y-3">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-display text-[18px] text-primary font-semibold">
                      {t(`اليوم ${d.day}`, `Day ${d.day}`)}
                    </div>
                    <div className="text-[13px] text-muted-foreground text-end flex-1 truncate">{d.title}</div>
                  </div>
                  {d.morning && (
                    <div className="text-[13px] text-foreground"><span className="text-secondary font-semibold">🌅 {t("الصباح", "Morning")} · </span>{d.morning}</div>
                  )}
                  {d.afternoon && (
                    <div className="text-[13px] text-foreground"><span className="text-secondary font-semibold">🌞 {t("الظهيرة", "Afternoon")} · </span>{d.afternoon}</div>
                  )}
                  {d.evening && (
                    <div className="text-[13px] text-foreground"><span className="text-secondary font-semibold">🌇 {t("المساء", "Evening")} · </span>{d.evening}</div>
                  )}
                  {d.tip && (
                    <div className="mt-2 text-[12px] text-primary bg-[hsl(var(--surface-cream))] rounded-lg p-2.5">
                      💡 {d.tip}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStage("pick")} className="btn-ghost-sand flex-1">{t("تعديل", "Edit")}</button>
              <button
                onClick={() => {
                  localStorage.setItem("masaar_itinerary", JSON.stringify(itinerary));
                  toast.success(t("تم حفظ الجدول!", "Itinerary saved!"));
                }}
                className="btn-ghost-sand flex-1"
              >
                💾 {t("حفظ", "Save")}
              </button>
              <button
                onClick={async () => {
                  const text = itinerary
                    .map((d) => `${t(`اليوم ${d.day}`, `Day ${d.day}`)}: ${d.title}\n🌅 ${d.morning}\n🌞 ${d.afternoon}\n🌇 ${d.evening}`)
                    .join("\n\n");
                  const shareData = {
                    title: t("جدول رحلتي — مسار", "My Jordan Itinerary — Masaar"),
                    text,
                    url: window.location.href,
                  };
                  try {
                    if (navigator.share) {
                      await navigator.share(shareData);
                    } else {
                      await navigator.clipboard.writeText(`${text}\n\n${window.location.href}`);
                      toast.success(t("تم النسخ إلى الحافظة!", "Copied to clipboard!"));
                    }
                  } catch { /* cancelled */ }
                }}
                className="btn-primary flex-1"
              >
                {t("مشاركة", "Share")} ↗
              </button>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
