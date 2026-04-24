import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { tenders } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { callGemini } from "@/lib/gemini";
import { toast } from "sonner";

const STEPS = 5;

interface FormData {
  companyName: string;
  regNumber: string;
  companyType: string;
  yearsOp: string;
  contactName: string;
  contactPhone: string;
  proposal: string;
  budget: string;
  phases: string;
  completionDate: string;
  expectedRoi: string;
  doc1: boolean;
  doc2: boolean;
  doc3: boolean;
  doc4: boolean;
}

const EMPTY: FormData = {
  companyName: "", regNumber: "", companyType: "LLC", yearsOp: "3-5",
  contactName: "", contactPhone: "", proposal: "", budget: "",
  phases: "", completionDate: "", expectedRoi: "",
  doc1: false, doc2: false, doc3: false, doc4: false,
};

export default function TenderSubmission() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { t, locale, geminiKey } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(EMPTY);
  const [drafting, setDrafting] = useState(false);

  const tender = tenders.find(x => x.id === id);
  if (!tender) {
    return (
      <AppShell>
        <AppHeader showBack title={t("خطأ", "Not Found")} />
        <div className="px-4 pt-8 text-center text-muted-foreground">{t("العطاء غير موجود", "Tender not found")}</div>
      </AppShell>
    );
  }

  const tenderTitle = locale === "ar" ? tender.titleAr : tender.titleEn;

  const set = (key: keyof FormData, val: string | boolean) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const canContinue = () => {
    if (step === 0) return form.companyName.trim().length > 1;
    if (step === 1) return form.proposal.trim().length >= 50;
    if (step === 2) return form.budget.trim().length > 0;
    if (step === 3) return form.doc1 && form.doc2 && form.doc3 && form.doc4;
    return true;
  };

  const draftWithAI = async () => {
    setDrafting(true);
    try {
      const langNote = locale === "ar" ? "Respond ONLY in Arabic (العربية)." : "Respond ONLY in English.";
      const draft = await callGemini({
        apiKey: geminiKey,
        systemPrompt: `You are a Jordan tourism investment expert helping draft tender proposals. Write professional, specific, concise proposals. ${langNote}`,
        history: [],
        userMessage: `Draft a professional 250-word project proposal for this tender: "${tenderTitle}". Company: ${form.companyName || "our company"}. Location: ${locale === "ar" ? tender.location.ar : tender.location.en}. Make it convincing, mention Jordan tourism growth, and be specific about the concept. No headers, plain paragraphs only.`,
      });
      set("proposal", draft);
    } catch {
      toast.error(t("تعذّر توليد المقترح", "Could not draft proposal"));
    } finally {
      setDrafting(false);
    }
  };

  const submit = (draft: boolean) => {
    const key = `masaar_submission_${tender.id}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify({ tender: tender.id, form, status: draft ? "draft" : "submitted", submittedAt: new Date().toISOString() }));
    toast.success(draft ? t("تم حفظ المسودة", "Draft saved") : t("تم تقديم الطلب بنجاح ✓", "Application submitted ✓"));
    nav("/investor/tenders");
  };

  const inputCls = "w-full bg-transparent border border-[hsl(240_2%_23%)] rounded-xl px-4 py-3 text-sm outline-none focus:border-[hsl(211_100%_52%)] transition-colors";
  const labelCls = "block text-sm font-medium mb-1.5 text-foreground";

  return (
    <AppShell>
      <AppHeader showBack title={t("تقديم الطلب", "Apply")} />
      <div className="px-4 pt-4 pb-10">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">{t(`الخطوة ${step + 1} من ${STEPS}`, `Step ${step + 1} of ${STEPS}`)}</span>
            <span className="text-xs font-medium" style={{ color: "hsl(211 100% 52%)" }}>{Math.round(((step + 1) / STEPS) * 100)}%</span>
          </div>
          <div className="h-1 bg-[hsl(240_2%_24%)] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${((step + 1) / STEPS) * 100}%`, background: "hsl(211 100% 52%)" }} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 truncate">{tenderTitle}</p>
        </div>

        <div className="space-y-4 animate-fade-in" key={step}>

          {/* Step 0: Company Info */}
          {step === 0 && (
            <>
              <h2 className="font-display text-2xl">{t("معلومات الشركة", "Company Info")}</h2>
              <div>
                <label className={labelCls}>{t("اسم الشركة *", "Company Name *")}</label>
                <input className={inputCls} value={form.companyName} onChange={e => set("companyName", e.target.value)} placeholder={t("شركة مسار للسياحة", "Masaar Tourism LLC")} />
              </div>
              <div>
                <label className={labelCls}>{t("رقم التسجيل", "Registration Number")}</label>
                <input className={inputCls} value={form.regNumber} onChange={e => set("regNumber", e.target.value)} placeholder="JO-2024-XXXXX" />
              </div>
              <div>
                <label className={labelCls}>{t("نوع الشركة", "Company Type")}</label>
                <select className={inputCls + " bg-[hsl(240_2%_18%)]"} value={form.companyType} onChange={e => set("companyType", e.target.value)}>
                  <option value="LLC">LLC — {t("شركة ذات مسؤولية محدودة", "Limited Liability")}</option>
                  <option value="JSC">JSC — {t("شركة مساهمة عامة", "Joint Stock Company")}</option>
                  <option value="Partnership">{t("شراكة", "Partnership")}</option>
                  <option value="Individual">{t("فردي", "Individual / Sole Proprietor")}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("سنوات الخبرة", "Years in Operation")}</label>
                <select className={inputCls + " bg-[hsl(240_2%_18%)]"} value={form.yearsOp} onChange={e => set("yearsOp", e.target.value)}>
                  {["<1","1-3","3-5","5-10","10+"].map(y => <option key={y} value={y}>{y} {t("سنوات", "years")}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>{t("اسم جهة التواصل", "Contact Person")}</label>
                <input className={inputCls} value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder={t("خالد المحاميد", "Khalid Al-Muhamed")} />
              </div>
              <div>
                <label className={labelCls}>{t("رقم الهاتف", "Phone Number")}</label>
                <input className={inputCls} type="tel" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} placeholder="+962 7X XXX XXXX" />
              </div>
            </>
          )}

          {/* Step 1: Proposal */}
          {step === 1 && (
            <>
              <h2 className="font-display text-2xl">{t("المقترح التنفيذي", "Project Proposal")}</h2>
              <p className="text-sm text-muted-foreground">{t("صف رؤيتك للمشروع (50 حرف على الأقل)", "Describe your project vision (min 50 chars)")}</p>
              <textarea
                className={inputCls + " min-h-[180px] resize-none"}
                value={form.proposal}
                onChange={e => set("proposal", e.target.value)}
                placeholder={t("اكتب مقترحك هنا…", "Write your proposal here…")}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{form.proposal.length} {t("حرف", "chars")}</span>
                <button
                  onClick={draftWithAI}
                  disabled={drafting}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold disabled:opacity-50"
                  style={{ background: "hsl(211 100% 52% / 0.15)", color: "hsl(211 100% 62%)", border: "0.5px solid hsl(211 100% 52% / 0.3)" }}
                >
                  {drafting ? (
                    <span className="loading-dots inline-flex"><span/><span/><span/></span>
                  ) : (
                    <><span className="material-symbols-outlined text-[16px]">auto_awesome</span>{t("كتابة بالذكاء الاصطناعي", "Draft with AI")}</>
                  )}
                </button>
              </div>
            </>
          )}

          {/* Step 2: Budget & Timeline */}
          {step === 2 && (
            <>
              <h2 className="font-display text-2xl">{t("الميزانية والجدول الزمني", "Budget & Timeline")}</h2>
              <div>
                <label className={labelCls}>{t("الميزانية المقترحة (د.أ) *", "Proposed Budget (JD) *")}</label>
                <input className={inputCls} type="number" value={form.budget} onChange={e => set("budget", e.target.value)} placeholder="500000" />
                <p className="text-xs text-muted-foreground mt-1">{t("النطاق المطلوب:", "Required range:")} {tender.budget}</p>
              </div>
              <div>
                <label className={labelCls}>{t("مراحل المشروع", "Project Phases")}</label>
                <textarea
                  className={inputCls + " min-h-[100px] resize-none"}
                  value={form.phases}
                  onChange={e => set("phases", e.target.value)}
                  placeholder={t("المرحلة 1: التصميم والترخيص (3 أشهر)\nالمرحلة 2: البناء (18 شهراً)\nالمرحلة 3: الافتتاح", "Phase 1: Design & Licensing (3 mo)\nPhase 2: Construction (18 mo)\nPhase 3: Launch")}
                />
              </div>
              <div>
                <label className={labelCls}>{t("تاريخ الاكتمال المتوقع", "Projected Completion")}</label>
                <input className={inputCls} type="date" value={form.completionDate} onChange={e => set("completionDate", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>{t("العائد المتوقع على الاستثمار (%)", "Expected ROI (%)")}</label>
                <input className={inputCls} type="number" value={form.expectedRoi} onChange={e => set("expectedRoi", e.target.value)} placeholder="18" />
              </div>
            </>
          )}

          {/* Step 3: Documents */}
          {step === 3 && (
            <>
              <h2 className="font-display text-2xl">{t("قائمة الوثائق", "Documents Checklist")}</h2>
              <p className="text-sm text-muted-foreground">{t("حدّد الوثائق التي أعددتها للتقديم", "Mark the documents you have ready to submit")}</p>
              <div className="space-y-3">
                {[
                  { key: "doc1" as const, ar: "السجل التجاري / شهادة التسجيل", en: "Trade License / Commercial Registration" },
                  { key: "doc2" as const, ar: "القوائم المالية المدققة (آخر سنتين)", en: "Audited Financial Statements (last 2 years)" },
                  { key: "doc3" as const, ar: "المقترح الفني والرسومات التصميمية", en: "Technical Proposal & Design Drawings" },
                  { key: "doc4" as const, ar: "ملف الشركة وسجل المشاريع", en: "Company Profile & Portfolio" },
                ].map((doc, i) => {
                  const checked = form[doc.key];
                  return (
                    <button
                      key={doc.key}
                      onClick={() => set(doc.key, !checked)}
                      className="w-full card-masaar flex items-center gap-3 text-start"
                    >
                      <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
                        style={{ background: checked ? "hsl(141 63% 50%)" : "hsl(240 2% 24%)", border: checked ? "none" : "1.5px solid hsl(240 2% 40%)" }}>
                        {checked && <span className="material-symbols-outlined text-black text-[14px]">check</span>}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{t(doc.ar, doc.en)}</div>
                        {!checked && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded mt-0.5 inline-block"
                            style={{ background: "hsl(37 100% 52% / 0.15)", color: "hsl(37 100% 52%)" }}>
                            {t("مطلوب", "Required")}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-sm">{i + 1}/4</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">{t("في النسخة الرسمية، ستتمكن من رفع الملفات مباشرةً", "In the live version, you'll upload files directly")}</p>
            </>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <>
              <h2 className="font-display text-2xl">{t("مراجعة وتقديم", "Review & Submit")}</h2>
              <div className="space-y-3">
                <div className="card-masaar">
                  <p className="text-xs text-muted-foreground mb-1">{t("الشركة", "Company")}</p>
                  <p className="font-semibold">{form.companyName || "—"}</p>
                  <p className="text-sm text-muted-foreground">{form.companyType} · {form.yearsOp} {t("سنوات خبرة", "yrs exp")}</p>
                </div>
                <div className="card-masaar">
                  <p className="text-xs text-muted-foreground mb-1">{t("المقترح", "Proposal")}</p>
                  <p className="text-sm leading-relaxed line-clamp-4">{form.proposal || "—"}</p>
                </div>
                <div className="card-masaar">
                  <p className="text-xs text-muted-foreground mb-1">{t("الميزانية والجدول", "Budget & Timeline")}</p>
                  <p className="font-semibold">{form.budget ? `${Number(form.budget).toLocaleString()} JD` : "—"}</p>
                  {form.completionDate && <p className="text-sm text-muted-foreground">{t("اكتمال:", "Completion:")} {form.completionDate}</p>}
                  {form.expectedRoi && <p className="text-sm text-muted-foreground">ROI: {form.expectedRoi}%</p>}
                </div>
                <div className="card-masaar">
                  <p className="text-xs text-muted-foreground mb-2">{t("الوثائق", "Documents")}</p>
                  <div className="flex items-center gap-2">
                    {[form.doc1, form.doc2, form.doc3, form.doc4].map((d, i) => (
                      <span key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: d ? "hsl(141 63% 50%)" : "hsl(240 2% 30%)", color: d ? "#000" : "#666" }}>
                        {i + 1}
                      </span>
                    ))}
                    <span className="text-sm text-muted-foreground">{[form.doc1,form.doc2,form.doc3,form.doc4].filter(Boolean).length}/4 {t("جاهزة", "ready")}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => submit(true)} className="btn-ghost-sand flex-1 text-sm">{t("حفظ كمسودة", "Save Draft")}</button>
                <button onClick={() => submit(false)} className="btn-primary flex-1 text-sm">{t("تقديم الطلب", "Submit")}</button>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-3">{t("سيتم مراجعة طلبك خلال 5–10 أيام عمل", "Your application will be reviewed within 5–10 business days")}</p>
              <div className="h-4" />
            </>
          )}
        </div>

        {step < 4 && (
          <div className="fixed bottom-20 inset-x-4 max-w-md mx-auto">
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canContinue()}
              className="btn-primary"
            >
              {step === 3 ? t("مراجعة الطلب", "Review Application") : t("التالي", "Continue")}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
