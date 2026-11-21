import React from "react";
import { ClipboardList, Cpu, Stethoscope } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: "Guided Multi-Dimensional Assessment",
      description:
        "Answer structured questions spanning menstrual regularity, phenotypic signs (acne, hirsutism, alopecia), metabolic indicators, and maternal/sibling family history. You can also describe symptoms in your own natural words.",
    },
    {
      number: "02",
      icon: Cpu,
      title: "Calibrated ML Risk Inference",
      description:
        "Our serialized machine learning model computes a probabilistic risk estimate (0%–100%) and stratifies risk into Low, Moderate, or Elevated tiers, highlighting the top factors driving your personalized score.",
    },
    {
      number: "03",
      icon: Stethoscope,
      title: "Physician-Ready Summary & Connectivity",
      description:
        "Receive a structured summary designed specifically for clinical consultations. Match with verified reproductive endocrinologists and gynecologists in your area for timely, definitive diagnosis.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-[var(--border)] bg-[var(--surface-secondary)]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            How AAVYA Empowers Your Healthcare Journey
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-3">
            Transforming uncertainty into objective clinical data you and your healthcare provider can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const IconComponent = step.icon;
            return (
              <ClayCard key={step.number} interactive className="relative flex flex-col justify-between p-7">
                <div>
                  <div className="mb-4">
                    <span className="text-3xl font-display font-bold text-[var(--text-muted)] opacity-60">
                      {step.number}
                    </span>
                  </div>

                  <div className="size-12 rounded-2xl bg-[var(--surface-highlight)] border border-[rgba(255,235,226,0.8)] flex items-center justify-center mb-5 text-[var(--deep-rose)] shadow-sm">
                    <IconComponent className="size-6" />
                  </div>

                  <h3 className="text-lg font-bold font-display text-[var(--foreground)] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ClayCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
