"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowRight, Menu, X, User } from "lucide-react";
import { ClayButton } from "@/components/ui/ClayButton";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useUser();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[oklch(0.976_0.012_84/0.88)] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-semibold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl text-[var(--foreground)] tracking-tight">
              AAVYA
            </span>
            <span className="text-[10px] font-sans font-medium text-[var(--muted-foreground)] tracking-widest uppercase -mt-1">
              HeredityAI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[var(--foreground)]">
          <Link
            href="/assessment"
            className="text-[var(--primary)] font-semibold hover:opacity-80 transition-opacity flex items-center gap-1"
          >
            <span>PCOS Assessment</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full font-bold">New</span>
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[var(--primary)] transition-colors duration-150"
          >
            How It Works
          </Link>
          <Link
            href="/#biomarkers"
            className="hover:text-[var(--primary)] transition-colors duration-150"
          >
            4-Quadrant Analysis
          </Link>
          <Link
            href="/doctors"
            className="hover:text-[var(--primary)] transition-colors duration-150 flex items-center gap-1"
          >
            <span>Find Doctors</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">Live</span>
          </Link>
        </nav>

        {/* Right CTA / Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <ClayButton variant="secondary" size="sm" className="gap-1.5">
                  <span>Portal Dashboard</span>
                  <ArrowRight className="size-3.5" />
                </ClayButton>
              </Link>
              <UserButton />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <ClayButton variant="ghost" size="sm" className="gap-1.5">
                  <User className="size-3.5" />
                  <span>Sign In</span>
                </ClayButton>
              </Link>
              <a href="#assessment-preview">
                <ClayButton variant="primary" size="sm">
                  <span>Start Assessment</span>
                  <ArrowRight className="size-3.5" />
                </ClayButton>
              </a>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-[var(--foreground)] hover:bg-[var(--card)]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border)] bg-[var(--card)] px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              How It Works
            </a>
            <a
              href="#biomarkers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              4-Quadrant Analysis
            </a>
            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)] flex items-center justify-between"
            >
              <span>Find Doctors</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">Live</span>
            </Link>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            {isSignedIn ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <ClayButton variant="secondary" size="md" className="w-full">
                  <span>Open Portal Dashboard</span>
                </ClayButton>
              </Link>
            ) : (
              <>
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <ClayButton variant="ghost" size="md" className="w-full">
                    <span>Sign In</span>
                  </ClayButton>
                </Link>
                <a href="#assessment-preview" onClick={() => setMobileMenuOpen(false)}>
                  <ClayButton variant="primary" size="md" className="w-full">
                    <span>Start Assessment</span>
                    <ArrowRight className="size-4" />
                  </ClayButton>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
