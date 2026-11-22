"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowRight, Menu, X, User, LayoutDashboard, Stethoscope } from "lucide-react";
import { ClayButton } from "@/components/ui/ClayButton";
import { useThemeInfo } from "@/components/theme/ThemeProvider";

const DESIGNATED_DOCTOR_EMAILS = [
  "pratyush0306@gmail.com",
  "pratyush032006@gmail.com",
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { switchLabel, icon: themeIcon, rotateTheme } = useThemeInfo();

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  const role = (user?.publicMetadata?.role as string)?.toUpperCase();
  const isDoctor = role === "DOCTOR" || DESIGNATED_DOCTOR_EMAILS.includes(userEmail);

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto pointer-events-none transition-all duration-300">
      <div className="pointer-events-auto rounded-full border border-[rgba(255,245,240,0.55)] bg-[rgba(248,212,200,0.25)] backdrop-blur-xl shadow-[0_12px_32px_rgba(178,105,112,0.18),-4px_-4px_16px_rgba(255,250,248,0.80),inset_0_1px_1.5px_rgba(255,255,255,0.85)] px-6 sm:px-8 h-16 flex items-center justify-between w-full transition-all duration-200 gap-4 sm:gap-6">
        {/* Left: Brand Logo (Only AAVYA text) */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center group">
            <span className="font-display font-bold text-2xl text-[var(--foreground)] tracking-tight hover:text-[var(--primary)] transition-colors">
              AAVYA
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Equally Spaced & Non-congested) */}
        <nav className="hidden md:flex items-center justify-center flex-1 gap-8 lg:gap-12 text-sm font-medium text-[var(--foreground)]">
          <Link
            href={isSignedIn ? "/assessment" : "/sign-in?redirect_url=/assessment"}
            className="text-[var(--primary)] font-semibold hover:opacity-80 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>PCOS Assessment</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--surface-highlight)] text-[var(--deep-rose)] border border-[rgba(189,115,125,0.25)] leading-none shrink-0 shadow-xs">
              New
            </span>
          </Link>
          <Link
            href="/#about"
            className="hover:text-[var(--primary)] transition-colors duration-150 whitespace-nowrap"
          >
            About
          </Link>
          <Link
            href={isSignedIn ? "/doctors" : "/sign-in?redirect_url=/doctors"}
            className="hover:text-[var(--primary)] transition-colors duration-150 flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Find Doctors</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--surface-secondary)] text-[var(--leaf)] border border-[rgba(91,130,102,0.25)] leading-none shrink-0 shadow-xs">
              Live
            </span>
          </Link>
        </nav>

        {/* Right: CTA / Auth Controls */}
        <div className="hidden sm:flex items-center justify-end gap-3 shrink-0">
          {isSignedIn ? (
            <div className="flex items-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-8 ring-2 ring-[var(--primary)]/30 hover:ring-[var(--primary)]/60 transition-all shadow-md",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Action
                    label={switchLabel}
                    labelIcon={themeIcon}
                    onClick={rotateTheme}
                  />
                  {isDoctor ? (
                    <>
                      <UserButton.Link
                        label="Doctor Clinical Dashboard"
                        href="/doctor/dashboard"
                        labelIcon={<Stethoscope className="size-4 text-[var(--leaf)]" />}
                      />
                      <UserButton.Link
                        label="Student / Patient Dashboard"
                        href="/dashboard"
                        labelIcon={<LayoutDashboard className="size-4 text-[var(--primary)]" />}
                      />
                    </>
                  ) : (
                    <UserButton.Link
                      label="Student Health Dashboard"
                      href="/dashboard"
                      labelIcon={<LayoutDashboard className="size-4 text-[var(--primary)]" />}
                    />
                  )}
                </UserButton.MenuItems>
              </UserButton>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link href="/sign-in">
                <ClayButton
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3.5 py-1 text-xs font-semibold whitespace-nowrap min-h-[32px] gap-1.5 shadow-sm"
                >
                  <User className="size-3.5 shrink-0" />
                  <span>Sign In</span>
                </ClayButton>
              </Link>
              <Link href="/sign-in?redirect_url=/assessment">
                <ClayButton
                  variant="primary"
                  size="sm"
                  className="h-8 px-3.5 py-1 text-xs font-semibold whitespace-nowrap min-h-[32px] gap-1.5 shadow-sm"
                >
                  <span>Start Assessment</span>
                  <ArrowRight className="size-3.5 shrink-0" />
                </ClayButton>
              </Link>
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
        <div className="pointer-events-auto mt-2 rounded-2xl border border-[var(--border)]/80 bg-[color-mix(in_oklab,var(--card)_92%,transparent)] backdrop-blur-xl px-5 py-4 shadow-xl space-y-4 md:hidden">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link
              href={isSignedIn ? "/assessment" : "/sign-in?redirect_url=/assessment"}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--primary)] font-semibold flex items-center justify-between"
            >
              <span>PCOS Assessment</span>
              <span className="text-[10px] bg-[var(--surface-highlight)] text-[var(--deep-rose)] px-1.5 py-0.5 rounded-full font-bold border border-[rgba(189,115,125,0.2)]">New</span>
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              About
            </Link>
            <Link
              href={isSignedIn ? "/doctors" : "/sign-in?redirect_url=/doctors"}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)] flex items-center justify-between"
            >
              <span>Find Doctors</span>
              <span className="text-[10px] bg-[var(--surface-secondary)] text-[var(--leaf)] px-1.5 py-0.2 rounded-full font-bold border border-[rgba(91,130,102,0.25)]">Live</span>
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              FAQ
            </Link>
          </nav>
          <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
            {isSignedIn ? (
              <div className="flex flex-col gap-2">
                {isDoctor ? (
                  <>
                    <Link href="/doctor/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <ClayButton variant="primary" size="md" className="w-full gap-2 justify-center">
                        <Stethoscope className="size-4" />
                        <span>Doctor Clinical Dashboard</span>
                      </ClayButton>
                    </Link>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <ClayButton variant="secondary" size="md" className="w-full gap-2 justify-center">
                        <LayoutDashboard className="size-4" />
                        <span>Student Health Dashboard</span>
                      </ClayButton>
                    </Link>
                  </>
                ) : (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <ClayButton variant="secondary" size="md" className="w-full gap-2 justify-center">
                      <LayoutDashboard className="size-4" />
                      <span>Student Health Dashboard</span>
                    </ClayButton>
                  </Link>
                )}
                <div className="flex items-center justify-between pt-2 px-1 border-t border-[var(--border)]">
                  <span className="text-xs text-[var(--muted-foreground)]">Account Settings</span>
                  <UserButton />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <ClayButton variant="ghost" size="md" className="w-full justify-center">
                    <span>Sign In</span>
                  </ClayButton>
                </Link>
                <Link href="/sign-in?redirect_url=/assessment" onClick={() => setMobileMenuOpen(false)}>
                  <ClayButton variant="primary" size="md" className="w-full gap-2 justify-center">
                    <span>Start Assessment</span>
                    <ArrowRight className="size-4" />
                  </ClayButton>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
