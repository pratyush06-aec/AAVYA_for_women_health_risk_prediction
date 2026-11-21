"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowRight, Menu, X, User, LayoutDashboard, Stethoscope } from "lucide-react";
import { ClayButton } from "@/components/ui/ClayButton";

const DESIGNATED_DOCTOR_EMAILS = [
  "pratyush0306@gmail.com",
  "pratyush032006@gmail.com",
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || "";
  const role = (user?.publicMetadata?.role as string)?.toUpperCase();
  const isDoctor = role === "DOCTOR" || DESIGNATED_DOCTOR_EMAILS.includes(userEmail);

  return (
    <header className="sticky top-3 sm:top-4 z-50 px-3 sm:px-6 w-full max-w-6xl mx-auto pointer-events-none">
      <div className="pointer-events-auto rounded-full border border-[var(--border)]/70 bg-[color-mix(in_oklab,var(--card)_50%,transparent)] backdrop-blur-xl shadow-lg shadow-black/[0.03] px-5 sm:px-6 h-16 flex items-center justify-between transition-all duration-200">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-semibold text-lg shadow-sm transition-transform duration-200 group-hover:scale-105">
            A
          </div>
          <span className="font-display font-bold text-xl text-[var(--foreground)] tracking-tight">
            AAVYA
          </span>
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
            href="/#about"
            className="hover:text-[var(--primary)] transition-colors duration-150"
          >
            About
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
            <div className="flex items-center">
              {/* Profile icon with custom dropdown menu item routing to doctor/student dashboard */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "size-9 ring-2 ring-[var(--primary)]/20 hover:ring-[var(--primary)]/50 transition-all",
                  },
                }}
              >
                <UserButton.MenuItems>
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
            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <ClayButton variant="ghost" size="sm" className="gap-1.5">
                  <User className="size-3.5" />
                  <span>Sign In</span>
                </ClayButton>
              </Link>
              <Link href="/assessment">
                <ClayButton variant="primary" size="sm" className="gap-1.5">
                  <span>Start Assessment</span>
                  <ArrowRight className="size-3.5" />
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
              href="/assessment"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--primary)] font-semibold flex items-center justify-between"
            >
              <span>PCOS Assessment</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-full font-bold">New</span>
            </Link>
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              About
            </Link>
            <Link
              href="/doctors"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)] flex items-center justify-between"
            >
              <span>Find Doctors</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full font-bold">Live</span>
            </Link>
            <a
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[var(--foreground)] hover:text-[var(--primary)]"
            >
              FAQ
            </a>
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
                <Link href="/assessment" onClick={() => setMobileMenuOpen(false)}>
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
