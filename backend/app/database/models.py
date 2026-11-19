"""
SQLAlchemy Data Models for AAVYA – HeredityAI
Role-Based Authentication (Doctor/Patient), Clinical Profiles, and Assessment Records.
Compatible with NeonDB (PostgreSQL) and SQLite fallback.
"""
from datetime import datetime, timezone
from enum import Enum
from typing import Optional, List
from sqlalchemy import (
    String,
    Boolean,
    Integer,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class UserRole(str, Enum):
    PATIENT = "PATIENT"
    DOCTOR = "DOCTOR"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    clerk_id: Mapped[Optional[str]] = mapped_column(String(128), unique=True, index=True, nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(32), default=UserRole.PATIENT.value, index=True, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # 1-to-1 Relationships
    doctor_profile: Mapped[Optional["DoctorProfile"]] = relationship(
        "DoctorProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )
    patient_profile: Mapped[Optional["PatientProfile"]] = relationship(
        "PatientProfile",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
    )

    # 1-to-Many Relationships
    assessments: Mapped[List["AssessmentRecord"]] = relationship(
        "AssessmentRecord",
        back_populates="user",
        cascade="all, delete-orphan",
    )
    patient_appointments: Mapped[List["Appointment"]] = relationship(
        "Appointment",
        back_populates="patient",
        foreign_keys="Appointment.patient_id",
        cascade="all, delete-orphan",
    )
    doctor_appointments: Mapped[List["Appointment"]] = relationship(
        "Appointment",
        back_populates="doctor",
        foreign_keys="Appointment.doctor_id",
        cascade="all, delete-orphan",
    )
    doctor_schedules: Mapped[List["DoctorSchedule"]] = relationship(
        "DoctorSchedule",
        back_populates="doctor",
        cascade="all, delete-orphan",
    )


class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    specialization: Mapped[str] = mapped_column(String(255), default="Reproductive Endocrinologist & PCOS Specialist")
    qualification: Mapped[str] = mapped_column(String(255), default="MBBS, MD (OBGYN)")
    license_number: Mapped[str] = mapped_column(String(64), nullable=False)
    years_of_experience: Mapped[int] = mapped_column(Integer, default=10)
    clinic_address: Mapped[str] = mapped_column(String(512), default="AAVYA Women's Health & Endocrine Clinic")
    city: Mapped[str] = mapped_column(String(128), default="Bengaluru")
    consultation_fee: Mapped[float] = mapped_column(Float, default=800.0)
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)

    user: Mapped["User"] = relationship("User", back_populates="doctor_profile")


class PatientProfile(Base):
    __tablename__ = "patient_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    date_of_birth: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    blood_group: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    emergency_contact: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    medical_history_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_onboarding_complete: Mapped[bool] = mapped_column(Boolean, default=False)

    user: Mapped["User"] = relationship("User", back_populates="patient_profile")


class AssessmentRecord(Base):
    __tablename__ = "assessment_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    risk_probability: Mapped[float] = mapped_column(Float, nullable=False)
    risk_percentage: Mapped[float] = mapped_column(Float, nullable=False)
    risk_category: Mapped[str] = mapped_column(String(64), nullable=False)
    risk_description: Mapped[str] = mapped_column(Text, nullable=False)
    input_features_json: Mapped[str] = mapped_column(Text, nullable=False)
    contributing_factors_json: Mapped[str] = mapped_column(Text, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    user: Mapped["User"] = relationship("User", back_populates="assessments")


class AppointmentStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class Appointment(Base):
    __tablename__ = "appointments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    patient_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    doctor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    appointment_date: Mapped[str] = mapped_column(String(32), nullable=False)  # YYYY-MM-DD
    time_slot: Mapped[str] = mapped_column(String(32), nullable=False)          # e.g., "10:30 AM"
    status: Mapped[str] = mapped_column(String(32), default=AppointmentStatus.PENDING.value, nullable=False)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    doctor_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assessment_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("assessment_records.id", ondelete="SET NULL"), nullable=True)
    consent_share_report: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    patient: Mapped["User"] = relationship("User", foreign_keys=[patient_id], back_populates="patient_appointments")
    doctor: Mapped["User"] = relationship("User", foreign_keys=[doctor_id], back_populates="doctor_appointments")
    assessment: Mapped[Optional["AssessmentRecord"]] = relationship("AssessmentRecord")


class DoctorSchedule(Base):
    """
    Weekly Recurring Availability Schedule for Verified Doctors.
    Defines working days (0=Monday ... 6=Sunday), shift hours, and consultation slot duration.
    """
    __tablename__ = "doctor_schedules"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    doctor_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0=Monday, 1=Tuesday, ..., 6=Sunday
    start_time: Mapped[str] = mapped_column(String(16), default="09:00", nullable=False)  # e.g., "09:00"
    end_time: Mapped[str] = mapped_column(String(16), default="17:00", nullable=False)    # e.g., "17:00"
    slot_duration_minutes: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    doctor: Mapped["User"] = relationship("User", back_populates="doctor_schedules")


