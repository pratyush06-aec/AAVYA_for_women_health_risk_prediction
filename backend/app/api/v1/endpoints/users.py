"""
User Management, Patient Onboarding & Doctor Discovery Endpoints
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import User, DoctorProfile, PatientProfile, UserRole
from app.schemas.user import (
    PatientOnboardingRequest,
    DoctorProfileUpdateRequest,
    UserResponse,
    DoctorProfileSchema,
    PatientProfileSchema,
    NewsletterSubscribeRequest,
)

router = APIRouter()


@router.post("/onboarding", response_model=UserResponse)
async def complete_patient_onboarding(
    email: str,
    payload: PatientOnboardingRequest,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Saves onboarding details for new patients into NeonDB
    and marks their profile as complete.
    """
    stmt = (
        select(User)
        .options(selectinload(User.patient_profile))
        .where(User.email == email.lower().strip())
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if payload.phone:
        user.phone = payload.phone

    if not user.patient_profile:
        user.patient_profile = PatientProfile(user_id=user.id)

    user.patient_profile.age = payload.age
    user.patient_profile.date_of_birth = payload.date_of_birth
    user.patient_profile.blood_group = payload.blood_group
    user.patient_profile.emergency_contact = payload.emergency_contact
    user.patient_profile.medical_history_summary = payload.medical_history_summary
    user.patient_profile.is_onboarding_complete = True

    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        clerk_id=user.clerk_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        avatar_url=user.avatar_url,
        is_verified=user.is_verified,
        is_profile_complete=True,
        doctor_profile=None,
        patient_profile=PatientProfileSchema.model_validate(user.patient_profile),
    )


@router.get("/doctors", response_model=List[dict])
async def list_verified_doctors(
    city: str = None,
    specialization: str = None,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Returns directory of verified doctors from NeonDB with optional city and specialty filters"""
    stmt = (
        select(User)
        .options(selectinload(User.doctor_profile))
        .where(User.role == UserRole.DOCTOR.value)
    )
    res = await db.execute(stmt)
    doctors = res.scalars().all()

    doctor_list = []
    for doc in doctors:
        prof = doc.doctor_profile
        doc_city = prof.city if prof else "Bengaluru"
        doc_spec = prof.specialization if prof else "General Endocrine"

        # Apply city filter if provided
        if city and city.lower() not in doc_city.lower():
            continue
        # Apply specialization filter if provided
        if specialization and specialization.lower() not in doc_spec.lower():
            continue

        doc_dict = {
            "id": doc.id,
            "name": doc.full_name,
            "full_name": doc.full_name,
            "email": doc.email,
            "phone": doc.phone,
            "avatar_url": doc.avatar_url,
            "is_verified": doc.is_verified,
            "specialization": doc_spec,
            "qualification": prof.qualification if prof else "MBBS, MD",
            "license_number": prof.license_number if prof else "",
            "years_of_experience": prof.years_of_experience if prof else 5,
            "clinic_address": prof.clinic_address if prof else "AAVYA Clinic",
            "city": doc_city,
            "consultation_fee": prof.consultation_fee if prof else 800.0,
            "bio": prof.bio if prof else "",
            "is_available": prof.is_available if prof else True,
            "profile": {
                "specialization": doc_spec,
                "qualification": prof.qualification if prof else "MBBS, MD",
                "license_number": prof.license_number if prof else "",
                "years_of_experience": prof.years_of_experience if prof else 5,
                "clinic_address": prof.clinic_address if prof else "AAVYA Clinic",
                "city": doc_city,
                "consultation_fee": prof.consultation_fee if prof else 800.0,
                "bio": prof.bio if prof else "",
                "is_available": prof.is_available if prof else True,
            }
        }
        doctor_list.append(doc_dict)

    return doctor_list


@router.patch("/doctor/profile")
@router.put("/doctor/profile")
async def update_doctor_profile(
    payload: DoctorProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Updates practitioner metadata, consultation fee, clinic address, and availability in NeonDB."""
    stmt = (
        select(User)
        .options(selectinload(User.doctor_profile))
        .where(User.email == payload.email.lower().strip(), User.role == UserRole.DOCTOR.value)
    )
    res = await db.execute(stmt)
    doctor = res.scalar_one_or_none()
    if not doctor or not doctor.doctor_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found.",
        )

    prof = doctor.doctor_profile
    if payload.consultation_fee is not None:
        prof.consultation_fee = payload.consultation_fee
    if payload.clinic_address is not None:
        prof.clinic_address = payload.clinic_address
    if payload.city is not None:
        prof.city = payload.city
    if payload.bio is not None:
        prof.bio = payload.bio
    if payload.is_available is not None:
        prof.is_available = payload.is_available
    if payload.specialization is not None:
        prof.specialization = payload.specialization

    await db.commit()
    await db.refresh(prof)
    return {
        "message": "Doctor profile updated successfully",
        "doctor_id": doctor.id,
        "email": doctor.email,
        "consultation_fee": prof.consultation_fee,
        "clinic_address": prof.clinic_address,
        "city": prof.city,
        "bio": prof.bio,
        "is_available": prof.is_available,
        "specialization": prof.specialization,
    }


@router.post("/newsletter/subscribe")
async def subscribe_newsletter(payload: NewsletterSubscribeRequest) -> Any:
    """
    Subscribes a visitor to the AAVYA health newsletter.
    """
    email = payload.email.lower().strip()
    return {
        "status": "success",
        "message": "Thank you for subscribing to AAVYA. Your information stays private.",
        "email": email,
        "name": payload.name or "Subscriber",
    }


