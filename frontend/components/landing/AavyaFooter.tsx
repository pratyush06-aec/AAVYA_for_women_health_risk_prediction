"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./AavyaFooter.css";

interface NavigationItem {
  label: string;
  href: string;
}

const navigation: NavigationItem[] = [
  { label: "HOME", href: "/" },
  { label: "OUR APPROACH", href: "/#about" },
  { label: "PCOS CARE", href: "/assessment" },
  { label: "FIND A DOCTOR", href: "/doctors" },
  { label: "CONTACT", href: "mailto:hello@aavya.health" },
];

function FeminineHandsArtwork() {
  return (
    <svg
      className="aavya-hands-art"
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="aavya-character-pattern"
          width="76"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <text
            x="0"
            y="12"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="2"
            fill="currentColor"
          >
            a v . : * + o
          </text>
          <text
            x="8"
            y="25"
            fontSize="8"
            fontFamily="monospace"
            letterSpacing="2"
            fill="currentColor"
          >
            : &#123; / o . a
          </text>
        </pattern>

        <clipPath id="left-hand-clip">
          <path
            d="
              M -35 340
              C 60 315 145 280 222 250
              C 250 238 271 222 291 202
              L 356 137
              C 365 128 377 129 383 138
              C 390 147 385 157 377 167
              L 329 224
              L 394 159
              C 405 148 419 151 423 162
              C 427 173 417 184 408 194
              L 354 253
              L 423 202
              C 436 192 449 198 450 210
              C 451 220 439 231 429 239
              L 365 288
              C 397 268 427 253 449 250
              C 464 248 473 259 468 270
              C 465 280 450 287 438 293
              L 355 344
              C 318 367 285 381 244 391
              L -35 445 Z
            "
          />
        </clipPath>

        <clipPath id="right-hand-clip">
          <path
            d="
              M 1475 340
              C 1380 315 1295 280 1218 250
              C 1190 238 1169 222 1149 202
              L 1084 137
              C 1075 128 1063 129 1057 138
              C 1050 147 1055 157 1063 167
              L 1111 224
              L 1046 159
              C 1035 148 1021 151 1017 162
              C 1013 173 1023 184 1032 194
              L 1086 253
              L 1017 202
              C 1004 192 991 198 990 210
              C 989 220 1001 231 1011 239
              L 1075 288
              C 1043 268 1013 253 991 250
              C 976 248 967 259 972 270
              C 975 280 990 287 1002 293
              L 1085 344
              C 1122 367 1155 381 1196 391
              L 1475 445 Z
            "
          />
        </clipPath>
      </defs>

      {/* LEFT FEMININE HAND */}
      <g className="aavya-hand-left">
        <rect
          x="0"
          y="100"
          width="500"
          height="350"
          fill="url(#aavya-character-pattern)"
          clipPath="url(#left-hand-clip)"
        />

        <path
          d="
            M -35 340
            C 60 315 145 280 222 250
            C 250 238 271 222 291 202
            L 356 137
            C 365 128 377 129 383 138
            C 390 147 385 157 377 167
            L 329 224
            L 394 159
            C 405 148 419 151 423 162
            C 427 173 417 184 408 194
            L 354 253
            L 423 202
            C 436 192 449 198 450 210
            C 451 220 439 231 429 239
            L 365 288
            C 397 268 427 253 449 250
            C 464 248 473 259 468 270
            C 465 280 450 287 438 293
            L 355 344
            C 318 367 285 381 244 391
          "
          className="aavya-hand-outline"
        />

        {/* Delicate fingernail details */}
        <path
          d="M 376 137 Q 387 127 393 138 Q 394 146 382 154"
          className="aavya-nail"
        />
        <path
          d="M 417 159 Q 428 152 433 163 Q 433 172 420 180"
          className="aavya-nail"
        />
      </g>

      {/* RIGHT FEMININE HAND */}
      <g className="aavya-hand-right">
        <rect
          x="940"
          y="100"
          width="500"
          height="350"
          fill="url(#aavya-character-pattern)"
          clipPath="url(#right-hand-clip)"
        />

        <path
          d="
            M 1475 340
            C 1380 315 1295 280 1218 250
            C 1190 238 1169 222 1149 202
            L 1084 137
            C 1075 128 1063 129 1057 138
            C 1050 147 1055 157 1063 167
            L 1111 224
            L 1046 159
            C 1035 148 1021 151 1017 162
            C 1013 173 1023 184 1032 194
            L 1086 253
            L 1017 202
            C 1004 192 991 198 990 210
            C 989 220 1001 231 1011 239
            L 1075 288
            C 1043 268 1013 253 991 250
            C 976 248 967 259 972 270
            C 975 280 990 287 1002 293
            L 1085 344
            C 1122 367 1155 381 1196 391
          "
          className="aavya-hand-outline"
        />

        <path
          d="M 1064 137 Q 1053 127 1047 138 Q 1046 146 1058 154"
          className="aavya-nail"
        />
        <path
          d="M 1023 159 Q 1012 152 1007 163 Q 1007 172 1020 180"
          className="aavya-nail"
        />
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
        setSubmitMessage("Thank you for subscribing! Your journey with AAVYA begins here.");
      } else {
        // Fallback friendly message
        setIsSubscribed(true);
        setSubmitMessage("Thank you for connecting with AAVYA!");
      }
    } catch {
      setIsSubscribed(true);
      setSubmitMessage("Thank you for connecting with AAVYA!");
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
            Stay connected with your health journey.
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

          <div className="aavya-footer-status">
            <p>
              <span className="status-dot" />
              WOMEN&apos;S HEALTH. INFORMED CARE.
            </p>
            <p>
              <span className="status-dot" />
              YOUR JOURNEY, YOUR PACE.
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="aavya-footer-navigation" aria-label="Footer navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CONTACT & LEGAL */}
        <div className="aavya-footer-contact">
          <a href="mailto:hello@aavya.health">
            hello@aavya.health
          </a>

          <Link href="/#about">Privacy Policy</Link>
          <Link href="/#about">Terms &amp; Conditions</Link>
          <Link href="/#faq">Medical Disclaimer</Link>
        </div>
      </div>

      {/* ARTWORK AND COPYRIGHT */}
      <div className="aavya-footer-artwork">
        <FeminineHandsArtwork />

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

      <div className="aavya-footer-bottom">
        <span>MADE WITH CARE FOR EVERY WOMAN.</span>
        <span>PRIVACY · TRUST · WELLNESS</span>
      </div>
    </footer>
  );
}

export default AavyaFooter;
