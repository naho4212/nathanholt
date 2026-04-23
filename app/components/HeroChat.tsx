"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type Message = { role: "user" | "assistant"; content: string };

const CHIPS = [
  { label: "Work", icon: "✎", prompt: "What have you actually shipped? Give me the two biggest wins with real numbers." },
  { label: "Building", icon: "◈", prompt: "Tell me about PowSignal. What's the product and who is it for?" },
  { label: "Opinions", icon: "❋", prompt: "What's a take you'd defend the hardest?" },
];

export default function HeroChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  // Scroll thread to bottom on new content
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const submit = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = [...messages, userMsg];

    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) throw new Error(`${res.status}`);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) break;
        const text = decoder.decode(chunk, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: updated[updated.length - 1].content + text,
          };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "something went wrong — try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  const prefill = useCallback((prompt: string) => {
    setInput(prompt);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // Expose prefill for PresetGrid
  useEffect(() => {
    window.__nhPrefill = prefill;
  }, [prefill]);

  const isEmpty = messages.length === 0;

  return (
    <div id="hero-chat" className="chat-root">
      {/* Thread */}
      {!isEmpty && (
        <div className="chat-thread" ref={threadRef}>
          {messages.map((msg, i) => {
            const isLastAssistant =
              msg.role === "assistant" && i === messages.length - 1;
            const isThinking = isLastAssistant && isStreaming && msg.content === "";

            return (
              <div
                key={i}
                className={`chat-msg chat-msg--${msg.role}`}
              >
                {msg.role === "assistant" && (
                  <div className="chat-from">nathan</div>
                )}
                {isThinking ? (
                  <div className="chat-thinking">
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                    <span className="chat-dot" />
                  </div>
                ) : (
                  <div className="chat-text">{msg.content}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Composer */}
      <div className={`ask${isEmpty ? "" : " ask--threaded"}`}>
        <textarea
          ref={inputRef}
          id="heroAskInput"
          className="ask-input"
          placeholder={isEmpty ? "Ask about my work, side projects, or how I think…" : "Ask a follow-up…"}
          autoComplete="off"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ resize: "none", overflow: "hidden" }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = Math.min(el.scrollHeight, 120) + "px";
          }}
        />
        <button
          className="ask-send"
          aria-label="Send"
          onClick={() => submit(input)}
          aria-disabled={isStreaming || !input.trim()}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </button>
      </div>

      {/* Chips — only shown before first message */}
      {isEmpty && (
        <div className="chips">
          {CHIPS.map(({ label, icon, prompt }) => (
            <button key={label} className="chip" onClick={() => prefill(prompt)}>
              <span className="mk">{icon}</span>{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    __nhPrefill?: (prompt: string) => void;
  }
}
