import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { tenders } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";

const filters = [
  { id: "all", ar: "الكل", en: "All" },
  { id: "hotel", ar: "فندقي", en: "Hotel" },
  { id: "entertainment", ar: "ترفيه", en: "Entertainment" },
  { id: "medical", ar: "علاجي", en: "Medical" },
];

export default function Tenders() {
  const { t, locale, notifyTenders, toggleNotifyTender, pushNotification } = useApp();
  const [f, setF] = useState("all");
  const list = useMemo(() => f === "all" ? tenders : tenders.filter(x => x.type === f), [f]);

  return (
    <AppShell>
      <AppHeader title={t("العطاءات الحكومية", "Government Tenders")} />
      <div className="px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {filters.map(x => (
            <button key={x.id} onClick={() => setF(x.id)} className={`chip ${f === x.id ? "chip-active" : ""}`}>{t(x.ar, x.en)}</button>
          ))}
        </div>
        <div className="mt-4 space-y-3">
          {list.map(td => {
            const on = notifyTenders.includes(td.id);
            return (
              <div key={td.id} className="card-masaar p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-base flex-1 leading-snug">{locale === "ar" ? td.titleAr : td.titleEn}</h3>
                  <button onClick={() => { toggleNotifyTender(td.id); if (!on) pushNotification({ titleAr:`🔔 تنبيه عطاء: ${td.titleAr}`, titleEn:`🔔 Tender alert: ${td.titleEn}` }); }}
                    className={`material-symbols-outlined text-[22px] ${on ? "text-tertiary" : "text-muted-foreground"}`}
                    style={{ fontVariationSettings: on ? "'FILL' 1" : "'FILL' 0" }}>
                    notifications
                  </button>
                </div>
                <div className="text-xs text-muted-foreground mt-2 space-y-1">
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">account_balance</span>{t(td.authority.ar, td.authority.en)}</div>
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">place</span>{t(td.location.ar, td.location.en)}</div>
                  <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">event</span>{t("الموعد النهائي:", "Deadline:")} {td.deadline}</div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-display text-sm text-secondary">{td.budget}</span>
                  <button className="btn-ghost-sand text-xs py-1.5 px-3">{t("تفاصيل", "Details")} →</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
