/**
 * Authentication Sync & Role-Based Profile Utilities
 * Interfaces between Clerk user session and NeonDB PostgreSQL backend.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api/v1";

export interface DoctorProfileData {
  id?: number;
  specialization: string;
  qualification: string;
  license_number: string;
  years_of_experience: number;
  clinic_address: string;
  city: string;
  consultation_fee: number;
  bio?: string;
  is_available: boolean;
}

export interface PatientProfileData {
  id?: number;
  date_of_birth?: string;
  age?: number;
  blood_group?: string;
  emergency_contact?: string;
  medical_history_summary?: string;
  is_onboarding_complete: boolean;
}

export interface UserAccount {
  id: number;
  clerk_id?: string;
  email: string;
  full_name: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  is_profile_complete: boolean;
  doctor_profile?: DoctorProfileData;
  patient_profile?: PatientProfileData;
}

export async function syncUserWithNeonDB(params: {
  clerk_id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
}): Promise<UserAccount> {
  const res = await fetch(`${API_BASE_URL}/auth/sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to sync user with NeonDB");
  }

  return res.json();
}

export async function submitPatientOnboarding(
  email: string,
  data: {
    age: number;
    date_of_birth?: string;
    phone?: string;
    blood_group?: string;
    emergency_contact?: string;
    medical_history_summary?: string;
  }
): Promise<UserAccount> {
  const res = await fetch(`${API_BASE_URL}/users/onboarding?email=${encodeURIComponent(email)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to complete onboarding in NeonDB");
  }

  return res.json();
}
