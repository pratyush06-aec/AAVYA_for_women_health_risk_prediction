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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="clay-card p-6 sm:p-8 text-left bg-[var(--card)]/90 backdrop-blur-sm border border-[var(--border)] relative overflow-hidden">
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
              <div className="p-4 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors">
                <div className="size-10 rounded-xl bg-[var(--secondary)] flex items-center justify-center text-[var(--leaf)] mb-3">
                  <Activity className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  1. Ovulatory Dysfunction
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Infrequent, irregular, or missed menstrual cycles (&gt;35 days or &lt;8 periods/year). Chronic anovulation impacts natural progesterone balance and reproductive health.
                </p>
                <span className="inline-block mt-3 text-[11px] font-medium text-[var(--leaf)]">
                  Marker: Oligo- / Amenorrhea
                </span>
              </div>

              {/* Pillar 2: Androgen Excess */}
              <div className="p-4 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors">
                <div className="size-10 rounded-xl bg-[color-mix(in_oklab,var(--coral)_60%,var(--card))] flex items-center justify-center text-[var(--primary)] mb-3">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  2. Hyperandrogenism
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Elevated androgen (testosterone/DHEA-S) levels manifesting physically as hirsutism (excess facial and body hair), persistent cystic acne, and androgenic alopecia.
                </p>
                <span className="inline-block mt-3 text-[11px] font-medium text-[var(--primary)]">
                  Marker: Clinical or Biochemical
                </span>
              </div>

              {/* Pillar 3: Polycystic Ovarian Morphology & Metabolism */}
              <div className="p-4 rounded-xl bg-[var(--background)]/80 border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors sm:col-span-2 lg:col-span-1">
                <div className="size-10 rounded-xl bg-[color-mix(in_oklab,var(--gold)_55%,var(--card))] flex items-center justify-center text-[var(--gold-foreground)] mb-3">
                  <Dna className="size-5" />
                </div>
                <h3 className="font-display font-bold text-sm text-[var(--foreground)]">
                  3. Ovarian & Metabolic Triad
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
                  Ultrasound appearance of multiple immature follicles (&quot;string-of-pearls&quot;) paired with insulin resistance in over 70% of cases, driving fatigue and weight shifts.
                </p>
                <span className="inline-block mt-3 text-[11px] font-medium text-[var(--gold-foreground)]">
                  Marker: PCOM & Insulin Resistance
                </span>
              </div>
            </div>

            {/* Seamless bridge to 4-Quadrant Framework */}
            <div className="mt-6 pt-5 border-t border-[var(--border)] flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-[var(--muted-foreground)]">
                Integrated with AAVYA&apos;s multi-dimensional risk architecture:
              </span>
              <a
                href="#biomarkers"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-semibold hover:opacity-80 transition-opacity"
              >
                <span>Explore 4-Quadrant Framework</span>
                <ArrowRight className="size-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
