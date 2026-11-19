import React from "react";
import { ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[oklch(0.965_0.015_82)] text-[var(--foreground)] pt-14 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-semibold text-base shadow-sm">
                A
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-[var(--foreground)]">
                AAVYA <span className="text-xs font-sans font-medium text-[var(--muted-foreground)] tracking-widest uppercase">HeredityAI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-md">
              AI-assisted multi-generational PCOS risk estimation, clinical symptom intelligence, and trusted specialist connectivity. Bridging the gap between early suspicion and timely clinical diagnosis.
            </p>
            <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)]">
              <ShieldCheck className="size-4 text-[var(--leaf)]" />
              <span>Rotterdam Consensus Aligned • Indian DPDP & HIPAA Security Standards</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li>
                <a href="#assessment-preview" className="hover:text-[var(--primary)]">
                  Preliminary Screener
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[var(--primary)]">
                  Methodology & Pipeline
                </a>
              </li>
              <li>
                <a href="#biomarkers" className="hover:text-[var(--primary)]">
                  4-Quadrant Architecture
                </a>
              </li>
              <li>
                <a href="#physicians" className="hover:text-[var(--primary)]">
                  Verified Specialists
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Emergency */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3">
              Clinical Safety
            </h4>
            <ul className="space-y-2 text-xs text-[var(--muted-foreground)]">
              <li>
                <a href="#faq" className="hover:text-[var(--primary)]">
                  Medical Limitations
                </a>
              </li>
              <li>
                <span className="text-[var(--primary)] font-medium">Emergency: Dial 112 / 108</span>
              </li>
              <li>
                <span>Women&apos;s Helpline: Dial 181</span>
              </li>
              <li>
                <span className="text-[11px] block text-[var(--muted-foreground)] mt-2">
                  Not a substitute for emergency obstetric/gynecologic care.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Clinical Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[color-mix(in_oklab,var(--card)_80%,var(--background))] border border-[var(--border)] text-[11px] text-[var(--muted-foreground)] leading-relaxed mb-8">
          <strong>Mandatory Medical Positioning:</strong> AAVYA – HeredityAI is an educational and preliminary risk stratification screening tool. It does not provide medical diagnoses, treatment prescriptions, or clinical triage. Risk probabilities are statistical algorithmic estimations derived from observational research cohorts. Only a qualified, licensed healthcare professional (such as a certified gynecologist or reproductive endocrinologist) can provide an authoritative medical evaluation under Rotterdam diagnostic criteria.
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--muted-foreground)] gap-3">
          <div>
            &copy; {new Date().getFullYear()} AAVYA Health Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Engineered with care for women&apos;s health</span>
            <Heart className="size-3 text-[var(--primary)] fill-[var(--primary)] inline ml-0.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
