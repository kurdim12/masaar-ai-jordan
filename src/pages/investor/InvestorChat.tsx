import { ChatScreen } from "@/components/ChatScreen";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";

const INVESTOR_SYSTEM_PROMPT = `You are Masaar's Investment Intelligence AI. You help investors evaluate hospitality and tourism opportunities in Jordan.

Your data context:
- Wadi Rum: Priority Score 9.2, bed gap 1,400 units, 22% growth, eco-lodge opportunity
- Dead Sea: Priority Score 9.0, bed gap 2,400 units, 18% growth, wellness/medical
- Aqaba: Priority Score 8.7, bed gap 1,800 units, 14% growth, mid-tier resorts
- Petra: Priority Score 8.4, bed gap 800 units, 12% growth, heritage boutique
- Jerash: Priority Score 8.1, bed gap 900 units, 16% growth, heritage hotels
- Karak: Priority Score 7.8, emerging — first-mover advantage

Government incentives: 10-year tax exemption, land allocation available for approved hospitality projects through JSEZ and JIB. Tourism = ~14% of Jordan GDP.

Always cite specific numbers. Be direct and data-led. Answer in the same language as the user's message.`;

export default function InvestorChat() {
  const { investorProfile } = useApp();
  return (
    <AppShell>
      <ChatScreen
        title={{ ar: "✨ مستشار الاستثمار", en: "✨ Investment Intelligence" }}
        welcomeAr={"مرحباً مستثمر! 📊\nأقدر أساعدك في:\n• تحليل الفرص الاستثمارية\n• حساب العوائد المتوقعة\n• شرح الحوافز الحكومية\n• مقارنة المناطق\n\nمن وين نبدأ؟"}
        welcomeEn={"Welcome, investor! 📊\nI can help with:\n• Analyzing investment opportunities\n• Estimating ROI\n• Government incentives\n• Region comparisons\n\nWhere shall we start?"}
        suggestions={[
          { ar: "أين أفضل فرصة الآن؟", en: "Top opportunity right now?" },
          { ar: "الحوافز الحكومية", en: "Government incentives?" },
          { ar: "عوائد فندق في البتراء", en: "Petra hotel ROI?" },
          { ar: "Medical tourism opportunities", en: "Medical tourism opportunities" },
        ]}
        systemPrompt={`${INVESTOR_SYSTEM_PROMPT}\n\nInvestor profile: ${JSON.stringify(investorProfile)}.`}
      />
    </AppShell>
  );
}
