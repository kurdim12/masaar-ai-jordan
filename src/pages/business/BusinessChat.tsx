import { ChatScreen } from "@/components/ChatScreen";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";

const BUSINESS_SYSTEM_PROMPT = `You are Masaar's Business Advisor AI. You help Jordan hotels, camps, and hospitality businesses optimize pricing, occupancy, and revenue.

Focus areas:
- Seasonal demand patterns by governorate
- Flash offer strategy (when to trigger, how to price)
- Peak vs off-peak pricing recommendations
- Gulf traveler targeting (high-value segment)
- Emergency offer triggers for last-minute vacancies
- Medical/wellness near Dead Sea & Aqaba

Always give actionable, specific advice. Reference Jordan-specific seasons: peak = March-May, Sep-Oct; low = July-August in many areas. Answer in the user's language.`;

export default function BusinessChat() {
  const { businessProfile } = useApp();
  return (
    <AppShell>
      <ChatScreen
        title={{ ar: "✨ مستشار الأعمال", en: "✨ Business Advisor" }}
        welcomeAr={"مرحباً! أنا مستشارك الذكي لإدارة مشروعك السياحي.\nاسألني عن:\n• استراتيجيات التسعير\n• جذب جنسيات معينة\n• إدارة الموسم\n• تحسين العروض"}
        welcomeEn={"Hi! I'm your tourism business advisor.\nAsk me about:\n• Pricing strategies\n• Targeting specific nationalities\n• Seasonal demand\n• Optimizing offers"}
        suggestions={[
          { ar: "كيف أزيد إشغالي في يناير؟", en: "How to boost January occupancy?" },
          { ar: "أسعار مناسبة للصيف", en: "Right summer pricing?" },
          { ar: "كيف أجذب سياح الخليج؟", en: "How to attract Gulf tourists?" },
          { ar: "European medical tourists", en: "European medical tourists?" },
        ]}
        systemPrompt={`${BUSINESS_SYSTEM_PROMPT}\n\nBusiness profile: ${JSON.stringify(businessProfile)}.`}
      />
    </AppShell>
  );
}
