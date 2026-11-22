"""
Pydantic Schemas for User, Authentication, and Profiles (Doctor & Patient)
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class DoctorProfileSchema(BaseModel):
    id: Optional[int] = None
    specialization: str
    qualification: str
    license_number: str
    years_of_experience: int
    clinic_address: str
    city: str
    consultation_fee: float
    bio: Optional[str] = None
    is_available: bool = True

    model_config = ConfigDict(from_attributes=True)


class PatientProfileSchema(BaseModel):
    id: Optional[int] = None
    date_of_birth: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history_summary: Optional[str] = None
    is_onboarding_complete: bool = False

    model_config = ConfigDict(from_attributes=True)


class UserSyncRequest(BaseModel):
    clerk_id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    clerk_id: Optional[str] = None
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    is_verified: bool
    is_profile_complete: bool
    doctor_profile: Optional[DoctorProfileSchema] = None
    patient_profile: Optional[PatientProfileSchema] = None

    model_config = ConfigDict(from_attributes=True)


class PatientOnboardingRequest(BaseModel):
    age: int
    date_of_birth: Optional[str] = None
    phone: Optional[str] = None
    blood_group: Optional[str] = None
    emergency_contact: Optional[str] = None
    medical_history_summary: Optional[str] = None


class DoctorProfileUpdateRequest(BaseModel):
    email: str
    consultation_fee: Optional[float] = None
    clinic_address: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    is_available: Optional[bool] = None
    specialization: Optional[str] = None


class NewsletterSubscribeRequest(BaseModel):
    name: Optional[str] = "Subscriber"
    email: str


