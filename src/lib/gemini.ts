// Lightweight Gemini API caller — falls back to simulated reply when no key is set,
// so the app remains fully demo-able. The user can paste their key in Profile → Settings.

interface ChatMessage { role: "user" | "model"; content: string }

export async function callGemini(opts: {
  apiKey: string;
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
}): Promise<string> {
  const { apiKey, systemPrompt, history, userMessage } = opts;
  if (!apiKey) {
    return simulatedReply(userMessage, systemPrompt);
  }
  try {
    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Understood. I'm ready to help." }] },
      ...history.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
      { role: "user", parts: [{ text: userMessage }] },
    ];
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );
    if (!resp.ok) {
      const text = await resp.text();
      console.error("Gemini error:", resp.status, text);
      return simulatedReply(userMessage, systemPrompt);
    }
    const data = await resp.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply || simulatedReply(userMessage, systemPrompt);
  } catch (e) {
    console.error("Gemini exception:", e);
    return simulatedReply(userMessage, systemPrompt);
  }
}

function simulatedReply(message: string, system: string): string {
  const isArabic = /[\u0600-\u06FF]/.test(message);
  const role = system.includes("Investment") ? "investment"
    : system.includes("Business") ? "business" : "travel";

  if (role === "travel") {
    return isArabic
      ? `بناءً على ملفك، إليك اقتراحاتي لـ "${message}":\n\n• اليوم 1: عمّان — وسط البلد والمدرج الروماني.\n• اليوم 2: البحر الميت للراحة والعلاج الطبيعي.\n• اليوم 3: البتراء — ابدأ مبكراً قبل ازدحام الظهيرة.\n\n💡 نصيحة: أبريل أهدأ من مايو وأرخص بـ 20%.\n\n(لتفعيل ردود الذكاء الاصطناعي الكاملة، أضف مفتاح Gemini في الملف الشخصي)`
      : `Based on your profile, here's my plan for "${message}":\n\n• Day 1: Amman — Downtown & Roman Theatre.\n• Day 2: Dead Sea for wellness and floating.\n• Day 3: Petra — start early to beat midday crowds.\n\n💡 Tip: April is quieter than May and ~20% cheaper.\n\n(Add your Gemini API key in Profile to unlock full AI responses.)`;
  }
  if (role === "investment") {
    return isArabic
      ? `حول "${message}":\n\nأقوى الفرص الاستثمارية الآن في الأردن:\n• وادي رم — فجوة إيكو لودج (نقاط أولوية 9.2)\n• البحر الميت — مراكز علاج جلدي (نقاط 9.0)\n• العقبة — منتجعات متوسطة (نقاط 8.7)\n\nالحوافز الحكومية: إعفاء ضريبي 10 سنوات + تخصيص أراضٍ.\n\n(فعّل Gemini للحصول على تحليلات مفصلة)`
      : `Regarding "${message}":\n\nTop investment opportunities in Jordan right now:\n• Wadi Rum — eco-lodge gap (Priority 9.2)\n• Dead Sea — dermatology centers (Priority 9.0)\n• Aqaba — mid-tier resorts (Priority 8.7)\n\nGovernment incentives: 10-yr tax exemption + land allocation.\n\n(Enable Gemini for detailed analysis)`;
  }
  return isArabic
    ? `حول "${message}":\n\n• ارفع أسعارك 10–15% خلال موسم الذروة (مارس–مايو).\n• أنشئ عرضاً طارئاً للغرف الفارغة قبل 24 ساعة.\n• استهدف السياح الخليجيين بحزم عائلية في الصيف.\n\n(فعّل Gemini للنصائح المخصصة)`
    : `On "${message}":\n\n• Raise prices 10–15% during peak season (Mar–May).\n• Trigger an emergency offer for empty rooms within 24h of expected check-in.\n• Target Gulf travellers with family bundles in summer.\n\n(Enable Gemini for personalized advice)`;
}
