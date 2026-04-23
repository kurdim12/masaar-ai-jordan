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

  const lastIdx = messages.length - 1;

  return (
    <>
      <AppHeader title={t(title.ar, title.en)} showBack />

      {/* AI status pill row */}
      <div className="px-4 pt-2 pb-1 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(var(--jade))" }} />
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "hsl(var(--jade))", letterSpacing: "0.08em" }}>
          ONLINE · GEMINI 2.5 FLASH
        </span>
      </div>

      <div className="px-4 pt-2 pb-32 space-y-3">
        {messages.map((m, i) => {
          const isStreaming = loading && i === lastIdx && m.role === "assistant";
          return (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user" ? "bubble-user" : "bubble-ai"
                }`}
                style={{ maxWidth: "85%" }}
              >
                {m.content}
                {isStreaming && <span className="stream-cursor" />}
                {!m.content && loading && i === lastIdx && <StreamingDots />}
              </div>
            </div>
          );
        })}
        {loading && messages[lastIdx]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bubble-ai px-4 py-2.5">
              <StreamingDots />
            </div>
          </div>
        )}
        <div ref={scrollRef} />

        {messages.length <= 1 && !loading && (
          <div className="flex flex-wrap gap-2 pt-2">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => send(t(s.ar, s.en))} className="chat-tag">
                {t(s.ar, s.en)}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-16 inset-x-0 z-30 px-3 pb-2">
        <div
          className="max-w-md mx-auto rounded-full flex items-center px-2 py-1.5 shadow-card"
          style={{
            background: "hsl(212 60% 4% / 0.97)",
            border: "0.5px solid hsl(var(--sand) / 0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder={t("اكتب رسالتك…", "Type your message…")}
            className="flex-1 bg-transparent outline-none px-3 py-2 text-sm"
            style={{ color: "hsl(var(--t1))" }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
            style={{ background: "hsl(var(--rose))", color: "white" }}
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
