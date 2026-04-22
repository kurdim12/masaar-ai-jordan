import { useApp } from "@/context/AppContext";
import { useEffect, useRef, useState } from "react";
import { streamChat, AIMsg } from "@/lib/aiChat";
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
  const { t, locale } = useApp();
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
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Build AI history from prior turns (skip the welcome assistant message context)
    const history: AIMsg[] = next.map(m => ({ role: m.role, content: m.content }));

    let assistantSoFar = "";
    let started = false;

    await streamChat({
      systemPrompt,
      messages: history,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          if (!started) {
            started = true;
            return [...prev, { role: "assistant", content: assistantSoFar }];
          }
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      },
      onDone: () => setLoading(false),
      onError: (e) => {
        setLoading(false);
        const msg = /429/.test(e.message)
          ? t("الكثير من الطلبات، حاول لاحقاً", "Too many requests, try again later")
          : /402/.test(e.message)
          ? t("تم استنفاد رصيد الذكاء الاصطناعي", "AI credits depleted")
          : t("تعذر الاتصال بالذكاء الاصطناعي", "Could not reach the AI");
        toast.error(msg);
      },
    });
  };

  return (
    <>
      <AppHeader title={t(title.ar, title.en)} showBack />
      <div className="px-4 pt-4 pb-32 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "card-clean !p-3 rounded-bl-sm"
              }`}
            >
              {m.content || (loading && i === messages.length - 1 ? <StreamingDots /> : null)}
            </div>
          </div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="card-clean !p-3 rounded-2xl rounded-bl-sm">
              <StreamingDots />
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
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={t("اكتب رسالتك…", "Type your message…")}
            className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40"
            aria-label="send"
          >
            <span className="material-symbols-outlined text-[20px]">{locale === "ar" ? "arrow_back" : "arrow_forward"}</span>
          </button>
        </div>
      </div>
    </>
  );
};

const StreamingDots = () => (
  <span className="loading-dots inline-flex">
    <span /><span /><span />
  </span>
);
