"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { X, Send, Sparkles, Bot, User, ShieldCheck, ChevronRight, Activity } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  confidenceScore?: number;
  riskPercentage?: number;
  riskCategory?: string;
  detectedSymptoms?: { name: string; feature_mapped: string }[];
  isPrediction?: boolean;
}

export function ChatbotDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hello! I am **AAVYA**, your clinical PCOS risk assistant. You can describe your menstrual patterns and symptoms in your own words (e.g. *'I have missed my periods for 2 months, notice hair on my chin, and have bad acne'*), and I will calculate your **model confidence score** and risk probability using our trained model.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch(`${apiUrl}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.reply,
          confidenceScore: data.confidence_score,
          riskPercentage: data.risk_percentage,
          riskCategory: data.risk_category,
          detectedSymptoms: data.detected_symptoms,
          isPrediction: data.is_prediction_triggered,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "I encountered an error connecting to the inference engine. Please ensure the backend is running.",
          },
        ]);
      }
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Network error reaching AAVYA backend service.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Action Trigger Button: Circular by default, expands to pill on hover */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group clay-button-primary h-14 rounded-full shadow-2xl transition-all duration-300 ease-out flex items-center overflow-hidden p-0 active:scale-95"
          aria-label="Open AAVYA AI Assistant"
        >
          <div className="size-14 rounded-full flex items-center justify-center shrink-0">
            <div className="size-9 rounded-full bg-white/20 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
              <Sparkles className="size-4 text-white" />
            </div>
          </div>
          <div className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:pr-5 transition-all duration-300 ease-out whitespace-nowrap overflow-hidden">
            <span className="text-sm font-semibold tracking-tight text-white">Ask AAVYA AI</span>
          </div>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="clay-card w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] flex flex-col shadow-2xl rounded-2xl border border-[var(--border)] overflow-hidden animate-scaleIn bg-[var(--card)]">
          {/* Header */}
          <div className="p-4 bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-between border-b border-rose-900/10">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center font-display font-bold text-sm">
                A
              </div>
              <div>
                <h3 className="font-display font-bold text-sm leading-tight">
                  AAVYA AI Assistant
                </h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="size-7 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="size-3.5 text-[var(--leaf)]" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] rounded-tr-xs"
                        : "bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-xs"
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* High-Impact Confidence Score Card if Prediction Triggered */}
                  {m.isPrediction && m.confidenceScore !== undefined && (
                    <div className="p-3.5 rounded-xl bg-white border-2 border-[var(--primary)] shadow-sm space-y-2 animate-fadeIn text-[var(--foreground)]">
                      <div className="flex items-center justify-between">
                        <span className="font-display font-bold text-xs text-[var(--primary)] flex items-center gap-1">
                          <Activity className="size-3.5" />
                          <span>Model Confidence Estimation</span>
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-100 text-rose-800">
                          {m.riskCategory}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100">
                        <div className="p-2 rounded-lg bg-stone-50 border border-stone-200">
                          <span className="text-[10px] text-stone-500 block uppercase tracking-wider">
                            Classifier Certainty
                          </span>
                          <span className="font-display font-bold text-base text-[var(--foreground)] tabular-nums">
                            {m.confidenceScore}%
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                          <span className="text-[10px] text-rose-600 block uppercase tracking-wider">
                            PCOS Risk Index
                          </span>
                          <span className="font-display font-bold text-base text-rose-900 tabular-nums">
                            {m.riskPercentage}%
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <Link
                          href="/assessment"
                          className="flex-1 py-1.5 px-2.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-[11px] font-semibold text-center hover:opacity-90 flex items-center justify-center gap-1"
                        >
                          <span>Full Assessment</span>
                          <ChevronRight className="size-3" />
                        </Link>
                        <Link
                          href="/doctors"
                          className="py-1.5 px-2.5 rounded-lg bg-[var(--secondary)] text-[var(--secondary-foreground)] text-[11px] font-semibold text-center hover:opacity-90"
                        >
                          Book Doctor
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {m.role === "user" && (
                  <div className="size-7 rounded-full bg-[var(--leaf)] text-[var(--leaf-foreground)] flex items-center justify-center shrink-0 mt-0.5">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 items-center text-stone-500">
                <div className="size-7 rounded-full bg-[var(--secondary)] flex items-center justify-center shrink-0">
                  <Bot className="size-3.5 text-[var(--leaf)]" />
                </div>
                <div className="p-3 rounded-xl bg-[var(--background)] border border-[var(--border)] flex items-center gap-2">
                  <div className="size-2 rounded-full bg-[var(--primary)] animate-ping" />
                  <span className="text-xs">Evaluating symptoms through trained model...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-1.5 border-t border-[var(--border)] bg-[var(--card)] flex gap-1.5 overflow-x-auto text-[10px] shrink-0">
            {[
              "Predict my risk: irregular cycle & acne",
              "What is Rotterdam criteria?",
              "Recommended lab tests for PCOS",
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInput(prompt);
                }}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 whitespace-nowrap transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-[var(--border)] bg-[var(--card)] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe symptoms or ask about PCOS..."
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="clay-button-primary p-2 rounded-xl disabled:opacity-50 transition-opacity"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
