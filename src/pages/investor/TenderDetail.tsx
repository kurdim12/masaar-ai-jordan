import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { tenders } from "@/data/jordan";
import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { callGemini } from "@/lib/gemini";
import { toast } from "sonner";

// ── Requirements per tender type ──────────────────────────────────────────────
const REQUIREMENTS: Record<string, string[]> = {
  hotel: [
    "Company registration min 3 years",
    "Minimum capital 200K JD",
    "Previous hospitality project proof",
    "Environmental impact assessment",
    "Architectural design approved by municipality",
  ],
  medical: [
    "Medical facility license",
    "Minimum capital 500K JD",
    "Healthcare professional team letters",
    "Environmental & health compliance",
    "Ministry of Health pre-approval",
  ],
  entertainment: [
    "Entertainment sector license",
    "Minimum capital 1M JD",
    "3 completed entertainment projects",
    "Safety & crowd management plan",
    "Jordan Tourism Board endorsement",
  ],
};

// ── Type badge colour ─────────────────────────────────────────────────────────
const TYPE_STYLES: Record<string, { bg: string; text: string; label: { ar: string; en: string } }> = {
  hotel:         { bg: "rgba(74,144,217,0.15)",  text: "#4A90D9", label: { ar: "فندقي",  en: "Hotel"         } },
  medical:       { bg: "rgba(45,158,127,0.15)",  text: "#2D9E7F", label: { ar: "علاجي",  en: "Medical"       } },
  entertainment: { bg: "rgba(238,192,88,0.15)",  text: "#C89A30", label: { ar: "ترفيهي", en: "Entertainment" } },
};

interface EligibilityResult {
  score: number;
  gaps: string[];
}

export default function TenderDetail() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const { t, locale, investorProfile, geminiKey } = useApp();

  const tender = tenders.find((x) => x.id === id);

  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  if (!tender) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-6 text-center">
          <span className="material-symbols-outlined text-muted-foreground" style={{ fontSize: 48 }}>search_off</span>
          <p className="font-display text-lg">{t("لم يُعثر على العطاء", "Tender not found")}</p>
          <button onClick={() => nav(-1)} className="btn-ghost-sand mt-2" style={{ width: "auto", padding: "0 24px" }}>
            {t("العودة", "Go back")}
          </button>
        </div>
      </AppShell>
    );
  }

  const title = locale === "ar" ? tender.titleAr : tender.titleEn;
  const requirements = REQUIREMENTS[tender.type] ?? [];
  const typeStyle = TYPE_STYLES[tender.type] ?? TYPE_STYLES.hotel;

  // ── AI Eligibility Check ───────────────────────────────────────────────────
  const runEligibilityCheck = async () => {
    setChecking(true);
    setResult(null);

    const systemPrompt =
      "You are an expert Jordan investment eligibility advisor. " +
      "Assess investor profiles against government tender requirements. " +
      "Respond ONLY with valid JSON in the exact format: {\"score\": <0-100>, \"gaps\": [\"gap1\", \"gap2\"]}. " +
      "No markdown, no explanation, just the JSON object.";

    const profileText = JSON.stringify(investorProfile || {});
    const requirementsText = requirements.join("; ");
    const userMessage =
      `Assess my eligibility for this tender: ${requirementsText}. ` +
      `My investor profile: ${profileText}. ` +
      `Return ONLY valid JSON: {"score": 75, "gaps": ["gap1", "gap2"]}`;

    try {
      const raw = await callGemini({
        apiKey: geminiKey,
        systemPrompt,
        history: [],
        userMessage,
      });

      // Extract JSON — handle possible markdown code fences
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("No JSON found in response");

      const parsed = JSON.parse(jsonMatch[0]) as EligibilityResult;

      if (typeof parsed.score !== "number" || !Array.isArray(parsed.gaps)) {
        throw new Error("Invalid JSON shape");
      }

      setResult({ score: Math.max(0, Math.min(100, Math.round(parsed.score))), gaps: parsed.gaps });
    } catch (err) {
      console.error("Eligibility check error:", err);
      // Graceful fallback: demo result
      setResult({
        score: 62,
        gaps: [
          t("مستندات التسجيل التجاري غير مكتملة", "Commercial registration documents incomplete"),
          t("مشروع فندقي سابق موثق مطلوب", "Documented prior hospitality project required"),
          t("تقرير التأثير البيئي مفقود", "Environmental impact report missing"),
        ],
      });
      toast.error(t("تعذّر الاتصال بالذكاء الاصطناعي — جارٍ عرض نتيجة تجريبية", "AI connection failed — showing demo result"));
    } finally {
      setChecking(false);
    }
  };

  // ── Score colour ──────────────────────────────────────────────────────────
  const scoreColor = (s: number) =>
    s >= 70 ? "#2D9E7F" : s >= 50 ? "#EEC058" : "#C17B5C";

  // ── Info grid items ───────────────────────────────────────────────────────
  const infoItems = [
    { icon: "account_balance", label: t("الجهة المُصدِرة", "Authority"),  value: t(tender.authority.ar, tender.authority.en) },
    { icon: "place",           label: t("الموقع", "Location"),            value: t(tender.location.ar, tender.location.en) },
    { icon: "event",           label: t("الموعد النهائي", "Deadline"),    value: tender.deadline },
    { icon: "payments",        label: t("الميزانية", "Budget"),           value: tender.budget },
  ];

  return (
    <AppShell>
      <AppHeader title={title} showBack />

      <div className="px-4 pt-4 pb-8 space-y-5">

        {/* ── Info grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-2.5">
          {infoItems.map((item) => (
            <div key={item.icon} className="card-masaar p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-secondary" style={{ fontSize: 16 }}>
                  {item.icon}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {item.label}
                </span>
              </div>
              <p className="text-sm font-medium leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {/* ── Budget + Type badges ─────────────────────────────────────── */}
        <div className="card-masaar p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              {t("الميزانية المتاحة", "Available Budget")}
            </p>
            <p className="font-display text-2xl text-secondary">{tender.budget}</p>
          </div>
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{ background: typeStyle.bg, color: typeStyle.text }}
          >
            {t(typeStyle.label.ar, typeStyle.label.en)}
          </span>
        </div>

        {/* ── Requirements ─────────────────────────────────────────────── */}
        <div className="card-masaar p-4">
          <h2 className="font-display text-base mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 20 }}>checklist</span>
            {t("متطلبات الأهلية", "Eligibility Requirements")}
          </h2>
          <ol className="space-y-2.5">
            {requirements.map((req, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm leading-snug">
                <span
                  className="mt-0.5 w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold"
                  style={{ background: "hsl(var(--n3))", color: "hsl(var(--tertiary))" }}
                >
                  {idx + 1}
                </span>
                <span className="text-foreground/90">{req}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* ── AI Eligibility Check button ──────────────────────────────── */}
        <button
          onClick={runEligibilityCheck}
          disabled={checking}
          className="btn-primary flex items-center justify-center gap-2"
        >
          {checking ? (
            <>
              <span className="loading-dots">
                <span /><span /><span />
              </span>
              <span>{t("جارٍ التحليل...", "Analysing...")}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>auto_awesome</span>
              {t("فحص الأهلية بالذكاء الاصطناعي", "AI Eligibility Check")}
            </>
          )}
        </button>

        {/* ── AI Result card ────────────────────────────────────────────── */}
        {result && (
          <div className="card-masaar p-5 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-tertiary" style={{ fontSize: 20 }}>
                auto_awesome
              </span>
              <h3 className="font-display text-base">
                {t("نتيجة تقييم الأهلية", "Eligibility Assessment")}
              </h3>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: `3px solid ${scoreColor(result.score)}`, background: `${scoreColor(result.score)}18` }}
              >
                <span
                  className="font-display text-3xl font-bold"
                  style={{ color: scoreColor(result.score) }}
                >
                  {result.score}
                </span>
              </div>
              <div>
                <p
                  className="font-display text-lg font-semibold"
                  style={{ color: scoreColor(result.score) }}
                >
                  {result.score >= 70
                    ? t("مؤهّل للتقديم", "Eligible to Apply")
                    : result.score >= 50
                    ? t("مؤهّل جزئياً", "Partially Eligible")
                    : t("يحتاج تطوير الملف", "Profile Needs Work")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t("درجة الأهلية من 100", "Eligibility score out of 100")}
                </p>
              </div>
            </div>

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {t("الفجوات المُحدَّدة", "Identified Gaps")}
                </p>
                <ul className="space-y-1.5">
                  {result.gaps.map((gap, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span
                        className="material-symbols-outlined flex-shrink-0 mt-0.5"
                        style={{ fontSize: 16, color: scoreColor(result.score) }}
                      >
                        warning
                      </span>
                      <span className="leading-snug text-foreground/85">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.gaps.length === 0 && (
              <div className="flex items-center gap-2 text-sm" style={{ color: "#2D9E7F" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                {t("لا توجد فجوات — ملفك مكتمل!", "No gaps — your profile looks complete!")}
              </div>
            )}
          </div>
        )}

        {/* ── Start Application ─────────────────────────────────────────── */}
        <button
          onClick={() => nav(`/investor/tenders/submit/${tender.id}`)}
          className="btn-gold flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>send</span>
          {t("بدء تقديم الطلب", "Start Application")}
        </button>
      </div>
    </AppShell>
  );
}
