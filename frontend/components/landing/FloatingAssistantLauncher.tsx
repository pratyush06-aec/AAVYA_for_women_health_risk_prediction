"use client";

import React, { useState } from "react";
import { Sparkles, MessageCircle, X, Send, Bot, User, ShieldAlert } from "lucide-react";

interface ChatMessage {
  sender: "bot" | "user";
  text: string;
}

export function FloatingAssistantLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "bot",
      text: "Namaste! I am AAVYA Assistant. I can help explain PCOS biomarkers, guide you through our multi-generational assessment, or answer questions about reproductive health. How can I support you today?",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal.trim();
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputVal("");

    // Conversational prompt response
    setTimeout(() => {
      let reply = "Thank you for sharing. While I can offer preliminary health intelligence, remember that PCOS requires formal medical diagnosis. Would you like to complete our structured risk assessment to generate a clinical summary for a specialist?";
      
      const lower = userText.toLowerCase();
      if (lower.includes("symptom") || lower.includes("sign")) {
        reply = "Key symptoms of PCOS encompass menstrual irregularities (cycles >35 days), signs of excess androgens (hirsutism, acne, alopecia), and rapid weight changes. In Phase 3, you'll be able to enter free-text symptoms for extraction.";
      } else if (lower.includes("heredity") || lower.includes("mother") || lower.includes("family")) {
        reply = "Hereditary risk is significant in PCOS! If your mother, sister, or grandmothers experienced irregular cycles, subfertility, or type 2 diabetes, your statistical likelihood increases. AAVYA explicitly models 3 generations of family pedigree.";
      } else if (lower.includes("doctor") || lower.includes("consult")) {
        reply = "We have a network of verified gynecologists and reproductive endocrinologists across major cities. You can explore their profiles in the Specialist Network section.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 400);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Slide-over Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[380px] h-[520px] rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[var(--secondary)] border-b border-[var(--border)] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-bold text-sm shadow-sm">
                A
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--secondary-foreground)] leading-tight">
                  AAVYA AI Assistant
                </h3>
                <span className="text-[10px] text-[var(--leaf)] font-medium flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-[var(--leaf)] animate-pulse" />
                  Online • Clinical Guardrails Active
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="size-7 rounded-full bg-[color-mix(in_oklab,var(--card)_80%,transparent)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--card)]"
              aria-label="Close Assistant"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Medical Notice strip */}
          <div className="bg-[color-mix(in_oklab,var(--coral)_30%,var(--card))] px-3 py-1.5 border-b border-[color-mix(in_oklab,var(--coral)_50%,var(--border))] text-[10px] text-[var(--coral-foreground)] flex items-center gap-1.5">
            <ShieldAlert className="size-3 text-[var(--primary)] shrink-0" />
            <span>Educational guidance only. Not medical diagnosis.</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs leading-relaxed">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${
                  m.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="size-6 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shrink-0 text-[10px]">
                    <Bot className="size-3.5" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl max-w-[80%] ${
                    m.sender === "user"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-br-none"
                      : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div className="size-6 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)] flex items-center justify-center shrink-0 text-[10px]">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[var(--background)] border-t border-[var(--border)] flex gap-1.5 overflow-x-auto no-scrollbar">
            {["Common symptoms?", "How hereditary is it?", "Book doctor"].map((chip) => (
              <button
                key={chip}
                onClick={() => setInputVal(chip)}
                className="shrink-0 text-[10px] px-2.5 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--primary)]"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[var(--border)] bg-[var(--card)] flex gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Type your question..."
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              className="size-9 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center hover:opacity-95 transition-opacity"
              aria-label="Send message"
            >
              <Send className="size-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button (FAB) */}
      <div className="flex items-center gap-3">
        {!isOpen && (
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--foreground)] shadow-md animate-in fade-in duration-300">
            <Sparkles className="size-3 text-[var(--primary)]" />
            <span>Ask AAVYA Assistant</span>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close AI Health Assistant" : "Open AI Health Assistant"}
          className="size-14 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center shadow-xl transition-transform duration-150 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
        >
          {isOpen ? (
            <X className="size-6 text-[var(--primary-foreground)]" />
          ) : (
            <div className="relative">
              <MessageCircle className="size-6 text-[var(--primary-foreground)]" />
              <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-[var(--leaf)] border-2 border-[var(--primary)]" />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
