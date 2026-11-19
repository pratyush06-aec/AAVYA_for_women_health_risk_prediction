from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class AppointmentBookRequest(BaseModel):
    patient_email: str
    doctor_id: int
    appointment_date: str = Field(description="Date in YYYY-MM-DD format")
    time_slot: str = Field(description="e.g., '10:00 AM', '02:30 PM'")
    notes: Optional[str] = None
    assessment_id: Optional[int] = None
    consent_share_report: bool = Field(default=True, description="Whether doctor is authorized to view patient risk assessment report")


class AppointmentStatusUpdateRequest(BaseModel):
    status: str = Field(description="'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'")


class AppointmentConsentUpdateRequest(BaseModel):
    consent_share_report: bool = Field(description="True allows doctor to view risk report, False revokes access")


class AppointmentClinicalNotesRequest(BaseModel):
    doctor_notes: str = Field(description="Clinical diagnosis, prescription recommendations, or follow-up advice")
    status: Optional[str] = Field(default="COMPLETED", description="Optionally update status to COMPLETED")


class DoctorInfo(BaseModel):
    id: int
    full_name: str
    email: str
    specialization: Optional[str] = None
    clinic_address: Optional[str] = None
    city: Optional[str] = None
    consultation_fee: Optional[float] = None


class PatientInfo(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    age: Optional[int] = None
    blood_group: Optional[str] = None


class AppointmentResponse(BaseModel):
    id: int
    appointment_date: str
    time_slot: str
    status: str
    notes: Optional[str] = None
    doctor_notes: Optional[str] = None
    assessment_id: Optional[int] = None
    consent_share_report: bool = True
    created_at: datetime
    doctor: Optional[DoctorInfo] = None
    patient: Optional[PatientInfo] = None


class DoctorScheduleItem(BaseModel):
    day_of_week: int = Field(ge=0, le=6, description="0=Monday, ..., 6=Sunday")
    start_time: str = Field(default="09:00", description="HH:MM format, e.g. '09:00'")
    end_time: str = Field(default="17:00", description="HH:MM format, e.g. '17:00'")
    slot_duration_minutes: int = Field(default=30, description="Duration in minutes per slot")
    is_active: bool = True


class DoctorScheduleUpdateRequest(BaseModel):
    doctor_id: Optional[int] = None
    doctor_email: Optional[str] = None
    schedules: List[DoctorScheduleItem]


class DoctorSlotItem(BaseModel):
    time_slot: str
    available: bool
    booked_appointment_id: Optional[int] = None


class DoctorSlotsResponse(BaseModel):
    doctor_id: int
    doctor_name: str
    date: str
    day_of_week: int
    day_name: str
    is_working_day: bool
    slots: List[DoctorSlotItem]

