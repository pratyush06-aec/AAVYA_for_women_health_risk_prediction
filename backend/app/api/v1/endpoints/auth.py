"""
Authentication & User Sync Endpoints (Clerk Integration + NeonDB Persistence)
"""
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import User, DoctorProfile, PatientProfile, UserRole
from app.schemas.user import UserSyncRequest, UserResponse, DoctorProfileSchema, PatientProfileSchema

router = APIRouter()

DESIGNATED_DOCTOR_EMAILS = {
    "pratyush0306@gmail.com",
    "pratyush032006@gmail.com",
}


@router.post("/sync", response_model=UserResponse)
async def sync_clerk_user(
    payload: UserSyncRequest,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    Syncs a Clerk authenticated user with NeonDB:
    - If user exists: links clerk_id, fetches full profile and role.
    - If user is new:
      - Assigns DOCTOR role if email matches designated doctor list (pratyush0306@gmail.com, pratyush032006@gmail.com).
      - Otherwise assigns PATIENT role and flags is_profile_complete = False so they are prompted for onboarding.
    """
    email_clean = payload.email.lower().strip()

    # Query existing user by email or clerk_id with profiles eagerly loaded
    stmt = (
        select(User)
        .options(
            selectinload(User.doctor_profile),
            selectinload(User.patient_profile),
        )
        .where((User.email == email_clean) | (User.clerk_id == payload.clerk_id))
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if user:
        # Update clerk_id or avatar if missing
        if not user.clerk_id or user.clerk_id != payload.clerk_id:
            user.clerk_id = payload.clerk_id
        if payload.avatar_url and not user.avatar_url:
            user.avatar_url = payload.avatar_url
        await db.commit()
        await db.refresh(user)
    else:
        # New user registration
        is_doctor = email_clean in DESIGNATED_DOCTOR_EMAILS
        role = UserRole.DOCTOR.value if is_doctor else UserRole.PATIENT.value

        user = User(
            clerk_id=payload.clerk_id,
            email=email_clean,
            full_name=payload.full_name or "New User",
            role=role,
            avatar_url=payload.avatar_url,
            is_verified=is_doctor,
        )
        db.add(user)
        await db.flush()

        if is_doctor:
            doc_prof = DoctorProfile(
                user_id=user.id,
                specialization="Reproductive Endocrinologist & PCOS Specialist",
                qualification="MBBS, MD (OBGYN)",
                license_number="MCI-PENDING-VERIFICATION",
                years_of_experience=8,
                clinic_address="AAVYA Endocrine Care Network",
                city="Bengaluru",
                consultation_fee=800.0,
                bio="Consultant reproductive physician specializing in PCOS and hormonal health.",
                is_available=True,
            )
            db.add(doc_prof)
        else:
            pat_prof = PatientProfile(
                user_id=user.id,
                is_onboarding_complete=False,
            )
            db.add(pat_prof)

        await db.commit()
        # Re-query with eager load
        stmt = (
            select(User)
            .options(
                selectinload(User.doctor_profile),
                selectinload(User.patient_profile),
            )
            .where(User.id == user.id)
        )
        res = await db.execute(stmt)
        user = res.scalar_one()

    # Determine if profile is complete
    is_complete = True
    if user.role == UserRole.PATIENT.value:
        is_complete = bool(user.patient_profile and user.patient_profile.is_onboarding_complete)

    return UserResponse(
        id=user.id,
        clerk_id=user.clerk_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        avatar_url=user.avatar_url,
        is_verified=user.is_verified,
        is_profile_complete=is_complete,
        doctor_profile=DoctorProfileSchema.model_validate(user.doctor_profile) if user.doctor_profile else None,
        patient_profile=PatientProfileSchema.model_validate(user.patient_profile) if user.patient_profile else None,
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    email: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """Fetches user and profile by email from NeonDB"""
    stmt = (
        select(User)
        .options(
            selectinload(User.doctor_profile),
            selectinload(User.patient_profile),
        )
        .where(User.email == email.lower().strip())
    )
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found in database",
        )

    is_complete = True
    if user.role == UserRole.PATIENT.value:
        is_complete = bool(user.patient_profile and user.patient_profile.is_onboarding_complete)

    return UserResponse(
        id=user.id,
        clerk_id=user.clerk_id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        avatar_url=user.avatar_url,
        is_verified=user.is_verified,
        is_profile_complete=is_complete,
        doctor_profile=DoctorProfileSchema.model_validate(user.doctor_profile) if user.doctor_profile else None,
        patient_profile=PatientProfileSchema.model_validate(user.patient_profile) if user.patient_profile else None,
    )
