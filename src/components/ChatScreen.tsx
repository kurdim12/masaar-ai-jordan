import { useApp } from "@/context/AppContext";
import { useEffect, useState } from "react";
import { callGemini } from "@/lib/gemini";
import { AppHeader } from "./AppHeader";

interface Msg { role: "user" | "model"; content: string }

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

  useEffect(() => {
    setMessages([{ role: "model", content: locale === "ar" ? welcomeAr : welcomeEn }]);
  }, [locale, welcomeAr, welcomeEn]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await callGemini({
        apiKey: geminiKey,
        systemPrompt,
        history: messages,
        userMessage: text,
      });
      setMessages(prev => [...prev, { role: "model", content: reply }]);
    } finally {
      setLoading(false);
    }
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
                  : "card-masaar rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="card-masaar rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse" />
              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse [animation-delay:120ms]" />
              <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-pulse [animation-delay:240ms]" />
            </div>
          </div>
        )}

        {messages.length <= 1 && (
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
