import { useApp } from "@/context/AppContext";
import { useEffect, useRef, useState } from "react";
import { callGemini } from "@/lib/gemini";
import { AppHeader } from "./AppHeader";
import { toast } from "sonner";

interface Msg { role: "user" | "assistant"; content: string }

export const ChatScreen = ({
  title, welcomeAr, welcomeEn, suggestions, systemPrompt,
}: {
  title: { ar: string; en: string };
  welcomeAr: string; welcomeEn: string;
  suggestions: { ar: string; en: string }[];
  systemPrompt: string;
}) => {
  const { t, locale, geminiKey } = useApp();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: "assistant", content: locale === "ar" ? welcomeAr : welcomeEn }]);
  }, [locale, welcomeAr, welcomeEn]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const history = messages.map(m => ({ role: m.role === "assistant" ? "model" as const : "user" as const, content: m.content }));
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await callGemini({
        apiKey: geminiKey,
        systemPrompt,
        history,
        userMessage: text,
      });
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      toast.error(t("تعذر الاتصال بالذكاء الاصطناعي", "Could not reach the AI"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppHeader title={t(title.ar, title.en)} showBack />
      <div className="px-4 pt-4 pb-32 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "card-clean !p-3 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="card-clean !px-4 !py-3 rounded-2xl rounded-bl-sm">
              <span className="loading-dots inline-flex">
                <span /><span /><span />
              </span>
            </div>
          </div>
        )}

        <div ref={scrollRef} />

        {messages.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(t(s.ar, s.en))} className="chip text-xs">
                {t(s.ar, s.en)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 inset-x-0 z-30 px-3 pb-2">
        <div className="max-w-md mx-auto glass border border-border/40 rounded-full flex items-center px-2 py-1.5 shadow-card">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
            placeholder={t("اكتب رسالتك…", "Type your message…")}
            className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
            aria-label="send"
          >
            <span className="material-symbols-outlined text-[20px]">
              {locale === "ar" ? "arrow_back" : "arrow_forward"}
            </span>
          </button>
        </div>
        {!geminiKey && (
          <p className="text-center text-[10px] text-muted-foreground mt-1.5 tracking-wide">
            {t("وضع تجريبي — أضف مفتاح Gemini في ملفك لردود أذكى", "Demo mode — add Gemini key in Profile for smarter replies")}
          </p>
        )}
      </div>
    </>
  );
};
