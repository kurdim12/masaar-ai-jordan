import { ChatScreen } from "@/components/ChatScreen";
import { useApp } from "@/context/AppContext";
import { AppShell } from "@/components/AppShell";

export default function TravellerChat() {
  const { travellerProfile } = useApp();
  return (
    <AppShell>
      <ChatScreen
        title={{ ar: "✨ مستشار مسار", en: "✨ Masaar AI Advisor" }}
        welcomeAr={`مرحباً! أنا مستشار مسار الذكي 🌟\nبناءً على ملفك الشخصي، يمكنني مساعدتك في:\n• تخطيط جدول رحلتك\n• إيجاد أفضل الأوقات للزيارة\n• اقتراح أماكن تناسب ميزانيتك\n• معلومات عن السياحة العلاجية في الأردن\n\nكيف يمكنني مساعدتك؟`}
        welcomeEn={`Hi! I'm Masaar's intelligent advisor 🌟\nBased on your profile, I can help you with:\n• Building your day-by-day itinerary\n• Finding the best times to visit\n• Suggesting places that fit your budget\n• Medical & wellness tourism in Jordan\n\nHow can I help?`}
        suggestions={[
          { ar: "خطط لي 3 أيام في البتراء", en: "Plan 3 days in Petra" },
          { ar: "وين أروح للعلاج بالبحر الميت؟", en: "Where for Dead Sea wellness?" },
          { ar: "ما أفضل وقت لزيارة وادي رم؟", en: "Best time for Wadi Rum?" },
          { ar: "خطة ثقافية لخمسة أيام", en: "5-day culture-lover plan" },
        ]}
        systemPrompt={`You are Masaar AI, a Jordan tourism expert assistant. You speak both Arabic and English fluently.
Context: Petra (847K visitors, best Mar-May), Wadi Rum (312K, eco-lodges), Aqaba (1.24M, Red Sea), Dead Sea (680K, wellness/skin treatments), Amman (2.1M, capital), Jerash (420K, Roman ruins), Madaba (290K, mosaics), Karak (185K, castle).
Medical & Wellness: Dead Sea for skin (psoriasis, eczema), thermal springs, 40-60% savings vs Western prices.
User profile: ${JSON.stringify(travellerProfile)}.
Respond in the same language the user writes in. Be concise, specific, mention real places.`}
      />
    </AppShell>
  );
}
