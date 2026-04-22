import { AppShell } from "@/components/AppShell";
import { AppHeader } from "@/components/AppHeader";
import { useApp } from "@/context/AppContext";

export default function About() {
  const { t } = useApp();

  const phases = [
    {
      active: true,
      titleAr: "الآن — النسخة الأولى",
      titleEn: "Now — MVP",
      bulletsAr: [
        "توصيات سفر واستثمار بالذكاء الاصطناعي",
        "نظام عروض سريعة لأصحاب الأعمال",
        "ثنائي اللغة عربي / إنجليزي",
      ],
      bulletsEn: [
        "AI travel & investment recommendations",
        "Flash offer system for businesses",
        "Bilingual Arabic / English",
      ],
    },
    {
      active: false,
      titleAr: "2025 — التكامل",
      titleEn: "2025 — Integration",
      bulletsAr: [
        "بيانات حية من وزارة السياحة",
        "حجوزات ومدفوعات حقيقية",
        "ملفات أعمال موثقة",
      ],
      bulletsEn: [
        "Live Ministry of Tourism data",
        "Real booking & payments",
        "Verified business profiles",
      ],
    },
    {
      active: false,
      titleAr: "2026 — الذكاء",
      titleEn: "2026 — Intelligence",
      bulletsAr: [
        "تعلّم مستمر على بيانات المستخدمين",
        "شراكات حكومية",
        "توسّع إقليمي (السعودية، الإمارات)",
      ],
      bulletsEn: [
        "Continuous learning on user data",
        "Government partnerships",
        "Regional expansion (Saudi, UAE)",
      ],
    },
  ];

  return (
    <AppShell>
      <AppHeader title={t("عن مسار", "About Masaar")} showBack />
      <div className="px-6 pt-6 pb-10 space-y-8">
        <header className="space-y-2">
          <h1 className="font-display text-[28px] leading-tight text-primary">Masaar مسار</h1>
          <p className="text-[13px] text-muted-foreground">
            {t("منصة الأردن الذكية للسياحة", "Jordan's AI Tourism Intelligence Platform")}
          </p>
          <p className="text-[11px] tracking-[0.25em] uppercase text-secondary font-semibold">
            v1.0 — {t("المرحلة الأولى", "Phase 1")}
          </p>
        </header>

        <section className="space-y-4">
          {phases.map((p, i) => (
            <article key={i} className="card-clean">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: p.active ? "hsl(var(--success))" : "hsl(var(--muted-foreground) / 0.35)" }}
                />
                <h2 className="font-display text-[16px] text-primary font-semibold">
                  {t(p.titleAr, p.titleEn)}
                </h2>
              </div>
              <ul className="space-y-2">
                {p.bulletsAr.map((ar, k) => (
                  <li key={k} className="text-[13px] text-muted-foreground flex gap-2">
                    <span className="text-secondary">•</span>
                    <span>{t(ar, p.bulletsEn[k])}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <p className="text-center text-[12px] text-muted-foreground pt-4">
          {t("صُنع بواسطة طلاب جامعة البترا — فرع IEEE", "Built by students of University of Petra — IEEE Branch")}
        </p>
      </div>
    </AppShell>
  );
}
