"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { ShieldCheck, ArrowRight, RefreshCw, UserCheck } from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { ClayButton } from "@/components/ui/ClayButton";
import { Badge } from "@/components/ui/Badge";
import { syncUserWithNeonDB, submitPatientOnboarding } from "@/lib/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    age: "24",
    date_of_birth: "2002-01-15",
    phone: "",
    blood_group: "B+",
    emergency_contact: "",
    medical_history_summary: "",
  });

  useEffect(() => {
    async function checkUserSync() {
      if (!isLoaded || !user) return;
      try {
        const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
        const account = await syncUserWithNeonDB({
          clerk_id: user.id,
          email: primaryEmail,
          full_name: user.fullName || "AAVYA Member",
          avatar_url: user.imageUrl,
        });

        if (account.role === "DOCTOR") {
          router.replace("/doctor/dashboard");
        } else if (account.is_profile_complete) {
          router.replace("/dashboard");
        }
      } catch (err: unknown) {
        console.error("Sync error:", err);
      } finally {
        setSyncing(false);
      }
    }

    checkUserSync();
  }, [isLoaded, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const email = user.primaryEmailAddress?.emailAddress || "";
      await submitPatientOnboarding(email, {
        age: parseInt(formData.age, 10) || 24,
        date_of_birth: formData.date_of_birth,
        phone: formData.phone,
        blood_group: formData.blood_group,
        emergency_contact: formData.emergency_contact,
        medical_history_summary: formData.medical_history_summary,
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Onboarding submission failed:", err);
      setError(err instanceof Error ? err.message : "Failed to save profile to NeonDB");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || syncing) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-[var(--primary)] animate-spin" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Syncing profile with NeonDB...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div>
              <span className="font-display font-bold text-lg text-[var(--foreground)] tracking-tight">
                AAVYA Patient Onboarding
              </span>
              <span className="text-xs text-[var(--muted-foreground)] block">
                Logged in as {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
          <UserButton />
        </div>

        <ClayCard className="p-6 sm:p-8">
          <div className="mb-6">
            <Badge variant="sage" className="mb-2">
              <UserCheck className="size-3 text-[var(--leaf)]" />
              <span>Step 1 of 1 • Profile Completion</span>
            </Badge>
            <h1 className="text-2xl font-bold font-display text-[var(--foreground)]">
              Welcome to AAVYA, {user?.firstName || "Patient"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1.5 leading-relaxed">
              To calibrate our multi-generational risk model and ensure accurate clinical summaries, please provide a few baseline medical details. These are stored securely in NeonDB.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  required
                  min="12"
                  max="70"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Blood Group
                </label>
                <select
                  value={formData.blood_group}
                  onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                >
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Emergency Contact Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 00000 (Parent, Spouse, or Guardian)"
                value={formData.emergency_contact}
                onChange={(e) => setFormData({ ...formData, emergency_contact: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Known Medical History or Endocrine Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Mention previous ultrasound findings, thyroid conditions, or familial diabetes..."
                value={formData.medical_history_summary}
                onChange={(e) => setFormData({ ...formData, medical_history_summary: e.target.value })}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="pt-4">
              <ClayButton
                type="submit"
                variant="primary"
                size="md"
                className="w-full gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" />
                    <span>Saving to NeonDB...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Onboarding & Enter Dashboard</span>
                    <ArrowRight className="size-4" />
                  </>
                )}
              </ClayButton>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)]">
            <ShieldCheck className="size-3.5 text-[var(--leaf)]" />
            <span>Encrypted at rest in NeonDB PostgreSQL • Zero commercialization</span>
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
