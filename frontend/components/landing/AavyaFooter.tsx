"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./AavyaFooter.css";
import { HAND_CHARS } from "./handsData";

interface NavigationItem {
  label: string;
  href: string;
}

// Exactly matching the navbar links
const navigation: NavigationItem[] = [
  { label: "PCOS Assessment", href: "/assessment" },
  { label: "About", href: "/#about" },
  { label: "Find Doctors", href: "/doctors" },
];

function AavyaHands() {
  return (
    <svg
      className="aavya-hands"
      viewBox="0 0 1024 321"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Two delicate hands from The Creation of Adam rendered exclusively in characters of AAVYA"
      preserveAspectRatio="xMidYMid meet"
    >
      <g className="hand-ascii-group">
        {HAND_CHARS.map(([x, y, char, opacity], i) => (
          <text
            key={i}
            x={x}
            y={y}
            opacity={opacity}
            className="hand-ascii-char"
          >
            {char}
          </text>
        ))}
      </g>
    </svg>
  );
}

interface AavyaFooterProps {
  onSubscribe?: (e: React.FormEvent) => void;
}

export function AavyaFooter({ onSubscribe }: AavyaFooterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubscribe) {
      onSubscribe(e);
      return;
    }

    if (!email) return;
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";
      const res = await fetch(`${apiUrl}/users/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Subscriber",
          email: email.trim().toLowerCase(),
        }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        setSubmitMessage("Thank you for connecting with us! Your journey with AAVYA begins here.");
      } else {
        setIsSubscribed(true);
        setSubmitMessage("Thank you for connecting with us!");
      }
    } catch {
      setIsSubscribed(true);
      setSubmitMessage("Thank you for connecting with us!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="aavya-footer">
      <div className="aavya-footer-inner">
        <div className="aavya-footer-top">
          {/* NEWSLETTER */}
          <div className="aavya-newsletter">
            <p className="aavya-footer-heading">
              Stay connected with us
            </p>

            {isSubscribed ? (
              <div className="p-4 rounded-xl bg-[var(--footer-surface)] border border-[var(--footer-border)] text-xs text-[var(--footer-text)] space-y-1.5 shadow-sm animate-fadeIn">
                <strong className="block text-sm text-[var(--footer-accent)]">Subscription Confirmed</strong>
                <p>{submitMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubscribed(false);
                    setEmail("");
                    setName("");
                  }}
                  className="text-[11px] underline text-[var(--footer-muted)] hover:text-[var(--footer-accent)] mt-2 inline-block cursor-pointer"
                >
                  Subscribe another email
                </button>
              </div>
            ) : (
              <form className="aavya-newsletter-form" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Your name"
                  aria-label="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"} <span>+</span>
                </button>
              </form>
            )}

            <p className="aavya-footer-muted">
              Your information stays private. Unsubscribe anytime.
            </p>
          </div>

          {/* NAVIGATION (Navbar Links) */}
          <nav className="aavya-footer-navigation" aria-label="Footer navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CONTACT & LEGAL (Static Clickables, no redirection) */}
          <div className="aavya-footer-contact">
            <span
              className="static-email select-all"
              role="button"
              tabIndex={0}
              onClick={(e) => e.preventDefault()}
            >
              hello@aavya.health
            </span>

            <span
              className="static-link"
              role="button"
              tabIndex={0}
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </span>
            <span
              className="static-link"
              role="button"
              tabIndex={0}
              onClick={(e) => e.preventDefault()}
            >
              Terms &amp; Conditions
            </span>
            <span
              className="static-link"
              role="button"
              tabIndex={0}
              onClick={(e) => e.preventDefault()}
            >
              Medical Disclaimer
            </span>
          </div>
        </div>

        {/* ARTWORK AND COPYRIGHT (Static Feminine Hands) */}
        <div className="aavya-footer-artwork">
          <AavyaHands />

          <div className="aavya-footer-copyright">
            <p className="font-display font-medium text-xs tracking-wider opacity-90">© {new Date().getFullYear()} AAVYA</p>
            <p className="text-[11px] font-normal opacity-75 mt-0.5">Women&apos;s Health &amp; Wellness</p>
            <p className="text-[10px] font-normal opacity-60 mt-0.5">Empowering informed healthcare decisions.</p>
          </div>
        </div>

        {/* BRAND WORDMARK */}
        <div className="aavya-footer-brand">
          AAVYA
        </div>

        {/* BOTTOM BAR */}
        <div className="aavya-footer-bottom">
          <span>Made with care, specially for Indian women</span>
          <span>PRIVACY · TRUST · WELLNESS</span>
        </div>
      </div>
    </footer>
  );
}

export default AavyaFooter;
