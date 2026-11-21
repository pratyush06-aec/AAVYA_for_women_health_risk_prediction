import React from "react";
import { MapPin, Calendar, Star } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { ClayButton } from "@/components/ui/ClayButton";

export function DoctorNetworkSection() {
  const doctors = [
    {
      name: "Dr. Ananya Sen, MD",
      specialty: "Reproductive Endocrinologist",
      experience: "14 yrs experience",
      location: "Indiranagar, Bengaluru",
      rating: "4.9",
      verified: true,
      focus: "PCOS Phenotyping & Insulin Resistance",
    },
    {
      name: "Dr. Meera Patel, MS, DGO",
      specialty: "Senior Gynecologist & Fertility Specialist",
      experience: "18 yrs experience",
      location: "Bandra West, Mumbai",
      rating: "4.95",
      verified: true,
      focus: "Adolescent PCOS & Ovulatory Restoration",
    },
    {
      name: "Dr. Rohini Mukherjee, MD, DM",
      specialty: "Clinical Endocrinologist",
      experience: "11 yrs experience",
      location: "Saket, New Delhi",
      rating: "4.88",
      verified: true,
      focus: "Hormonal Dysregulation & Metabolic Syndrome",
    },
  ];

  return (
    <section id="physicians" className="py-20 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[var(--foreground)]">
            Connect Directly with Endocrine Specialists
          </h2>
          <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2.5">
            Closing the diagnostic gap: share your objective AAVYA assessment report directly with accredited specialists for definitive clinical evaluation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {doctors.map((doc, idx) => (
            <ClayCard key={idx} className="p-6 flex flex-col justify-between">
              <div>
                <div className="mb-3">
                  <h3 className="text-base font-bold font-display text-[var(--foreground)]">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-medium text-[var(--primary)] mt-0.5">
                    {doc.specialty}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-[var(--muted-foreground)] my-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-[var(--muted-foreground)] shrink-0" />
                    <span>{doc.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="size-3.5 text-[var(--gold-foreground)] fill-[var(--gold)] shrink-0" />
                    <span className="font-semibold text-[var(--foreground)]">{doc.rating}</span>
                    <span>({doc.experience})</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[color-mix(in_oklab,var(--background)_70%,var(--muted))] border border-[var(--border)] text-xs text-[var(--foreground)]">
                  <span className="font-semibold block text-[11px] text-[var(--muted-foreground)] mb-0.5">
                    Clinical Focus
                  </span>
                  {doc.focus}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[var(--border)]">
                <ClayButton variant="secondary" size="sm" className="w-full gap-1.5">
                  <Calendar className="size-3.5" />
                  <span>Book Consultation</span>
                </ClayButton>
              </div>
            </ClayCard>
          ))}
        </div>
      </div>
    </section>
  );
}
