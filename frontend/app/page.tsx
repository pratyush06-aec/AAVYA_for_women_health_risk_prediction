import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { BiomarkerQuadrantSection } from "@/components/landing/BiomarkerQuadrantSection";
import { AssessmentPreviewSection } from "@/components/landing/AssessmentPreviewSection";
import { DoctorNetworkSection } from "@/components/landing/DoctorNetworkSection";
import { PrivacySecuritySection } from "@/components/landing/PrivacySecuritySection";
import { FaqSection } from "@/components/landing/FaqSection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[oklch(0.894_0.073_32)] selection:text-[oklch(0.389_0.108_22)]">
      {/* 1. Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* 2. Hero Section with PCOS Clinical Intelligence (About Foundation) */}
      <HeroSection />

      {/* 3. 4-Quadrant Biomarker & Hereditary Architecture (Added Under About Section) */}
      <BiomarkerQuadrantSection />

      {/* 4. How AAVYA Works (3-Step Clay Cards) */}
      <HowItWorksSection />

      {/* 5. Live API Connected Assessment Screener */}
      <AssessmentPreviewSection />

      {/* 6. Doctor Discovery & Connectivity */}
      <DoctorNetworkSection />

      {/* 7. Privacy & Security */}
      <PrivacySecuritySection />

      {/* 8. Interactive FAQ Accordion (Opens on Hover) */}
      <FaqSection />

      {/* 9. Comprehensive Footer */}
      <Footer />
    </main>
  );
}
