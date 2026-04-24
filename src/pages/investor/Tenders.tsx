import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { tenders } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useNavigate } from "react-router-dom";

const TYPE_FILTERS = [
  { id: "all",           ar: "الكل",    en: "All"           },
  { id: "hotel",         ar: "فندقي",   en: "Hotel"         },
  { id: "entertainment", ar: "ترفيه",   en: "Entertainment" },
  { id: "medical",       ar: "علاجي",   en: "Medical"       },
];

function typeColor(type: string) {
  if (type === "hotel")         return { bg: "hsl(211 100% 52% / 0.15)", color: "hsl(211 100% 62%)" };
  if (type === "medical")       return { bg: "hsl(141 63% 50% / 0.15)",  color: "hsl(141 63% 50%)"  };
  if (type === "entertainment") return { bg: "hsl(37 100% 52% / 0.15)",  color: "hsl(37 100% 52%)"  };
  return { bg: "hsl(240 2% 30%)", color: "hsl(0 0% 62%)" };
}

function typeLabel(type: string, t: (ar: string, en: string) => string) {
  if (type === "hotel")         return t("فندقي", "Hotel");
  if (type === "medical")       return t("علاجي", "Medical");
  if (type === "entertainment") return t("ترفيه", "Entertainment");
  return type;
}

export default function Tenders() {
  const { t, locale, notifyTenders, toggleNotifyTender, pushNotification } = useApp();
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState<"browse" | "submissions">("browse");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => filter === "all" ? tenders : tenders.filter(x => x.type === filter),
    [filter]
  );

  const submissions = useMemo(() => {
    const results: { tenderId: string; status: string; company: string; submittedAt: string }[] = [];
    tenders.forEach(td => {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i) || "";
        if (key.startsWith(`masaar_submission_${td.id}_`)) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || "{}");
            results.push({ tenderId: td.id, status: data.status || "draft", company: data.form?.companyName || "—", submittedAt: data.submittedAt || "" });
          } catch { /* skip */ }
        }
      }
    });
    return results;
  }, []);

  return (
    <AppShell>
      <AppHeader title={t("العطاءات الحكومية", "Government Tenders")} />
      <div className="px-4 pt-4">

        {/* Tabs */}
        <div className="flex gap-1.5 mb-4">
          {[
            { id: "browse" as const,      ar: "تصفح العطاءات",   en: "Browse Tenders"   },
            { id: "submissions" as const, ar: "طلباتي",           en: "My Submissions"   },
          ].map(tb => (
            <button key={tb.id} onClick={() => setActiveTab(tb.id)}
              className="flex-1 py-2 rounded-full text-sm font-medium transition-colors"
              style={{
                background: activeTab === tb.id ? "hsl(211 100% 52%)" : "hsl(240 2% 24%)",
                color: activeTab === tb.id ? "#fff" : "hsl(0 0% 55%)",
              }}>
              {t(tb.ar, tb.en)}
              {tb.id === "submissions" && submissions.length > 0 && (
                <span className="ms-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>
                  {submissions.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Browse Tab */}
        {activeTab === "browse" && (
          <div className="animate-fade-in">
            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 mb-4">
              {TYPE_FILTERS.map(x => (
                <button key={x.id} onClick={() => setFilter(x.id)} className={`chip ${filter === x.id ? "chip-active" : ""}`}>
                  {t(x.ar, x.en)}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📋</div>
                <p className="font-display text-lg">{t("لا توجد عطاءات في هذا التصنيف", "No tenders in this category")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(td => {
                  const on = notifyTenders.includes(td.id);
                  const { bg, color } = typeColor(td.type);
                  return (
                    <button key={td.id} onClick={() => nav(`/investor/tenders/${td.id}`)}
                      className="w-full text-start card-masaar block hover:border-[hsl(211_100%_52%/0.3)] transition-colors">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="font-display text-base flex-1 leading-snug">
                          {locale === "ar" ? td.titleAr : td.titleEn}
                        </h3>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: bg, color }}>
                          {typeLabel(td.type, t)}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="material-symbols-outlined text-[14px]">account_balance</span>
                          {t(td.authority.ar, td.authority.en)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="material-symbols-outlined text-[14px]">place</span>
                          {t(td.location.ar, td.location.en)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="material-symbols-outlined text-[14px]">event</span>
                          {t("الموعد النهائي:", "Deadline:")} {td.deadline}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-semibold text-sm" style={{ color: "hsl(211 100% 62%)" }}>{td.budget}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              toggleNotifyTender(td.id);
                              if (!on) pushNotification({ titleAr: `🔔 تنبيه عطاء: ${td.titleAr}`, titleEn: `🔔 Tender alert: ${td.titleEn}` });
                            }}
                            className="material-symbols-outlined"
                            style={{ fontSize: 20, color: on ? "hsl(37 100% 52%)" : "hsl(0 0% 42%)", fontVariationSettings: on ? "'FILL' 1" : "'FILL' 0" }}
                          >notifications</button>
                          <span className="text-xs font-medium" style={{ color: "hsl(211 100% 62%)" }}>
                            {t("عرض التفاصيل", "View Details")} →
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="animate-fade-in">
            {submissions.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">📝</div>
                <p className="font-display text-lg">{t("لم تقدّم أي طلبات بعد", "No submissions yet")}</p>
                <p className="text-sm text-muted-foreground">{t("تصفّح العطاءات وقدّم طلبك الأول", "Browse tenders and start your first application")}</p>
                <button onClick={() => setActiveTab("browse")} className="btn-primary mt-2" style={{ width: "auto", padding: "0 24px" }}>
                  {t("تصفح العطاءات", "Browse Tenders")}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((s, i) => {
                  const td = tenders.find(x => x.id === s.tenderId);
                  if (!td) return null;
                  const isDraft = s.status === "draft";
                  return (
                    <div key={i} className="card-masaar">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-display text-sm leading-snug">{locale === "ar" ? td.titleAr : td.titleEn}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{s.company}</p>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{
                            background: isDraft ? "hsl(37 100% 52% / 0.15)" : "hsl(141 63% 50% / 0.15)",
                            color:      isDraft ? "hsl(37 100% 52%)"         : "hsl(141 63% 50%)",
                          }}>
                          {isDraft ? t("مسودة", "Draft") : t("مقدّم", "Submitted")}
                        </span>
                      </div>
                      {s.submittedAt && (
                        <p className="text-[11px] text-muted-foreground mt-2">{s.submittedAt.slice(0, 10)}</p>
                      )}
                      <button
                        onClick={() => nav(`/investor/tenders/submit/${td.id}`)}
                        className="mt-3 text-xs font-semibold"
                        style={{ color: "hsl(211 100% 62%)" }}
                      >
                        {isDraft ? t("متابعة التعديل →", "Continue editing →") : t("عرض الطلب →", "View application →")}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="h-4" />
      </div>
    </AppShell>
  );
}
