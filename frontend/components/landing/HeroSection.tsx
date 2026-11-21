"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { ArrowRight, Activity, Sparkles, Dna } from "lucide-react";
import { ClayButton } from "@/components/ui/ClayButton";

export function HeroSection() {
  const { isSignedIn } = useUser();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Ambient Floating Clay Orbs */}
      <div
        className="clay-orb absolute -top-10 -left-10 size-48 opacity-45 pointer-events-none hidden md:block"
        aria-hidden="true"
      />
      <div
        className="clay-blob absolute top-1/3 -right-16 size-64 opacity-35 pointer-events-none hidden lg:block"
        aria-hidden="true"
      />
      <div
        className="clay-orb absolute bottom-8 left-8 size-32 opacity-30 pointer-events-none hidden md:block"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.12]">
            Compassionate,{" "}
            <span className="italic font-normal text-[var(--primary)]">
              hereditary-aware
            </span>{" "}
            intelligence for women’s endocrine health.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed mx-auto">
            AAVYA unites clinical biomarkers, Indian lifestyle contexts, and 3-generation hereditary mapping to provide calibrated PCOS risk estimation and direct connectivity to qualified reproductive specialists.
          </p>

          {/* Dual CTAs (Auth Protected) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href={isSignedIn ? "/assessment" : "/sign-in?redirect_url=/assessment"}
              className="w-full sm:w-auto"
            >
              <ClayButton variant="primary" size="lg" className="w-full sm:w-auto gap-2.5">
                <span>Begin Confidential Assessment</span>
                <ArrowRight className="size-4" />
              </ClayButton>
            </Link>
            <Link
              href={isSignedIn ? "/doctors" : "/sign-in?redirect_url=/doctors"}
              className="w-full sm:w-auto"
            >
              <ClayButton variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                <span>Explore Specialist Network</span>
              </ClayButton>
            </Link>
          </div>
        </div>

        {/* Educational Eye-Catching Showcase: What is PCOS? (About Section) */}
        <div id="about" className="mt-14 max-w-5xl mx-auto scroll-mt-28">
          <div className="clay-card p-6 sm:p-8 text-left relative overflow-hidden">
            {/* Header */}
            <div className="pb-6 border-b border-[var(--border)]">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] tracking-tight">
                What is Polycystic Ovary Syndrome (PCOS)?
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1.5 max-w-2xl leading-relaxed">
                PCOS is a complex, whole-body endocrine and metabolic condition affecting an estimated{" "}
                <span className="font-semibold text-[var(--foreground)]">1 in 5 Indian women</span>. Far beyond just ovaries, it influences insulin regulation, hormone synthesis, cycles, and hereditary risk.
              </p>
            </div>

            {/* 3 Pillar Cards for PCOS Core Manifestations */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Pillar 1: Ovulatory & Menstrual Patterns */}
              <div className="clay-card-inset p-4.5 transition-transform hover:-translate-y-1">
                <div className="size-10 rounded-xl bg-[var(--surface-primary)] flex items-center justify-center text-[var(--leaf)] mb-3 shadow-xs">
                  <Activity className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  1. Ovulatory Dysfunction
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Infrequent, irregular, or missed menstrual cycles (&gt;35 days or &lt;8 periods/year). Chronic anovulation impacts natural progesterone balance and reproductive health.
                </p>
                <span className="inline-block mt-3 text-[11px] font-semibold text-[var(--leaf)]">
                  Marker: Oligo- / Amenorrhea
                </span>
              </div>

              {/* Pillar 2: Androgen Excess */}
              <div className="clay-card-inset p-4.5 transition-transform hover:-translate-y-1">
                <div className="size-10 rounded-xl bg-[var(--surface-highlight)] flex items-center justify-center text-[var(--deep-rose)] mb-3 shadow-xs">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  2. Hyperandrogenism
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Elevated androgen (testosterone/DHEA-S) levels manifesting physically as hirsutism (excess facial and body hair), persistent cystic acne, and androgenic alopecia.
                </p>
                <span className="inline-block mt-3 text-[11px] font-semibold text-[var(--deep-rose)]">
                  Marker: Clinical or Biochemical
                </span>
              </div>

              {/* Pillar 3: Polycystic Ovarian Morphology & Metabolism */}
              <div className="clay-card-inset p-4.5 transition-transform hover:-translate-y-1 sm:col-span-2 lg:col-span-1">
                <div className="size-10 rounded-xl bg-[var(--warm-cream)] flex items-center justify-center text-[var(--dark-text)] mb-3 shadow-xs">
                  <Dna className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  3. Ovarian & Metabolic Triad
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Ultrasound appearance of multiple immature follicles (&quot;string-of-pearls&quot;) paired with insulin resistance in over 70% of cases, driving fatigue and weight shifts.
                </p>
                <span className="inline-block mt-3 text-[11px] font-semibold text-[var(--dark-text)]">
                  Marker: PCOM & Insulin Resistance
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
