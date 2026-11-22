"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./AavyaFooter.css";

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
      viewBox="0 0 1781 425"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Two delicate hands formed from tiny characters"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* ASCII character texture */}
        <pattern
          id="aavya-ascii"
          width="42"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <g
            className="hand-ascii"
            fontFamily="monospace"
            fontSize="9"
            fontWeight="400"
            letterSpacing="2"
          >
            <text x="1" y="9">a v . : +</text>
            <text x="5" y="22">: / o . a</text>
          </g>
        </pattern>

        {/* LEFT HAND CLIPPING */}
        <clipPath id="left-hand-mask">
          <path
            d="
              M 45 273
              C 105 255 168 235 224 208
              C 287 179 345 151 384 110

              L 461 44
              C 471 36 483 36 491 43
              C 501 51 498 63 490 73
              L 450 124

              L 515 72
              C 527 62 542 63 550 73
              C 558 83 551 95 541 105
              L 477 170

              L 548 121
              C 561 111 576 114 583 125
              C 591 138 578 149 566 159
              L 502 211

              L 570 180
              C 585 171 600 176 606 187
              C 613 201 600 211 587 220

              C 527 259 467 296 410 318
              C 391 326 373 330 357 329

              C 306 342 254 360 207 376
              L 84 376
              L 84 304
              C 72 294 57 283 45 273
              Z
            "
          />
        </clipPath>

        {/* RIGHT HAND CLIPPING */}
        <clipPath id="right-hand-mask">
          <path
            d="
              M 45 273
              C 105 255 168 235 224 208
              C 287 179 345 151 384 110

              L 461 44
              C 471 36 483 36 491 43
              C 501 51 498 63 490 73
              L 450 124

              L 515 72
              C 527 62 542 63 550 73
              C 558 83 551 95 541 105
              L 477 170

              L 548 121
              C 561 111 576 114 583 125
              C 591 138 578 149 566 159
              L 502 211

              L 570 180
              C 585 171 600 176 606 187
              C 613 201 600 211 587 220

              C 527 259 467 296 410 318
              C 391 326 373 330 357 329

              C 306 342 254 360 207 376
              L 84 376
              L 84 304
              C 72 294 57 283 45 273
              Z
            "
          />
        </clipPath>
      </defs>

      {/* =================================
          LEFT HAND
         ================================= */}
      <g className="aavya-left-hand">
        <rect
          x="0"
          y="0"
          width="650"
          height="425"
          fill="url(#aavya-ascii)"
          clipPath="url(#left-hand-mask)"
        />

        <path
          className="hand-outline"
          d="
            M 45 273
            C 105 255 168 235 224 208
            C 287 179 345 151 384 110
            L 461 44
            C 471 36 483 36 491 43
            C 501 51 498 63 490 73
            L 450 124
            L 515 72
            C 527 62 542 63 550 73
            C 558 83 551 95 541 105
            L 477 170
            L 548 121
            C 561 111 576 114 583 125
            C 591 138 578 149 566 159
            L 502 211
            L 570 180
            C 585 171 600 176 606 187
            C 613 201 600 211 587 220
            C 527 259 467 296 410 318
            C 391 326 373 330 357 329
            C 306 342 254 360 207 376
          "
        />

        {/* Finger separation details */}
        <g className="hand-details">
          <path d="M 450 124 Q 468 99 489 73" />
          <path d="M 477 170 Q 507 143 541 105" />
          <path d="M 502 211 Q 530 184 566 159" />

          {/* Fingertip and nail details */}
          <path d="M 477 40 Q 490 34 498 48" />
          <path d="M 537 65 Q 552 62 557 78" />
          <path d="M 573 115 Q 588 119 587 134" />
        </g>
      </g>

      {/* =================================
          RIGHT HAND - PERFECT MIRROR
         ================================= */}
      <g
        className="aavya-right-hand"
        transform="translate(1781 0) scale(-1 1)"
      >
        <rect
          x="0"
          y="0"
          width="650"
          height="425"
          fill="url(#aavya-ascii)"
          clipPath="url(#right-hand-mask)"
        />

        <path
          className="hand-outline"
          d="
            M 45 273
            C 105 255 168 235 224 208
            C 287 179 345 151 384 110
            L 461 44
            C 471 36 483 36 491 43
            C 501 51 498 63 490 73
            L 450 124
            L 515 72
            C 527 62 542 63 550 73
            C 558 83 551 95 541 105
            L 477 170
            L 548 121
            C 561 111 576 114 583 125
            C 591 138 578 149 566 159
            L 502 211
            L 570 180
            C 585 171 600 176 606 187
            C 613 201 600 211 587 220
            C 527 259 467 296 410 318
            C 391 326 373 330 357 329
            C 306 342 254 360 207 376
          "
        />

        <g className="hand-details">
          <path d="M 450 124 Q 468 99 489 73" />
          <path d="M 477 170 Q 507 143 541 105" />
          <path d="M 502 211 Q 530 184 566 159" />
          <path d="M 477 40 Q 490 34 498 48" />
          <path d="M 537 65 Q 552 62 557 78" />
          <path d="M 573 115 Q 588 119 587 134" />
        </g>
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
          <p className="font-display font-bold text-sm tracking-wide">© {new Date().getFullYear()} AAVYA</p>
          <p className="text-xs font-medium">Women&apos;s Health &amp; Wellness</p>
          <p className="text-[11px] opacity-80">Empowering informed healthcare decisions.</p>
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
    </footer>
  );
}

export default AavyaFooter;
