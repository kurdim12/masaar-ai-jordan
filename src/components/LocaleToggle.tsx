import { useApp } from "@/context/AppContext";

export const LocaleToggle = ({ light = false }: { light?: boolean }) => {
  const { locale, setLocale } = useApp();
  const base = light
    ? "border-white/30 text-white"
    : "border-border text-foreground";
  const activeCls = light ? "bg-white text-primary" : "bg-primary text-primary-foreground";
  return (
    <div className={`inline-flex items-center rounded-full border ${base} p-0.5 text-xs font-semibold tracking-wide`}>
      <button
        onClick={() => setLocale("en")}
        className={`px-3 py-1 rounded-full transition-all ${locale === "en" ? activeCls : ""}`}
      >EN</button>
      <button
        onClick={() => setLocale("ar")}
        className={`px-3 py-1 rounded-full transition-all ${locale === "ar" ? activeCls : ""}`}
      >AR</button>
    </div>
  );
};
