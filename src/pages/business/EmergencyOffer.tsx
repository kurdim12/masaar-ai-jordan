import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useState } from "react";

export default function EmergencyOffer() {
  const { t, businessProfile, addOffer, pushNotification } = useApp();
  const nav = useNavigate();
  const usual = businessProfile.maxPrice || 100;
  const [room, setRoom] = useState("double");
  const [price, setPrice] = useState(Math.round(usual * 0.8));

  const publish = () => {
    addOffer({
      id: crypto.randomUUID(),
      businessName: businessProfile.name || "My Business",
      governorateId: businessProfile.location || "amman",
      roomType: room, rooms: 1, originalPrice: usual, offerPrice: price,
      duration: "24h", date: new Date().toISOString().slice(0,10),
      descAr: "🔴 عرض طارئ — غرفة الليلة فقط بسعر مخفّض!",
      descEn: "🔴 Emergency offer — tonight only at a discounted rate!",
      emergency: true, views: 0, createdAt: Date.now(),
    });
    pushNotification({ titleAr: "🔴 عرض طارئ نُشر!", titleEn: "🔴 Emergency offer published!" });
    nav("/business/dashboard");
  };

  return (
    <AppShell>
      <AppHeader title={t("عرض طارئ", "Emergency Offer")} showBack />
      <div className="px-4 pt-4 space-y-4">
        <div className="rounded-2xl p-4 text-white" style={{ background: "hsl(var(--destructive))" }}>
          <div className="text-xs uppercase tracking-widest text-white/80">{t("غرفة كُنسلت","Cancellation")}</div>
          <h2 className="font-display text-2xl mt-1">{t("أنشئ عرضاً طارئاً", "Create Emergency Offer")}</h2>
          <p className="text-white/80 text-sm mt-1">{t("سيظهر فوراً للسياح القريبين","Visible to nearby travellers immediately")}</p>
        </div>
        <div className="card-masaar p-4 space-y-3">
          <div>
            <label className="text-sm block mb-1">{t("الغرفة","Room")}</label>
            <select value={room} onChange={e=>setRoom(e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none">
              <option value="single">{t("مفردة","Single")}</option>
              <option value="double">{t("مزدوجة","Double")}</option>
              <option value="suite">{t("جناح","Suite")}</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1">{t("السعر المقترح (-20%)","Suggested price (-20%)")}</label>
            <input type="number" value={price} onChange={e=>setPrice(+e.target.value)} className="w-full bg-muted rounded-lg px-3 py-2 outline-none"/>
          </div>
        </div>
        <button onClick={publish} className="w-full rounded-lg py-4 font-bold text-white text-lg shadow-elevated" style={{ background: "hsl(var(--destructive))" }}>
          {t("نشر فوراً","Publish Now")}
        </button>
      </div>
    </AppShell>
  );
}
