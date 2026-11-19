"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import {
  Stethoscope,
  ShieldCheck,
  Users,
  MapPin,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  UserCheck,
  FileText,
  Lock,
  Eye,
  Settings2,
  X,
  SlidersHorizontal,
  Check
} from "lucide-react";
import { ClayCard } from "@/components/ui/ClayCard";
import { Badge } from "@/components/ui/Badge";
import { syncUserWithNeonDB, UserAccount } from "@/lib/auth";

interface DoctorAppointment {
  id: number;
  appointment_date: string;
  time_slot: string;
  status: string;
  notes?: string;
  doctor_notes?: string;
  assessment_id?: number;
  consent_share_report?: boolean;
  created_at: string;
  patient?: {
    id: number;
    full_name: string;
    email: string;
    phone?: string;
    age?: number;
    blood_group?: string;
  };
}

interface PatientAssessmentData {
  appointment_id: number;
  patient_id: number;
  patient_name: string;
  patient_email: string;
  consent_share_report: boolean;
  assessment_id: number;
  risk_probability: number;
  risk_percentage: number;
  risk_category: string;
  risk_description: string;
  input_features: Record<string, string | number | boolean>;
  top_contributing_factors: { feature: string; impact: number; direction?: string }[];
  created_at: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [account, setAccount] = useState<UserAccount | null>(null);
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Clinical notes state
  const [activeNotesAppt, setActiveNotesAppt] = useState<DoctorAppointment | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState("");
  const [isSubmittingNotes, setIsSubmittingNotes] = useState(false);

  // Patient assessment viewer modal state (Phase 8)
  const [selectedAssessment, setSelectedAssessment] = useState<PatientAssessmentData | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);
  const [assessmentAccessRevoked, setAssessmentAccessRevoked] = useState(false);
  const [viewingPatientName, setViewingPatientName] = useState("");

  // Doctor practice & fee management modal state (Phase 8)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editFee, setEditFee] = useState<number>(800);
  const [editAddress, setEditAddress] = useState("");
  const [editCity, setEditCity] = useState("Bengaluru");
  const [editBio, setEditBio] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

  useEffect(() => {
    async function verifyDoctorAccess() {
      if (!isLoaded || !user) return;
      try {
        const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
        const data = await syncUserWithNeonDB({
          clerk_id: user.id,
          email: primaryEmail,
          full_name: user.fullName || "Dr. Pratyush Dutta",
          avatar_url: user.imageUrl,
        });

        // Role-based protection: Only DOCTOR allowed here
        if (data.role !== "DOCTOR") {
          router.replace("/dashboard");
          return;
        }

        setAccount(data);
        if (data.doctor_profile) {
          setIsAvailable(data.doctor_profile.is_available);
          setEditFee(data.doctor_profile.consultation_fee || 800);
          setEditAddress(data.doctor_profile.clinic_address || "");
          setEditCity(data.doctor_profile.city || "Bengaluru");
          setEditBio(data.doctor_profile.bio || "");
        }

        // Fetch patient consultations for this doctor
        const apptRes = await fetch(`${apiUrl}/appointments/doctor?email=${encodeURIComponent(primaryEmail)}`);
        if (apptRes.ok) {
          const apptData = await apptRes.json();
          setAppointments(apptData);
        }
      } catch (err: unknown) {
        console.error("Doctor dashboard sync failed:", err);
        setError(err instanceof Error ? err.message : "Failed to load doctor profile from NeonDB");
      } finally {
        setLoading(false);
      }
    }

    verifyDoctorAccess();
  }, [isLoaded, user, router, apiUrl]);

  // Handle Availability Toggle with NeonDB Persistence (Phase 8)
  const handleToggleAvailability = async () => {
    if (!account) return;
    const newAvail = !isAvailable;
    setIsAvailable(newAvail);
    setIsUpdatingAvailability(true);
    try {
      const res = await fetch(`${apiUrl}/users/doctor/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          is_available: newAvail,
        }),
      });
      if (!res.ok) {
        setIsAvailable(!newAvail); // revert on error
      }
    } catch (err) {
      console.error("Availability toggle error:", err);
      setIsAvailable(!newAvail);
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  // Handle Doctor Profile and Practice Metadata Update (Phase 8)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setIsSavingProfile(true);
    try {
      const res = await fetch(`${apiUrl}/users/doctor/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: account.email,
          consultation_fee: editFee,
          clinic_address: editAddress,
          city: editCity,
          bio: editBio,
          is_available: isAvailable,
        }),
      });

      if (res.ok) {
        setAccount((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            doctor_profile: {
              ...prev.doctor_profile!,
              consultation_fee: editFee,
              clinic_address: editAddress,
              city: editCity,
              bio: editBio,
              is_available: isAvailable,
            },
          };
        });
        setProfileSaveSuccess(true);
        setTimeout(() => {
          setProfileSaveSuccess(false);
          setShowProfileModal(false);
        }, 1200);
      }
    } catch (err) {
      console.error("Profile save error:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Patient Assessment Report Viewing Gated by Consent (Phase 8)
  const handleViewPatientAssessment = async (appt: DoctorAppointment) => {
    setIsLoadingAssessment(true);
    setViewingPatientName(appt.patient?.full_name || "Patient Member");
    setSelectedAssessment(null);
    setAssessmentAccessRevoked(false);
    setIsAssessmentModalOpen(true);

    try {
      const res = await fetch(`${apiUrl}/appointments/${appt.id}/patient-assessment`);
      if (res.status === 403) {
        setAssessmentAccessRevoked(true);
        return;
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || "Failed to load patient assessment");
      }
      const data = await res.json();
      setSelectedAssessment(data);
    } catch (err: unknown) {
      console.error("Assessment fetch error:", err);
      if (appt.consent_share_report === false) {
        setAssessmentAccessRevoked(true);
      }
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleUpdateStatus = async (appointmentId: number, newStatus: string) => {
    setUpdatingId(appointmentId);
    try {
      const res = await fetch(`${apiUrl}/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setAppointments((prev) =>
          prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
        );
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSubmitClinicalNotes = async () => {
    if (!activeNotesAppt || !clinicalNotesInput.trim()) return;
    setIsSubmittingNotes(true);
    try {
      const res = await fetch(`${apiUrl}/appointments/${activeNotesAppt.id}/clinical-notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor_notes: clinicalNotesInput.trim(),
          status: "COMPLETED",
        }),
      });

      if (res.ok) {
        const updatedAppt = await res.json();
        setAppointments((prev) =>
          prev.map((a) => (a.id === updatedAppt.id ? updatedAppt : a))
        );
        setActiveNotesAppt(null);
        setClinicalNotesInput("");
      }
    } catch (err) {
      console.error("Clinical notes error:", err);
    } finally {
      setIsSubmittingNotes(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-8 text-[var(--primary)] animate-spin" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Loading Clinician Specialty Workspace from NeonDB...
          </span>
        </div>
      </div>
    );
  }

  const docProf = account?.doctor_profile;
  const pendingAppointments = appointments.filter((a) => a.status === "PENDING");

  return (
    <div className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[oklch(0.976_0.012_84/0.9)] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-8 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-bold text-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-base text-[var(--foreground)]">
                AAVYA Clinician Portal
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[var(--primary)] font-semibold -mt-0.5">
                Role: Verified Doctor
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Badge variant="sage" className="hidden sm:inline-flex">
              <ShieldCheck className="size-3 text-[var(--leaf)]" />
              <span>Medical License Verified</span>
            </Badge>
            <UserButton />
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Doctor Identity Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)] clay-card-flat">
          <div>
            <div className="inline-flex items-center gap-2 mb-2 flex-wrap">
              <Badge variant="sage">
                <Stethoscope className="size-3 text-[var(--leaf)]" />
                <span>Specialist Practice Hub</span>
              </Badge>
              <Badge variant="coral">NeonDB Verified Doctor</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)]">
              Welcome, {account?.full_name || "Dr. Pratyush Dutta"}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
              {docProf?.specialization} • License: {docProf?.license_number}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setShowProfileModal(true)}
              className="clay-button-secondary px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Settings2 className="size-3.5 text-[var(--primary)]" />
              <span>Edit Practice & Fees</span>
            </button>

            <button
              onClick={handleToggleAvailability}
              disabled={isUpdatingAvailability}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors duration-150 flex items-center gap-2 ${
                isAvailable
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-neutral-100 border-neutral-300 text-neutral-600"
              }`}
            >
              <span className={`size-2 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
              <span>{isAvailable ? "Accepting Consultations" : "Offline / In Clinic"}</span>
            </button>
          </div>
        </div>

        {/* Doctor Credentials & Practice Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClayCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center">
                  <Award className="size-4 text-[var(--leaf)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                    Clinical Credentials
                  </h3>
                  <span className="text-[11px] text-[var(--muted-foreground)]">NeonDB Record</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Qualification:</span>
                <span className="font-semibold text-right">{docProf?.qualification}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Experience:</span>
                <span className="font-semibold">{docProf?.years_of_experience} Years</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Consultation Fee:</span>
                <span className="font-bold text-[var(--primary)] tabular-nums">₹{docProf?.consultation_fee}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Official Email:</span>
                <span className="truncate max-w-[150px]">{account?.email}</span>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[color-mix(in_oklab,var(--coral)_60%,var(--card))] text-[var(--coral-foreground)] flex items-center justify-center">
                  <MapPin className="size-4 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                    Clinic & Locality
                  </h3>
                  <span className="text-[11px] text-[var(--muted-foreground)]">Physical Practice</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)] block">Practice Location:</span>
                <span className="font-medium text-[var(--foreground)]">{docProf?.clinic_address}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">City:</span>
                <span className="font-semibold">{docProf?.city}</span>
              </div>
              <div className="py-1">
                <span className="text-[var(--muted-foreground)] block">Clinical Focus:</span>
                <span className="text-[var(--foreground)] line-clamp-2">{docProf?.bio}</span>
              </div>
            </div>
          </ClayCard>

          <ClayCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-9 rounded-full bg-[color-mix(in_oklab,var(--gold)_55%,var(--card))] text-[var(--gold-foreground)] flex items-center justify-center">
                <Users className="size-4 text-[var(--gold-foreground)]" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-[var(--foreground)]">
                  Consultation Queue
                </h3>
                <span className="text-[11px] text-[var(--muted-foreground)]">Live Bookings</span>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Pending Review:</span>
                <span className="font-bold text-[var(--primary)] tabular-nums">{pendingAppointments.length}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Total Consultations:</span>
                <span className="font-semibold tabular-nums">{appointments.length}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--muted-foreground)]">Practice Status:</span>
                <span className="text-[var(--leaf)] font-medium">
                  {isAvailable ? "Accepting Patients" : "Offline"}
                </span>
              </div>
            </div>
          </ClayCard>
        </div>

        {/* Incoming Patient Handover Reviews Queue */}
        <ClayCard className="p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
            <div>
              <h2 className="text-base font-bold font-display text-[var(--foreground)]">
                Patient Risk Assessment & Consultation Queue
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Patients who booked consultations, biomarker reports, and clinical handover summaries
              </p>
            </div>
            <Badge variant="sage">{appointments.length} Booked</Badge>
          </div>

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt.id}
                  className="p-5 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {appt.patient?.full_name || "Patient Member"}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        ({appt.patient?.email})
                      </span>
                      <Badge
                        variant={
                          appt.status === "CONFIRMED"
                            ? "sage"
                            : appt.status === "COMPLETED"
                            ? "gold"
                            : "coral"
                        }
                      >
                        {appt.status}
                      </Badge>
                      {appt.consent_share_report === false && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 border border-stone-200 text-stone-600 flex items-center gap-1">
                          <Lock className="size-3" />
                          <span>Consent Revoked</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3.5" />
                        {appt.appointment_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {appt.time_slot}
                      </span>
                      {appt.patient?.age && (
                        <span>Age: {appt.patient.age} yrs</span>
                      )}
                      {appt.patient?.blood_group && (
                        <span>Blood: {appt.patient.blood_group}</span>
                      )}
                    </div>

                    {appt.notes && (
                      <p className="text-xs text-[var(--foreground)] bg-[var(--card)] p-2.5 rounded-lg border border-[var(--border)] mt-2">
                        <strong className="text-[var(--primary)]">Patient Symptoms:</strong> &quot;{appt.notes}&quot;
                      </p>
                    )}

                    {appt.doctor_notes && (
                      <div className="text-xs p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 mt-2">
                        <strong className="text-emerald-800">Your Clinical Directives:</strong> {appt.doctor_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* View Patient Risk Report Button (Phase 8) */}
                    <button
                      onClick={() => handleViewPatientAssessment(appt)}
                      className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-white text-xs font-semibold text-[var(--foreground)] hover:bg-stone-50 transition-colors flex items-center gap-1.5"
                    >
                      {appt.consent_share_report === false ? (
                        <>
                          <Lock className="size-3.5 text-stone-500" />
                          <span>Risk Report (Locked)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="size-3.5 text-[var(--primary)]" />
                          <span>View Risk Report</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setActiveNotesAppt(appt);
                        setClinicalNotesInput(appt.doctor_notes || "");
                      }}
                      className="clay-button-secondary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1"
                    >
                      <Stethoscope className="size-3.5 text-[var(--primary)]" />
                      <span>{appt.doctor_notes ? "Edit Notes" : "Write Clinical Notes"}</span>
                    </button>

                    {appt.status === "PENDING" && (
                      <button
                        onClick={() => handleUpdateStatus(appt.id, "CONFIRMED")}
                        disabled={updatingId === appt.id}
                        className="clay-button-primary px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1"
                      >
                        <UserCheck className="size-3.5" />
                        <span>Confirm</span>
                      </button>
                    )}

                    {appt.status === "CONFIRMED" && (
                      <button
                        onClick={() => handleUpdateStatus(appt.id, "COMPLETED")}
                        disabled={updatingId === appt.id}
                        className="clay-button-primary px-3.5 py-1.5 text-xs font-semibold"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => handleUpdateStatus(appt.id, "CANCELLED")}
                      disabled={updatingId === appt.id}
                      className="px-2.5 py-1.5 text-xs text-stone-500 hover:text-rose-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-[color-mix(in_oklab,var(--background)_70%,var(--muted))] rounded-xl border border-[var(--border)]">
              <CheckCircle2 className="size-8 text-[var(--leaf)] mx-auto mb-2" />
              <h4 className="text-sm font-bold font-display text-[var(--foreground)]">
                Consultation Queue Clear
              </h4>
              <p className="text-xs text-[var(--muted-foreground)] max-w-md mx-auto mt-1">
                Patient bookings and risk assessments will appear here when submitted.
              </p>
            </div>
          )}
        </ClayCard>
      </main>

      {/* Patient Assessment Report Modal (Phase 8) */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-2xl w-full p-6 space-y-5 animate-scaleIn max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] flex items-center justify-center">
                  <FileText className="size-4 text-[var(--leaf)]" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                    Patient Algorithmic Assessment Report
                  </h3>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Patient: {viewingPatientName}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="size-8 rounded-lg text-stone-400 hover:text-stone-700 flex items-center justify-center hover:bg-stone-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {isLoadingAssessment ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="size-8 text-[var(--primary)] animate-spin" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">
                  Retrieving encrypted biomarker report from NeonDB...
                </span>
              </div>
            ) : assessmentAccessRevoked ? (
              /* Privacy Locked View: Explicit Patient Consent Revoked */
              <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <Lock className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold font-display text-amber-900">
                      Explicit Patient Consent Revoked (HTTP 403)
                    </h4>
                    <p className="text-xs text-amber-800">
                      Under AAVYA Phase 8 privacy controls, this patient has explicitly revoked authorization to share their algorithmic risk calculation and biomarker record.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/70 border border-amber-200/80 text-xs text-amber-900 space-y-1.5 leading-relaxed">
                  <p>
                    <strong>Clinical Privacy Policy:</strong> In compliance with medical confidentiality standards, algorithmic scoring, regression weights, and metabolic profiles are masked.
                  </p>
                  <p>
                    You may proceed with the clinical appointment utilizing the patient&apos;s reported symptoms, direct interview questions, and clinical examination findings.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsAssessmentModalOpen(false)}
                    className="clay-button-secondary px-4 py-2 text-xs font-semibold"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : selectedAssessment ? (
              /* Granted Assessment View */
              <div className="space-y-4 text-xs">
                {/* Risk Score Header Card */}
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--background)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-semibold block">
                      Statistical Risk Classification
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xl font-bold font-display text-[var(--foreground)]">
                        {selectedAssessment.risk_category}
                      </span>
                      <Badge variant="coral">
                        <span className="tabular-nums">{selectedAssessment.risk_percentage}%</span> Probability
                      </Badge>
                    </div>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {selectedAssessment.risk_description}
                    </p>
                  </div>
                  <Badge variant="sage">Consent Verified</Badge>
                </div>

                {/* Patient Biomarkers Grid */}
                <div>
                  <h4 className="text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wider">
                    Reported Phenotypic & Metabolic Biomarkers
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Cycle Status</span>
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {String(selectedAssessment.input_features["Cycle(R/I)"] || "Regular")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">BMI</span>
                      <span className="font-bold text-sm text-[var(--foreground)] tabular-nums">
                        {String(selectedAssessment.input_features["BMI"] || "24.5")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Hirsutism</span>
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {String(selectedAssessment.input_features["hair growth(Y/N)"] || "No")}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      <span className="text-[10px] text-[var(--muted-foreground)] uppercase block font-medium">Acne / Breakouts</span>
                      <span className="font-bold text-sm text-[var(--foreground)]">
                        {String(selectedAssessment.input_features["Pimples(Y/N)"] || "No")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Model Attribution Factors */}
                {selectedAssessment.top_contributing_factors && selectedAssessment.top_contributing_factors.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-[var(--foreground)] mb-2 uppercase tracking-wider">
                      Model Risk Feature Attributions (Pipeline Weights)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedAssessment.top_contributing_factors.map((f, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg border border-[var(--border)] bg-white flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-stone-800">{f.feature}</span>
                          <span className="font-bold tabular-nums text-[var(--primary)]">
                            {f.impact > 0 ? `+${f.impact}` : f.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
                  <strong>Clinical Notice:</strong> Algorithmic scores are statistical models for pre-consultation triage. Final diagnostic decisions must adhere to Rotterdam 2003 criteria following clinical interview and hormonal blood panel review.
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsAssessmentModalOpen(false)}
                    className="clay-button-primary px-5 py-2 text-xs font-semibold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Edit Doctor Practice & Fees Modal (Phase 8) */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-lg w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="size-5 text-[var(--primary)]" />
                <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                  Edit Practice Profile & Fees
                </h3>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="size-8 rounded-lg text-stone-400 hover:text-stone-700 flex items-center justify-center hover:bg-stone-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Consultation Fee (₹ INR)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={editFee}
                  onChange={(e) => setEditFee(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] tabular-nums"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Practice City
                </label>
                <input
                  type="text"
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  required
                  placeholder="e.g. Bengaluru, Kolkata, Mumbai"
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Clinic Physical Address
                </label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  required
                  placeholder="e.g. AAVYA Women's Specialty Hub, Indiranagar"
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                  Clinical Bio & Specialization Focus
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Brief clinical focus, academic credentials, and patient consultation scope..."
                  className="w-full p-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              {profileSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                  <Check className="size-4" />
                  <span>Practice profile updated and synced to NeonDB successfully!</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="clay-button-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="size-3.5 animate-spin" />
                      <span>Saving to NeonDB...</span>
                    </>
                  ) : (
                    <span>Save Practice Profile</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clinical Notes & Prescription Modal */}
      {activeNotesAppt && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clay-card max-w-lg w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Stethoscope className="size-5 text-[var(--primary)]" />
                <h3 className="text-lg font-display font-bold text-[var(--foreground)]">
                  Clinical Consultation Directives
                </h3>
              </div>
              <button
                onClick={() => setActiveNotesAppt(null)}
                className="size-8 rounded-lg text-stone-400 hover:text-stone-700 flex items-center justify-center hover:bg-stone-100 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl clay-inset-well text-xs space-y-1">
              <div>
                <span className="text-[var(--muted-foreground)]">Patient: </span>
                <span className="font-semibold text-[var(--foreground)]">
                  {activeNotesAppt.patient?.full_name} ({activeNotesAppt.patient?.email})
                </span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Appointment Date: </span>
                <span>{activeNotesAppt.appointment_date} at {activeNotesAppt.time_slot}</span>
              </div>
              {activeNotesAppt.notes && (
                <div>
                  <span className="text-[var(--muted-foreground)]">Reported Symptoms: </span>
                  <span className="italic">&quot;{activeNotesAppt.notes}&quot;</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                Clinical Notes, Diagnosis & Recommended Interventions
              </label>
              <textarea
                rows={5}
                value={clinicalNotesInput}
                onChange={(e) => setClinicalNotesInput(e.target.value)}
                placeholder="e.g. Discussed Rotterdam phenotypic markers. Recommended Day 2-3 LH/FSH panel, pelvic ultrasound, and initiation of Inositol (40:1) with a low-glycemic dietary regimen..."
                className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-xs text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] placeholder:text-stone-400 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
              <span className="text-[11px] text-[var(--leaf)] font-medium">
                ✓ Consultation will automatically be marked as COMPLETED
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveNotesAppt(null)}
                  className="clay-button-secondary px-4 py-2 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitClinicalNotes}
                  disabled={isSubmittingNotes || !clinicalNotesInput.trim()}
                  className="clay-button-primary px-5 py-2 text-xs font-semibold flex items-center gap-1.5"
                >
                  {isSubmittingNotes ? "Saving..." : "Save & Complete Consultation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
