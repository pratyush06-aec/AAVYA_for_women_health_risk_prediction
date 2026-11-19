import React from "react";
import { AlertCircle } from "lucide-react";

export function EmergencyDisclaimerBanner() {
  return (
    <div className="bg-[color-mix(in_oklab,var(--coral)_35%,var(--background))] border-b border-[color-mix(in_oklab,var(--coral)_60%,var(--border))] text-[var(--foreground)] text-xs py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-[var(--primary)] shrink-0" />
          <span>
            <strong>Medical Notice:</strong> AAVYA is an AI-assisted statistical risk assessment platform and does NOT provide clinical diagnoses. Always consult a licensed gynecologist or endocrinologist.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[var(--muted-foreground)]">
          Non-Emergency Screening Tool
        </span>
      </div>
    </div>
  );
}
