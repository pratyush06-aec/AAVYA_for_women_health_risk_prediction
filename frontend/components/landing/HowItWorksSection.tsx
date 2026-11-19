import React from "react";
import { ClipboardList, Cpu, Stethoscope, ArrowRight } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { Badge } from "@/components/ui/Badge";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: ClipboardList,
      title: "Guided Multi-Dimensional Assessment",
      description:
        "Answer structured questions spanning menstrual regularity, phenotypic signs (acne, hirsutism, alopecia), metabolic indicators, and maternal/sibling family history. You can also describe symptoms in your own natural words.",
      badge: "User-Centered Screening",
      badgeVariant: "sage" as const,
    },
    {
      number: "02",
      icon: Cpu,
      title: "Calibrated ML Risk Inference",
      description:
        "Our serialized machine learning model computes a probabilistic risk estimate (0%–100%) and stratifies risk into Low, Moderate, or Elevated tiers, highlighting the top factors driving your personalized score.",
      badge: "Validated Research Engine",
      badgeVariant: "coral" as const,
    },
    {
      number: "03",
      icon: Stethoscope,
      title: "Physician-Ready Summary & Connectivity",
      description:
        "Receive a structured summary designed specifically for clinical consultations. Match with verified reproductive endocrinologists and gynecologists in your area for timely, definitive diagnosis.",
      badge: "Doctor Connectivity",
      badgeVariant: "gold" as const,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 border-t border-[var(--border)] bg-[oklch(0.976_0.012_84/0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="neutral" className="mb-3">
            Clear, Transparent Process
          </Badge>
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
              <ClayCard key={step.number} className="relative flex flex-col justify-between p-7">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-display font-bold text-[color-mix(in_oklab,var(--foreground)_25%,transparent)]">
                      {step.number}
                    </span>
                    <Badge variant={step.badgeVariant}>{step.badge}</Badge>
                  </div>

                  <div className="size-12 rounded-xl bg-[color-mix(in_oklab,var(--card)_80%,var(--background))] border border-[var(--border)] flex items-center justify-center mb-5 text-[var(--primary)] shadow-sm">
                    <IconComponent className="size-6" />
                  </div>

                  <h3 className="text-lg font-bold font-display text-[var(--foreground)] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border)] text-xs font-medium text-[var(--primary)] flex items-center gap-1.5">
                  <span>Learn more about this step</span>
                  <ArrowRight className="size-3" />
                </div>
              </ClayCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
