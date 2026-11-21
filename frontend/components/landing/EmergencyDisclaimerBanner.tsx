import React from "react";
import { AlertCircle } from "lucide-react";

export function EmergencyDisclaimerBanner() {
  return (
    <div className="bg-[var(--surface-highlight)] border-b border-[rgba(189,115,125,0.2)] text-[var(--foreground)] text-xs py-2 px-4 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4 text-[var(--deep-rose)] shrink-0" />
          <span>
            <strong>Medical Notice:</strong> AAVYA is an AI-assisted statistical risk assessment platform and does NOT provide clinical diagnoses. Always consult a licensed gynecologist or endocrinologist.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[11px] text-[var(--text-secondary)] font-medium">
          Non-Emergency Screening Tool
        </span>
      </div>
    </div>
  );
}
