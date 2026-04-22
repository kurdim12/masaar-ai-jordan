import { ChatScreen } from "@/components/ChatScreen";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";

export default function BusinessChat() {
  const { businessProfile } = useApp();
  return (
    <AppShell>
      <ChatScreen
        title={{ ar: "✨ مستشار الأعمال", en: "✨ Business Advisor" }}
        welcomeAr="مرحباً! أنا مستشارك الذكي لإدارة مشروعك السياحي.\nاسألني عن:\n• استراتيجيات التسعير\n• جذب جنسيات معينة\n• إدارة الموسم\n• تحسين العروض"
        welcomeEn="Hi! I'm your tourism business advisor.\nAsk me about:\n• Pricing strategies\n• Targeting specific nationalities\n• Seasonal demand\n• Optimizing offers"
        suggestions={[
          { ar: "كيف أزيد إشغالي في يناير؟", en: "How to boost January occupancy?" },
          { ar: "أسعار مناسبة للصيف", en: "Right summer pricing?" },
          { ar: "كيف أجذب سياح الخليج؟", en: "How to attract Gulf tourists?" },
          { ar: "European medical tourists", en: "European medical tourists?" },
        ]}
        systemPrompt={`You are Masaar Business AI, a tourism business consultant for Jordan.
Business profile: ${JSON.stringify(businessProfile)}.
Provide practical specific advice on pricing, targeting tourist segments, medical/wellness near Dead Sea/Aqaba, seasonal demand, flash offers, and competition.
Respond in the same language the user writes in.`}
      />
    </AppShell>
  );
}
