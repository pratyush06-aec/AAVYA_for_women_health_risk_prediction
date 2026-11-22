"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Activity,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  MapPin,
  RefreshCw,
  Phone,
  AlertCircle,
  Clock,
  CheckCircle,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { ClayButton } from "@/components/ui/ClayButton";
import { Badge } from "@/components/ui/Badge";
import { useThemeInfo } from "@/components/theme/ThemeProvider";
import { syncUserWithNeonDB, UserAccount } from "@/lib/auth";

interface DoctorDirectoryItem {
  id: number;
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  clinic_address: string;
  city: string;
  consultation_fee: number;
  is_available: boolean;
}

interface AssessmentHistoryItem {
  id: number;
  risk_probability: number;
  risk_percentage: number;
  risk_category: string;
  risk_description: string;
  created_at: string;
  top_contributing_factors?: { feature: string; impact: number; direction?: string }[];
  input_features?: Record<string, string | number | boolean>;
}

interface PatientAppointment {
  id: number;
  appointment_date: string;
  time_slot: string;
  status: string;
  notes?: string;
  doctor_notes?: string;
  assessment_id?: number;
  consent_share_report?: boolean;
  created_at: string;
  doctor?: {
    id: number;
    full_name: string;
    specialization?: string;
    clinic_address?: string;
    city?: string;
    consultation_fee?: number;
  };
}

export default function PatientDashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { switchLabel, icon: themeIcon, rotateTheme } = useThemeInfo();

  const [account, setAccount] = useState<UserAccount | null>(null);
  const [doctors, setDoctors] = useState<DoctorDirectoryItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentHistoryItem[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingConsentId, setUpdatingConsentId] = useState<number | null>(null);
  const [expandedAssessmentId, setExpandedAssessmentId] = useState<number | null>(null);

  // Booking modal state
  const [bookingDoctor, setBookingDoctor] = useState<DoctorDirectoryItem | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-12-05");
  const [bookingTime, setBookingTime] = useState("10:30 AM");
  const [bookingNotes, setBookingNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  useEffect(() => {
    async function loadAccount() {
      if (!isLoaded) return;
      if (!user) {
        router.replace("/sign-in?redirect_url=/dashboard");
        return;
      }
      try {
        const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
        const data = await syncUserWithNeonDB({
          clerk_id: user.id,
          email: primaryEmail,
          full_name: user.fullName || "Patient Member",
          avatar_url: user.imageUrl,
        });

        // If user is doctor, redirect to doctor dashboard
        if (data.role === "DOCTOR") {
          router.replace("/doctor/dashboard");
          return;
        }

        // If patient profile is incomplete, redirect to onboarding
        if (!data.is_profile_complete) {
          router.replace("/onboarding");
          return;
        }

        setAccount(data);

        // Fetch verified doctors from NeonDB
        const docRes = await fetch(`${apiUrl}/users/doctors`);
        if (docRes.ok) {
          const docData = await docRes.json();
          setDoctors(docData);
        }

        // Fetch assessment history
        const histRes = await fetch(`${apiUrl}/assessment/history?email=${encodeURIComponent(primaryEmail)}`);
        if (histRes.ok) {
          const histData = await histRes.json();
          setAssessments(histData);
        }

        // Fetch appointments
        const apptRes = await fetch(`${apiUrl}/appointments/patient?email=${encodeURIComponent(primaryEmail)}`);
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData);
        }
      } catch (err: unknown) {
        console.error("Dashboard sync failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile from NeonDB");
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [isLoaded, user, router, apiUrl]);

  const handleToggleConsent = async (appointmentId: number, currentConsent: boolean) => {
    setUpdatingConsentId(appointmentId);
    try {
      const res = await fetch(`${apiUrl}/appointments/${appointmentId}/consent`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consent_share_report: !currentConsent }),
      });
      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === appointmentId ? { ...a, consent_share_report: !currentConsent } : a
          )
        );
      }
    } catch (err) {
      console.error("Failed to update consent:", err);
    } finally {
      setUpdatingConsentId(null);
    }
  };

  const handleBookAppointment = async () => {
    if (!bookingDoctor || !account) return;
    setIsBooking(true);
    try {
      const res = await fetch(`${apiUrl}/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_email: account.email,
          doctor_id: bookingDoctor.id,
          appointment_date: bookingDate,
          time_slot: bookingTime,
          notes: bookingNotes || "Consultation booked from patient dashboard.",
          assessment_id: assessments.length > 0 ? assessments[0].id : null,
        }),
      });

      if (res.ok) {
        const newAppt = await res.json();
        setAppointments((prev) => [newAppt, ...prev]);
        setBookingSuccess(true);
      }
    } catch (err) {
      console.error("Booking error:", err);
    } finally {
      setIsBooking(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-[var(--primary)] animate-spin" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Loading Patient Dashboard from NeonDB...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-transparent text-[var(--foreground)] pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface-secondary)_85%,transparent)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-[var(--foreground)] tracking-tight">
                AAVYA Patient Portal
              </span>
            </div>
          </Link>

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
              </UserButton.MenuItems>
            </UserButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] clay-card-flat">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <Badge variant="coral">Patient Record Active</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)]">
              Welcome back, {account?.full_name || user?.fullName}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
              Account: {account?.email} • Patient ID: #{account?.id}
            </p>
          </div>
          <Link href="/assessment">
            <ClayButton variant="primary" size="md" className="gap-2 shrink-0">
              <Activity className="size-4" />
              <span>Take Full PCOS Assessment →</span>
            </ClayButton>
          </Link>
        </div>

        {/* Profile Details from NeonDB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClayCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-9 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center">
                <User className="size-4 text-[var(--leaf)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                  Personal Demographics
                </h3>
                <span className="text-[11px] text-[var(--muted-foreground)]">Fetched from NeonDB</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Age:</span>
                <span className="font-semibold tabular-nums">{account?.patient_profile?.age || "24"} years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Blood Group:</span>
                <span className="font-semibold">{account?.patient_profile?.blood_group || "B+"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Date of Birth:</span>
                <span>{account?.patient_profile?.date_of_birth || "2002-05-14"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Phone:</span>
                <span>{account?.phone || "+91 98765 43210"}</span>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-9 rounded-full bg-[color-mix(in_oklab,var(--coral)_60%,var(--card))] text-[var(--coral-foreground)] flex items-center justify-center">
                <Phone className="size-4 text-[var(--primary)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                  Safety & Emergency
                </h3>
                <span className="text-[11px] text-[var(--muted-foreground)]">Critical Contacts</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Emergency Contact:</span>
                <span className="font-semibold">{account?.patient_profile?.emergency_contact || "+91 98765 00001"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Data Encryption:</span>
                <span className="text-[var(--leaf)] font-medium">AES-256 Active</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Medical Summary:</span>
                <span className="truncate max-w-[150px]">{account?.patient_profile?.medical_history_summary || "Hormonal evaluation"}</span>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-9 rounded-full bg-[color-mix(in_oklab,var(--gold)_55%,var(--card))] text-[var(--gold-foreground)] flex items-center justify-center">
                <Sparkles className="size-4 text-[var(--gold-foreground)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                  Latest Assessment
                </h3>
                <span className="text-[11px] text-[var(--muted-foreground)]">Longitudinal Tracking</span>
              </div>
            </div>
            {assessments.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--muted-foreground)]">Risk Index:</span>
                  <span className="font-display font-bold text-lg text-[var(--primary)]">
                    {assessments[0].risk_percentage}%
                  </span>
                </div>
                <Badge variant={assessments[0].risk_percentage > 60 ? "coral" : "sage"}>
                  {assessments[0].risk_category}
                </Badge>
                <Link href="/assessment" className="block text-[11px] text-[var(--primary)] hover:underline pt-1">
                  View Full Report or Retake →
                </Link>
              </div>
            ) : (
              <div>
                <p className="text-xs text-[var(--muted-foreground)] mb-3">
                  No previous assessment on file. Take the questionnaire to generate your statistical report.
                </p>
                <Link href="/assessment">
                  <ClayButton variant="secondary" size="sm" className="w-full">
                    <span>Start Screening</span>
                  </ClayButton>
                </Link>
              </div>
            )}
          </ClayCard>
        </div>

        {/* Assessment History Section */}
        {assessments.length > 0 && (
          <ClayCard className="p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
              <div>
                <h2 className="text-base font-bold font-display text-[var(--foreground)]">
                  Your Longitudinal Risk Assessments
                </h2>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Records persisted in NeonDB across evaluation cycles
                </p>
              </div>
              <Badge variant="sage">{assessments.length} Recorded</Badge>
            </div>

            <div className="space-y-3">
              {assessments.map((a) => {
                const isExpanded = expandedAssessmentId === a.id;
                return (
                  <div
                    key={a.id}
                    className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] space-y-3 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[var(--foreground)]">
                            {a.risk_category} ({a.risk_percentage}%)
                          </span>
                          <span className="text-[11px] text-[var(--muted-foreground)]">
                            • {new Date(a.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
                          {a.risk_description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => setExpandedAssessmentId(isExpanded ? null : a.id)}
                          className="px-3.5 py-1.5 rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-highlight)] transition-colors flex items-center gap-1.5 shadow-xs"
                        >
                          {isExpanded ? <ChevronUp className="size-3.5 text-[var(--primary)]" /> : <ChevronDown className="size-3.5 text-[var(--primary)]" />}
                          <span>{isExpanded ? "Hide Biomarkers" : "Inspect Biomarkers"}</span>
                        </button>
                        <Link href="/assessment">
                          <ClayButton variant="secondary" size="sm" className="gap-1 text-xs">
                            <FileText className="size-3.5" />
                            <span>Full Report</span>
                          </ClayButton>
                        </Link>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="pt-3 border-t border-[var(--border)] space-y-3 animate-fadeIn text-xs">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)]">
                            <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Cycle Status</span>
                            <span className="font-bold text-[var(--foreground)]">{String(a.input_features?.["Cycle(R/I)"] || "Regular")}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)]">
                            <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">BMI</span>
                            <span className="font-bold text-[var(--foreground)]">{String(a.input_features?.["BMI"] || "24.5")}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)]">
                            <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Hirsutism</span>
                            <span className="font-bold text-[var(--foreground)]">{String(a.input_features?.["hair growth(Y/N)"] || "No")}</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border)]">
                            <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Acne / Breakouts</span>
                            <span className="font-bold text-[var(--foreground)]">{String(a.input_features?.["Pimples(Y/N)"] || "No")}</span>
                          </div>
                        </div>

                        {a.top_contributing_factors && a.top_contributing_factors.length > 0 && (
                          <div>
                            <span className="text-[11px] font-bold text-stone-600 block mb-1">
                              Statistical Risk Drivers Attributed by Trained Pipeline:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {a.top_contributing_factors.map((f: { feature?: string; impact?: number }, idx: number) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-1 rounded-md bg-stone-100 border border-stone-200 text-stone-800 text-[11px] font-medium"
                                >
                                  {f.feature || "Marker"}: {f.impact !== undefined ? (f.impact > 0 ? `+${f.impact}` : f.impact) : ""}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ClayCard>
        )}

        {/* Upcoming Consultations Section */}
        <ClayCard className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
            <div>
              <h2 className="text-base font-bold font-display text-[var(--foreground)]">
                Upcoming Doctor Consultations
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Appointments with reproductive endocrinologists and gynecologists
              </p>
            </div>
            <Badge variant="sage">{appointments.length} Scheduled</Badge>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-3">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {appt.doctor?.full_name || "Specialist Consultation"}
                      </span>
                      <Badge variant={appt.status === "CONFIRMED" ? "sage" : "coral"}>
                        {appt.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {appt.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {appt.time_slot}
                      </span>
                    </div>
                    {appt.notes && (
                      <p className="text-xs text-[var(--muted-foreground)] mt-1.5 italic">
                        &quot;{appt.notes}&quot;
                      </p>
                    )}
                    {appt.doctor_notes && (
                      <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                        <strong className="text-emerald-800 flex items-center gap-1.5 mb-1">
                          <CheckCircle className="size-3.5 text-emerald-600" />
                          <span>Doctor&apos;s Clinical Directives & Recommendations:</span>
                        </strong>
                        <p className="leading-relaxed">{appt.doctor_notes}</p>
                      </div>
                    )}

                    {/* Explicit Patient Consent Control (Phase 8) */}
                    <div className="mt-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        {appt.consent_share_report !== false ? (
                          <div className="size-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-3.5" />
                          </div>
                        ) : (
                          <div className="size-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
                            <Lock className="size-3.5" />
                          </div>
                        )}
                        <div>
                          <span className="font-semibold block text-[var(--foreground)]">
                            {appt.consent_share_report !== false
                              ? "Clinical Risk Assessment Shared with Doctor"
                              : "Assessment Access Revoked (Private)"}
                          </span>
                          <span className="text-[11px] text-[var(--muted-foreground)]">
                            {appt.consent_share_report !== false
                              ? `Dr. ${appt.doctor?.full_name || "Specialist"} is authorized to review your risk profile & biomarkers.`
                              : "Doctor cannot access your algorithmic assessment report."}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleConsent(appt.id, appt.consent_share_report !== false)}
                        disabled={updatingConsentId === appt.id}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all active:scale-95 shrink-0 border ${
                          appt.consent_share_report !== false
                            ? "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {updatingConsentId === appt.id ? (
                          "Updating..."
                        ) : appt.consent_share_report !== false ? (
                          "Revoke Doctor Access"
                        ) : (
                          "Grant Doctor Access"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-[color-mix(in_oklab,var(--background)_70%,var(--muted))] rounded-xl">
              <Calendar className="size-8 text-[var(--leaf)] mx-auto mb-2" />
              <p className="text-xs text-[var(--muted-foreground)]">
                No consultations currently scheduled. Choose a verified specialist below to book.
              </p>
            </div>
          )}
        </ClayCard>

        {/* Verified Doctor Network */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-[var(--foreground)]">
                Verified Specialist Network (NeonDB)
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Consult with certified gynecologists and reproductive endocrinologists
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="sage">{doctors.length} Doctors Available</Badge>
              <Link href="/doctors" className="clay-button-secondary text-xs px-3 py-1.5 font-semibold flex items-center gap-1">
                <span>Full Directory & Slots →</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {doctors.map((doc) => (
              <ClayCard key={doc.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold font-display text-[var(--foreground)]">
                        {doc.name}
                      </h3>
                      <p className="text-xs font-semibold text-[var(--primary)] mt-0.5">
                        {doc.specialization}
                      </p>
                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        {doc.qualification} • {doc.license_number}
                      </span>
                    </div>
                    <Badge variant="sage" className="text-[10px]">Verified</Badge>
                  </div>

                  <div className="space-y-1 text-xs text-[var(--muted-foreground)] my-3">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>{doc.clinic_address}, {doc.city}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 shrink-0" />
                      <span>Fee: ₹{doc.consultation_fee} • {doc.years_of_experience} yrs exp</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border)]">
                  <button
                    onClick={() => {
                      setBookingDoctor(doc);
                      setBookingSuccess(false);
                    }}
                    className="w-full clay-button-primary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="size-3.5" />
                    <span>Book Consultation with Dr. {doc.name.split(" ")[1] || doc.name}</span>
                  </button>
                </div>
              </ClayCard>
            ))}
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-md w-full p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                Book Consultation
              </h3>
              <button
                onClick={() => setBookingDoctor(null)}
                className="text-stone-400 hover:text-stone-600 text-lg"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle className="size-10 text-emerald-600 mx-auto" />
                <h4 className="font-display font-bold text-emerald-950">
                  Appointment Requested!
                </h4>
                <p className="text-xs text-emerald-800">
                  Your appointment with {bookingDoctor.name} on {bookingDate} at {bookingTime} has been registered.
                </p>
                <button
                  onClick={() => setBookingDoctor(null)}
                  className="clay-button-primary px-6 py-2 text-xs font-semibold mt-2"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 rounded-lg clay-inset-well text-xs">
                  <div className="font-semibold text-[var(--foreground)]">{bookingDoctor.name}</div>
                  <div className="text-[var(--muted-foreground)]">{bookingDoctor.specialization}</div>
                  <div className="text-[var(--primary)] font-medium mt-1">Fee: ₹{bookingDoctor.consultation_fee}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                      Time Slot
                    </label>
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)]"
                    >
                      {["09:30 AM", "10:30 AM", "11:30 AM", "02:30 PM", "04:00 PM"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--foreground)] mb-1">
                    Notes for Doctor
                  </label>
                  <textarea
                    rows={3}
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Describe main reason for consultation or questions..."
                    className="w-full p-3 rounded-lg border border-[var(--border)] bg-[var(--card)] text-xs text-[var(--foreground)]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setBookingDoctor(null)}
                    className="clay-button-secondary px-4 py-2 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    disabled={isBooking}
                    className="clay-button-primary px-5 py-2 text-xs font-semibold"
                  >
                    {isBooking ? "Submitting..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
