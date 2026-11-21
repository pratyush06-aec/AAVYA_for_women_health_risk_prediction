import React from "react";
import { HeartPulse, Sparkles, Utensils, GitFork, Check } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";

export function BiomarkerQuadrantSection() {
  const quadrants = [
    {
      title: "Quadrant 1: Clinical & Menstrual",
      icon: HeartPulse,
      accent: "text-[var(--primary)]",
      description: "Foundational endocrine and gynecological cycle parameters.",
      features: [
        "Cycle regularity & cycle duration (days)",
        "BMI, height-to-weight ratio & rapid weight fluctuations",
        "Menarche timing & marriage status chronology",
        "Gravida, parity & pregnancy history",
        "Clinical hormonal & ultrasonic correlation markers",
      ],
    },
    {
      title: "Quadrant 2: Phenotypic & Endocrine",
      icon: Sparkles,
      accent: "text-[var(--leaf)]",
      description: "Visible physical manifestations of hyperandrogenism.",
      features: [
        "Hirsutism (excessive facial & body hair growth)",
        "Acanthosis nigricans (cervical and axillary skin darkening)",
        "Persistent adult or cystic acne vulgaris",
        "Diffuse scalp hair thinning (female pattern alopecia)",
        "Mood fluctuation and fatigue indicators",
      ],
    },
    {
      title: "Quadrant 3: Lifestyle & Contextual",
      icon: Utensils,
      accent: "text-[var(--gold-foreground)]",
      description: "Environmental and behavioral dynamics unique to Indian lifestyle.",
      features: [
        "Fast food consumption frequency & dietary habits",
        "Structured physical exercise adherence & frequency",
        "Yoga and holistic movement practice",
        "Sleep quality, disruption & diurnal rhythm stability",
        "Work-related and chronic psychological stress levels",
      ],
    },
    {
      title: "Quadrant 4: Intergenerational Hereditary",
      icon: GitFork,
      accent: "text-[var(--primary)]",
      description: "Multi-generational familial endocrine transmission patterns.",
      features: [
        "First-degree maternal PCOS & irregular cycle lineage",
        "Sister pedigree endocrine & ovarian morphology history",
        "Maternal & paternal grandmother reproductive history",
        "Familial metabolic syndrome (Type 2 diabetes, hypertension)",
        "Family history of unexplained subfertility & early menopause",
      ],
    },
  ];

  return (
    <section id="biomarkers" className="py-20 border-t border-[var(--border)] scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            The 4-Quadrant Multi-Factor Framework
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3">
            PCOS is a complex endocrine-metabolic syndrome. AAVYA looks beyond isolated symptoms by analyzing interrelated data across clinical, phenotypic, environmental, and hereditary domains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quadrants.map((quad, idx) => {
            const Icon = quad.icon;
            return (
              <ClayCard key={idx} className="p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-[var(--surface-highlight)] border border-[rgba(255,235,226,0.8)] flex items-center justify-center shadow-xs">
                        <Icon className={`size-5 ${quad.accent}`} />
                      </div>
                      <h3 className="text-lg font-bold font-display text-[var(--foreground)]">
                        {quad.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-5">
                    {quad.description}
                  </p>

                  <ul className="space-y-2.5">
                    {quad.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--foreground)]">
                        <div className="size-4 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="size-2.5 text-[var(--leaf)]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ClayCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
