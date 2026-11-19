import React from "react";
import { ArrowRight, Dna, Activity, Users, Sparkles, CheckCircle2 } from "lucide-react";
import { ClayButton } from "@/components/ui/ClayButton";
import { Badge } from "@/components/ui/Badge";
import { ClayCard } from "@/components/ui/ClayCard";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle Top Badge */}
          <div className="inline-flex items-center gap-2">
            <Badge variant="sage">
              <Sparkles className="size-3.5 text-[var(--leaf)]" />
              <span>Multi-Generational Clinical Intelligence</span>
            </Badge>
          </div>

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
            AAVYA unites 280+ clinical biomarkers, Indian lifestyle contexts, and 3-generation hereditary mapping to provide calibrated PCOS risk estimation and direct connectivity to qualified reproductive specialists.
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <a href="#assessment-preview" className="w-full sm:w-auto">
              <ClayButton variant="primary" size="lg" className="w-full sm:w-auto gap-2.5">
                <span>Begin Confidential Assessment</span>
                <ArrowRight className="size-4" />
              </ClayButton>
            </a>
            <a href="#physicians" className="w-full sm:w-auto">
              <ClayButton variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
                <span>Explore Specialist Network</span>
              </ClayButton>
            </a>
          </div>

          {/* Reassurance Micro-Copy */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--leaf)]" />
              100% Private & Anonymous Screening
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--leaf)]" />
              Validated Against Clinical Callsets
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-[var(--leaf)]" />
              No App Download Required
            </span>
          </div>
        </div>

        {/* Hero Tactile Stats Row */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          <ClayCard className="flex items-start gap-4">
            <div className="size-11 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center shrink-0">
              <Activity className="size-5 text-[var(--leaf)]" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-[var(--foreground)] tabular-nums">
                280+
              </div>
              <div className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
                Multi-System Features
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">
                Clinical markers, metabolic parameters, lifestyle patterns & phenotypic signs.
              </div>
            </div>
          </ClayCard>

          <ClayCard className="flex items-start gap-4">
            <div className="size-11 rounded-full bg-[color-mix(in_oklab,var(--coral)_60%,var(--card))] text-[var(--coral-foreground)] flex items-center justify-center shrink-0">
              <Dna className="size-5 text-[var(--primary)]" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-[var(--foreground)] tabular-nums">
                3 Generations
              </div>
              <div className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
                Hereditary Pedigree
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">
                Family history modeling across maternal, fraternal, and sibling endocrine lineages.
              </div>
            </div>
          </ClayCard>

          <ClayCard className="flex items-start gap-4">
            <div className="size-11 rounded-full bg-[color-mix(in_oklab,var(--gold)_55%,var(--card))] text-[var(--gold-foreground)] flex items-center justify-center shrink-0">
              <Users className="size-5 text-[var(--gold-foreground)]" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display text-[var(--foreground)] tabular-nums">
                97.1%
              </div>
              <div className="text-xs font-semibold text-[var(--foreground)] mt-0.5">
                Cross-Validated Accuracy
              </div>
              <div className="text-xs text-[var(--muted-foreground)] mt-1">
                Calibrated logistic regression model trained on comprehensive clinical cohorts.
              </div>
            </div>
          </ClayCard>
        </div>
      </div>
    </section>
  );
}
