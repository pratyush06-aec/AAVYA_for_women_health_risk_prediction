import React from "react";
import { EmergencyDisclaimerBanner } from "@/components/landing/EmergencyDisclaimerBanner";
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { BiomarkerQuadrantSection } from "@/components/landing/BiomarkerQuadrantSection";
import { AssessmentPreviewSection } from "@/components/landing/AssessmentPreviewSection";
import { DoctorNetworkSection } from "@/components/landing/DoctorNetworkSection";
import { PrivacySecuritySection } from "@/components/landing/PrivacySecuritySection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FloatingAssistantLauncher } from "@/components/landing/FloatingAssistantLauncher";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-dvh flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[oklch(0.894_0.073_32)] selection:text-[oklch(0.389_0.108_22)]">
      {/* 1. Clinical Disclaimer Top Banner */}
      <EmergencyDisclaimerBanner />

      {/* 2. Sticky Glassmorphic Navbar */}
      <Navbar />

      {/* 3. Hero Section with Fraunces Typography & Tactile Stats */}
      <HeroSection />

      {/* 4. How AAVYA Works (3-Step Clay Cards) */}
      <HowItWorksSection />

      {/* 5. 4-Quadrant Biomarker & Hereditary Architecture */}
      <BiomarkerQuadrantSection />

      {/* 6. Live API Connected Assessment Screener */}
      <AssessmentPreviewSection />

      {/* 7. Doctor Discovery & Connectivity */}
      <DoctorNetworkSection />

      {/* 8. Privacy & Security */}
      <PrivacySecuritySection />

      {/* 9. Interactive FAQ Accordion */}
      <FaqSection />

      {/* 10. Comprehensive Footer */}
      <Footer />

      {/* 11. Persistent Floating AI Health Assistant Launcher (Chatbot FAB) */}
      <FloatingAssistantLauncher />
    </main>
  );
}
