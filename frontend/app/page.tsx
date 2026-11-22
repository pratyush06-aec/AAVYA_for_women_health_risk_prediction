import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { BiomarkerQuadrantSection } from "@/components/landing/BiomarkerQuadrantSection";
import { AssessmentPreviewSection } from "@/components/landing/AssessmentPreviewSection";
import { DoctorNetworkSection } from "@/components/landing/DoctorNetworkSection";
import { PrivacySecuritySection } from "@/components/landing/PrivacySecuritySection";
import { FaqSection } from "@/components/landing/FaqSection";
import { AavyaFooter } from "@/components/landing/AavyaFooter";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-transparent text-[var(--foreground)] selection:bg-[#E99196] selection:text-[#352326]">
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

      {/* 9. AAVYA Signature Footer with Hand Artwork & Newsletter */}
      <AavyaFooter />
    </main>
  );
}
