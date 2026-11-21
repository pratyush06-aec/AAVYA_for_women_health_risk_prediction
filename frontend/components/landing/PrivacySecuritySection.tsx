import React from "react";
import { Lock, EyeOff, ShieldCheck, FileCheck } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";

export function PrivacySecuritySection() {
  const points = [
    {
      icon: EyeOff,
      title: "Anonymous Assessment Option",
      description: "Screen for PCOS risk without creating an account or providing personally identifiable information (PII).",
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Health telemetry and assessment inputs are encrypted in transit via TLS 1.3 and at rest with AES-256.",
    },
    {
      icon: ShieldCheck,
      title: "Zero Data Commercialization",
      description: "We never monetize, share, or sell health data. Your biological indicators belong strictly to you.",
    },
    {
      icon: FileCheck,
      title: "Clinical Consent Architecture",
      description: "Only you decide if and when to generate a clinical handover summary for your chosen doctor.",
    },
  ];

  return (
    <section className="py-20 border-t border-[var(--border)] bg-[var(--surface-secondary)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            Privacy-First Health Architecture
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2.5">
            Your reproductive and metabolic health data deserves the highest echelon of security and patient dignity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <ClayCard key={idx} className="p-6">
                <div className="size-10 rounded-xl bg-[var(--secondary)] text-[var(--leaf)] flex items-center justify-center mb-4">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-sm font-bold font-display text-[var(--foreground)] mb-1.5">
                  {pt.title}
                </h3>
                <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                  {pt.description}
                </p>
              </ClayCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
