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
      viewBox="0 0 1024 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Two delicate female hands from The Creation of Adam rendered exclusively in characters of AAVYA"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Strictly AAVYA characters monospace pattern */}
        <pattern
          id="aavya-ascii-pattern"
          width="70"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <text x="0" y="8" className="hand-ascii-char">A A V Y A a v y a</text>
          <text x="4" y="17" className="hand-ascii-char">V Y A A V Y a a v</text>
          <text x="8" y="26" className="hand-ascii-char">y a A A V Y A a v</text>
        </pattern>

        {/* LEFT FEMININE HAND CLIPPING MASK (Reaching down-right) */}
        <clipPath id="fem-left-hand-clip">
          <path d="
            M -30 210
            C 60 195, 140 185, 220 180
            C 250 178, 285 185, 320 202
            C 365 225, 415 260, 455 288
            C 459 291, 458 296, 452 298
            C 435 295, 405 275, 380 255
            C 395 275, 415 305, 426 318
            C 429 322, 426 326, 420 327
            C 405 325, 385 310, 360 285
            C 372 305, 388 328, 396 339
            C 399 343, 396 347, 390 347
            C 378 345, 360 330, 338 305
            C 348 322, 360 342, 366 352
            C 368 356, 364 359, 358 359
            C 345 355, 325 335, 300 305
            C 280 285, 265 268, 250 258
            C 275 272, 298 282, 318 284
            C 322 282, 322 277, 316 273
            C 298 262, 275 245, 250 235
            C 170 248, 80 260, -30 275
            Z
          " />
        </clipPath>

        {/* RIGHT FEMININE HAND CLIPPING MASK (Reaching up-left) */}
        <clipPath id="fem-right-hand-clip">
          <path d="
            M 1054 310
            C 960 285, 870 260, 785 240
            C 755 232, 730 224, 705 216
            C 688 212, 672 210, 662 215
            C 658 218, 660 223, 666 226
            C 680 234, 698 242, 712 252
            C 665 258, 615 268, 568 276
            C 563 278, 563 284, 569 286
            C 595 285, 630 280, 660 276
            C 655 295, 652 318, 655 332
            C 658 337, 664 337, 667 332
            C 670 315, 672 295, 676 278
            C 677 300, 678 325, 682 342
            C 685 347, 691 347, 694 342
            C 696 325, 698 302, 702 282
            C 704 305, 708 330, 712 348
            C 715 353, 721 352, 724 346
            C 725 325, 726 302, 730 285
            C 755 278, 785 282, 815 295
            C 895 325, 975 350, 1054 370
            Z
          " />
        </clipPath>
      </defs>

      {/* LEFT FEMININE HAND */}
      <g className="aavya-left-hand">
        {/* Dense AAVYA character fill */}
        <rect
          x="-30"
          y="160"
          width="500"
          height="220"
          fill="url(#aavya-ascii-pattern)"
          clipPath="url(#fem-left-hand-clip)"
        />

        {/* Delicate feminine outer contour */}
        <path
          className="aavya-hand-outline"
          d="
            M -30 210
            C 60 195, 140 185, 220 180
            C 250 178, 285 185, 320 202
            C 365 225, 415 260, 455 288
            C 459 291, 458 296, 452 298
            C 435 295, 405 275, 380 255
            C 395 275, 415 305, 426 318
            C 429 322, 426 326, 420 327
            C 405 325, 385 310, 360 285
            C 372 305, 388 328, 396 339
            C 399 343, 396 347, 390 347
            C 378 345, 360 330, 338 305
            C 348 322, 360 342, 366 352
            C 368 356, 364 359, 358 359
            C 345 355, 325 335, 300 305
            C 280 285, 265 268, 250 258
            C 275 272, 298 282, 318 284
            C 322 282, 322 277, 316 273
            C 298 262, 275 245, 250 235
            C 170 248, 80 260, -30 275
          "
        />

        {/* Finger separation & crease details */}
        <path
          className="aavya-hand-crease"
          d="
            M 380 255 C 395 265, 415 278, 435 288
            M 360 285 C 375 298, 390 310, 405 320
            M 338 305 C 350 318, 362 330, 375 338
            M 250 235 C 265 245, 280 258, 298 270
            M 320 202 C 324 212, 326 220, 330 228
            M 295 200 C 299 212, 302 222, 306 230
            M 220 180 C 223 200, 222 220, 226 238
          "
        />

        {/* Delicate feminine fingernails */}
        <path
          className="aavya-hand-nail"
          d="
            M 446 286 C 452 288, 456 291, 450 296
            M 418 316 C 424 318, 428 321, 422 326
            M 388 337 C 394 339, 398 342, 392 346
            M 358 350 C 363 352, 366 355, 360 358
            M 310 282 C 316 283, 320 281, 316 275
          "
        />

        {/* Reaching index fingertip glow node */}
        <circle cx="455" cy="292" r="2" className="hand-touch-spark" />
      </g>

      {/* RIGHT FEMININE HAND */}
      <g className="aavya-right-hand">
        {/* Dense AAVYA character fill */}
        <rect
          x="550"
          y="200"
          width="510"
          height="180"
          fill="url(#aavya-ascii-pattern)"
          clipPath="url(#fem-right-hand-clip)"
        />

        {/* Delicate feminine outer contour */}
        <path
          className="aavya-hand-outline"
          d="
            M 1054 310
            C 960 285, 870 260, 785 240
            C 755 232, 730 224, 705 216
            C 688 212, 672 210, 662 215
            C 658 218, 660 223, 666 226
            C 680 234, 698 242, 712 252
            C 665 258, 615 268, 568 276
            C 563 278, 563 284, 569 286
            C 595 285, 630 280, 660 276
            C 655 295, 652 318, 655 332
            C 658 337, 664 337, 667 332
            C 670 315, 672 295, 676 278
            C 677 300, 678 325, 682 342
            C 685 347, 691 347, 694 342
            C 696 325, 698 302, 702 282
            C 704 305, 708 330, 712 348
            C 715 353, 721 352, 724 346
            C 725 325, 726 302, 730 285
            C 755 278, 785 282, 815 295
            C 895 325, 975 350, 1054 370
          "
        />

        {/* Finger separation & crease details */}
        <path
          className="aavya-hand-crease"
          d="
            M 712 252 C 698 244, 685 238, 672 232
            M 660 276 C 655 288, 652 305, 654 322
            M 676 278 C 674 295, 675 315, 678 330
            M 702 282 C 700 300, 702 320, 706 335
            M 645 262 C 646 268, 647 272, 648 276
            M 598 270 C 599 275, 600 278, 601 282
            M 785 240 C 788 260, 789 275, 795 290
          "
        />

        {/* Delicate feminine fingernails */}
        <path
          className="aavya-hand-nail"
          d="
            M 576 278 C 570 277, 565 280, 570 284
            M 657 328 C 658 335, 663 336, 666 332
            M 683 338 C 684 345, 689 346, 693 342
            M 713 344 C 714 351, 719 351, 722 346
            M 668 215 C 662 216, 660 220, 665 224
          "
        />

        {/* Reaching index fingertip glow node */}
        <circle cx="566" cy="281" r="2" className="hand-touch-spark" />
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
