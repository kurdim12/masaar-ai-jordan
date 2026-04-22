import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { callGemini } from "@/lib/gemini";

const roomTypes = [
  { id: "single", ar: "غرفة مفردة", en: "Single" },
  { id: "double", ar: "غرفة مزدوجة", en: "Double" },
  { id: "suite", ar: "جناح", en: "Suite" },
  { id: "tent", ar: "خيمة", en: "Tent" },
];
const durations = ["6h","12h","24h","48h"];

export default function FlashOffer() {
  const { t, businessProfile, addOffer, geminiKey, pushNotification } = useApp();
  const nav = useNavigate();
  const [room, setRoom] = useState("double");
  const [rooms, setRooms] = useState(2);
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [orig, setOrig] = useState(120);
  const [price, setPrice] = useState(80);
  const [duration, setDuration] = useState("24h");
  const [descAr, setDescAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [loading, setLoading] = useState(false);

  const aiWrite = async () => {
    setLoading(true);
    const reply = await callGemini({
      apiKey: geminiKey,
      systemPrompt: "You write bilingual (Arabic + English) flash offer copy. Format strictly:\nAR: <arabic>\nEN: <english>\nKeep each under 80 words, mention the location's appeal, create urgency.",
      history: [],
      userMessage: `Business: ${businessProfile.name || "Hotel"} in ${businessProfile.location || "Jordan"}. Offer: ${rooms} ${room} room(s) at ${price} JD (was ${orig} JD). Duration: ${duration}.`,
    });
    const ar = reply.match(/AR:\s*([\s\S]*?)(?:EN:|$)/)?.[1]?.trim() || "ليلة لا تُنسى بسعر استثنائي — احجز الآن قبل نفاد الغرف.";
    const en = reply.match(/EN:\s*([\s\S]*)/)?.[1]?.trim() || "An unforgettable night at an exceptional price — book now before rooms sell out.";
    setDescAr(ar); setDescEn(en);
    setLoading(false);
  };

  const publish = () => {
    const id = crypto.randomUUID();
    addOffer({
      id, businessName: businessProfile.name || "My Business",
      governorateId: businessProfile.location || "amman",
      roomType: room, rooms, originalPrice: orig, offerPrice: price,
      duration, date, descAr, descEn, views: 0, createdAt: Date.now(),
    });
    pushNotification({ titleAr: `✅ تم نشر عرضك: ${rooms} ${room}`, titleEn: `✅ Offer published: ${rooms} ${room}` });
    nav("/business/dashboard");
  };

  return (
    <AppShell>
      <AppHeader title={t("نزّل عرضاً", "Create Offer")} showBack />
      <div className="px-4 pt-4 space-y-4">
        <div className="card-masaar p-4 space-y-3">
          <div>
            <label className="text-sm font-medium block mb-2">{t("نوع الغرفة","Room type")}</label>
            <div className="flex flex-wrap gap-2">
              {roomTypes.map(r => (
                <button key={r.id} onClick={() => setRoom(r.id)} className={`chip ${room === r.id ? "chip-active" : ""}`}>{t(r.ar, r.en)}</button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-xs block mb-1">{t("غرف","Rooms")}</label><input type="number" value={rooms} onChange={e=>setRooms(+e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none"/></div>
            <div><label className="text-xs block mb-1">{t("التاريخ","Date")}</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none"/></div>
            <div><label className="text-xs block mb-1">{t("السعر الأصلي","Original")}</label><input type="number" value={orig} onChange={e=>setOrig(+e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none"/></div>
            <div><label className="text-xs block mb-1">{t("سعر العرض","Offer")}</label><input type="number" value={price} onChange={e=>setPrice(+e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none"/></div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">{t("المدة","Duration")}</label>
            <div className="flex gap-2">
              {durations.map(d => <button key={d} onClick={()=>setDuration(d)} className={`chip flex-1 justify-center ${duration===d?"chip-active":""}`}>{d}</button>)}
            </div>
          </div>
        </div>

        <button onClick={aiWrite} disabled={loading} className="btn-ghost-sand w-full disabled:opacity-50">
          {loading ? t("جاري الكتابة…","Writing…") : `✨ ${t("اكتب الوصف بالذكاء الاصطناعي","AI Write Description")}`}
        </button>

        {(descAr || descEn) && (
          <div className="card-masaar p-4 animate-fade-in">
            <div className="text-xs text-secondary mb-1 font-semibold">{t("معاينة","Preview")}</div>
            <div className="font-display text-lg">{businessProfile.name || "My Business"}</div>
            <p className="text-sm leading-snug mt-1" dir="rtl">{descAr}</p>
            <p className="text-sm leading-snug mt-1">{descEn}</p>
            <div className="flex items-end justify-between mt-3">
              <div><span className="font-display text-2xl text-secondary">{price}</span> <span className="text-xs line-through text-muted-foreground">{orig}</span> <span className="text-xs">JD</span></div>
              <span className="chip text-[10px]">⏱ {duration}</span>
            </div>
          </div>
        )}

        <button onClick={publish} className="btn-primary w-full">{t("نشر العرض","Publish Offer")}</button>
      </div>
    </AppShell>
  );
}
