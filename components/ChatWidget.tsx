"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hiya — I'm Captain Q1. I've memorised every stat from the 56,880 player dataset. Ask me anything: \"Why are Brazilians so Q1?\", \"How tall are elite wingers?\", \"Who's the most lefty position?\" — or just poke around and see what I know.",
};

const SUGGESTIONS = [
  "What's the strongest country-level RAE?",
  "Why are footballers so left-footed?",
  "How tall are Big 5 league players?",
  "Which position is shortest?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m !== WELCOME).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setMessages((m) => [
          ...m,
          { role: "assistant", content: "Hmm, couldn't reach my brain. Try again in a sec." },
        ]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: data.content }]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Network hiccup. Try again?" },
      ]);
    } finally {
      setSending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-[#1B2A4A] to-[#2E86AB] text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
            </span>
          </>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-2rem))] h-[min(560px,calc(100vh-8rem))] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B2A4A] to-[#2E86AB] text-white px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-lg">⚽</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">Captain Q1</div>
              <div className="text-[11px] text-blue-200 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Here to help · FIFA 15-23 data
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-snug ${
                    m.role === "user"
                      ? "bg-[#1B2A4A] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-400 border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}
            {messages.length === 1 && !sending && (
              <div className="pt-2">
                <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-2">Quick starters</div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:bg-[#2E86AB]/10 hover:border-[#2E86AB] transition-colors text-gray-700"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={onSubmit} className="border-t border-gray-200 bg-white p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about the data..."
              disabled={sending}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]/40 focus:border-[#2E86AB] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="bg-[#1B2A4A] text-white rounded-lg px-4 text-sm font-medium hover:bg-[#2E86AB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
