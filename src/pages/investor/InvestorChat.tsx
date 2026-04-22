import { ChatScreen } from "@/components/ChatScreen";
import { AppShell } from "@/components/AppShell";
import { useApp } from "@/context/AppContext";

export default function InvestorChat() {
  const { investorProfile } = useApp();
  return (
    <AppShell>
      <ChatScreen
        title={{ ar: "✨ مستشار الاستثمار", en: "✨ Investment Advisor" }}
        welcomeAr="مرحباً مستثمر! 📊\nأقدر أساعدك في:\n• تحليل الفرص الاستثمارية\n• حساب العوائد المتوقعة\n• شرح الحوافز الحكومية\n• مقارنة المناطق\n\nمن وين نبدأ؟"
        welcomeEn="Welcome, investor! 📊\nI can help with:\n• Analyzing investment opportunities\n• Estimating ROI\n• Government incentives\n• Region comparisons\n\nWhere shall we start?"
        suggestions={[
          { ar: "أين أفضل فرصة الآن؟", en: "Top opportunity right now?" },
          { ar: "الحوافز الحكومية", en: "Government incentives?" },
          { ar: "عوائد فندق في البتراء", en: "Petra hotel ROI?" },
          { ar: "Medical tourism opportunities", en: "Medical tourism opportunities" },
        ]}
        systemPrompt={`You are Masaar Investment AI, a Jordan tourism investment expert.
Tourism = ~14% of Jordan's GDP. Top opportunity zones: Wadi Rum (eco-lodges), Dead Sea (wellness), Jerash (heritage), Karak (emerging). Medical tourism +15% YoY. Average occupancy 63%, peaks 82% Petra.
Government incentives: 10-yr tax exemption, land allocation, reduced fees.
Investor profile: ${JSON.stringify(investorProfile)}.
Answer about opportunities, ROI, regulations, market conditions in the user's language.`}
      />
    </AppShell>
  );
}
