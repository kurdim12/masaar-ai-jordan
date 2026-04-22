// Lovable AI Gateway streaming client. Calls our edge function which proxies to
// google/gemini-2.5-flash. Streams tokens to onDelta as they arrive.

export interface AIMsg { role: "user" | "assistant" | "system"; content: string }

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export async function streamChat(opts: {
  systemPrompt: string;
  messages: AIMsg[];
  onDelta: (chunk: string) => void;
  onDone?: () => void;
  onError?: (err: Error) => void;
  signal?: AbortSignal;
}) {
  const { systemPrompt, messages, onDelta, onDone, onError, signal } = opts;
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ systemPrompt, messages }),
      signal,
    });

    if (!resp.ok || !resp.body) {
      const errBody = await resp.text().catch(() => "");
      throw new Error(`AI request failed (${resp.status}) ${errBody}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }
        try {
          const parsed = JSON.parse(jsonStr);
          const content: string | undefined = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content: string | undefined = parsed.choices?.[0]?.delta?.content;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone?.();
  } catch (e) {
    onError?.(e instanceof Error ? e : new Error(String(e)));
  }
}

// Non-streaming helper that returns the complete response text.
export async function completeChat(opts: {
  systemPrompt: string;
  messages: AIMsg[];
  signal?: AbortSignal;
}): Promise<string> {
  let full = "";
  await streamChat({
    ...opts,
    onDelta: (c) => { full += c; },
  });
  return full;
}
