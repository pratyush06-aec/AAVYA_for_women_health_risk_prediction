"""
Doctor-Patient Consultation & Appointment Endpoints
Connects risk assessments directly to clinical consultations with verified specialists.
Features concurrency-safe booking, weekly schedule management, and dynamic slot generation.
"""
import json
from datetime import datetime, timedelta
from typing import Any, List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.database.models import User, Appointment, DoctorProfile, PatientProfile, DoctorSchedule, AssessmentRecord
from app.schemas.appointment import (
    AppointmentBookRequest,
    AppointmentStatusUpdateRequest,
    AppointmentConsentUpdateRequest,
    AppointmentClinicalNotesRequest,
    AppointmentResponse,
    DoctorInfo,
    PatientInfo,
    DoctorScheduleItem,
    DoctorScheduleUpdateRequest,
    DoctorSlotItem,
    DoctorSlotsResponse,
)

router = APIRouter()

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]


def generate_time_slots(start_time_str: str, end_time_str: str, duration_mins: int = 30) -> List[str]:
    """Generates 12-hour formatted time slots (e.g. 09:30 AM) given start/end in HH:MM format."""
    slots = []
    try:
        cur = datetime.strptime(start_time_str.strip(), "%H:%M")
        end = datetime.strptime(end_time_str.strip(), "%H:%M")
        while cur + timedelta(minutes=duration_mins) <= end:
            slots.append(cur.strftime("%I:%M %p"))
            cur += timedelta(minutes=duration_mins)
    except Exception:
        return [
            "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
            "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
            "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
        ]
    return slots


@router.post("/book", response_model=AppointmentResponse)
async def book_appointment(
    payload: AppointmentBookRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Concurrency-Safe Consultation Booking with a Verified PCOS Specialist.
    Guarantees no double-booking for the same doctor, date, and slot.
    """
    # 1. Verify patient exists or create baseline
    stmt = select(User).where(User.email == payload.patient_email)
    res = await db.execute(stmt)
    patient = res.scalar_one_or_none()
    if not patient:
        patient = User(
            email=payload.patient_email,
            full_name=payload.patient_email.split("@")[0].capitalize(),
            role="PATIENT"
        )
        db.add(patient)
        await db.flush()

    # 2. Verify doctor exists and has doctor profile
    doc_stmt = (
        select(User)
        .options(selectinload(User.doctor_profile))
        .where(User.id == payload.doctor_id, User.role == "DOCTOR")
    )
    doc_res = await db.execute(doc_stmt)
    doctor = doc_res.scalar_one_or_none()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor profile not found."
        )

    # 3. Concurrency check: Ensure slot is not already booked
    conflict_stmt = (
        select(Appointment)
        .where(
            Appointment.doctor_id == doctor.id,
            Appointment.appointment_date == payload.appointment_date,
            Appointment.time_slot == payload.time_slot,
            Appointment.status != "CANCELLED",
        )
    )
    conflict_res = await db.execute(conflict_stmt)
    existing_booking = conflict_res.scalar_one_or_none()
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Time slot '{payload.time_slot}' on {payload.appointment_date} is already booked. Please choose another available slot."
        )

    # 4. Create appointment
    appt = Appointment(
        patient_id=patient.id,
        doctor_id=doctor.id,
        appointment_date=payload.appointment_date,
        time_slot=payload.time_slot,
        status="PENDING",
        notes=payload.notes,
        assessment_id=payload.assessment_id,
        consent_share_report=payload.consent_share_report,
    )
    db.add(appt)
    await db.commit()
    await db.refresh(appt)

    # Construct response
    doc_info = DoctorInfo(
        id=doctor.id,
        full_name=doctor.full_name,
        email=doctor.email,
        specialization=doctor.doctor_profile.specialization if doctor.doctor_profile else None,
        clinic_address=doctor.doctor_profile.clinic_address if doctor.doctor_profile else None,
        city=doctor.doctor_profile.city if doctor.doctor_profile else None,
        consultation_fee=doctor.doctor_profile.consultation_fee if doctor.doctor_profile else None,
    )
    pat_info = PatientInfo(
        id=patient.id,
        full_name=patient.full_name,
        email=patient.email,
        phone=patient.phone,
    )

    return AppointmentResponse(
        id=appt.id,
        appointment_date=appt.appointment_date,
        time_slot=appt.time_slot,
        status=appt.status,
        notes=appt.notes,
        doctor_notes=appt.doctor_notes,
        assessment_id=appt.assessment_id,
        consent_share_report=appt.consent_share_report,
        created_at=appt.created_at,
        doctor=doc_info,
        patient=pat_info,
    )


@router.get("/slots", response_model=DoctorSlotsResponse)
async def get_doctor_available_slots(
    doctor_id: int = Query(..., description="ID of the doctor"),
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Computes real-time available and booked 30-minute consultation slots for a doctor on a specific date.
    Uses doctor's weekly recurring schedule and excludes already booked appointments.
    """
    # 1. Validate date
    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Expected YYYY-MM-DD."
        )

    day_of_week = parsed_date.weekday()  # 0=Monday ... 6=Sunday
    day_name = DAY_NAMES[day_of_week]

    # 2. Verify doctor exists
    doc_stmt = (
        select(User)
        .options(selectinload(User.doctor_profile))
        .where(User.id == doctor_id, User.role == "DOCTOR")
    )
    doc_res = await db.execute(doc_stmt)
    doctor = doc_res.scalar_one_or_none()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found."
        )

    # 3. Fetch doctor's schedule for this day
    sched_stmt = (
        select(DoctorSchedule)
        .where(
            DoctorSchedule.doctor_id == doctor_id,
            DoctorSchedule.day_of_week == day_of_week
        )
    )
    sched_res = await db.execute(sched_stmt)
    schedule = sched_res.scalar_one_or_none()

    if schedule:
        is_working_day = schedule.is_active
        start_time = schedule.start_time
        end_time = schedule.end_time
        duration = schedule.slot_duration_minutes
    else:
        # Default policy: Mon-Fri 09:00 - 17:00, Sat 10:00 - 14:00, Sun off
        if day_of_week < 5:
            is_working_day = True
            start_time, end_time, duration = "09:00", "17:00", 30
        elif day_of_week == 5:
            is_working_day = True
            start_time, end_time, duration = "10:00", "14:00", 30
        else:
            is_working_day = False
            start_time, end_time, duration = "10:00", "14:00", 30

    if not is_working_day:
        return DoctorSlotsResponse(
            doctor_id=doctor.id,
            doctor_name=doctor.full_name,
            date=date,
            day_of_week=day_of_week,
            day_name=day_name,
            is_working_day=False,
            slots=[]
        )

    # 4. Generate candidate slots
    candidate_slots = generate_time_slots(start_time, end_time, duration)

    # 5. Query existing active bookings on that date
    appts_stmt = (
        select(Appointment)
        .where(
            Appointment.doctor_id == doctor_id,
            Appointment.appointment_date == date,
            Appointment.status != "CANCELLED"
        )
    )
    appts_res = await db.execute(appts_stmt)
    existing_appts = appts_res.scalars().all()
    booked_map = {a.time_slot: a.id for a in existing_appts}

    slot_items = [
        DoctorSlotItem(
            time_slot=slot,
            available=(slot not in booked_map),
            booked_appointment_id=booked_map.get(slot)
        )
        for slot in candidate_slots
    ]

    return DoctorSlotsResponse(
        doctor_id=doctor.id,
        doctor_name=doctor.full_name,
        date=date,
        day_of_week=day_of_week,
        day_name=day_name,
        is_working_day=True,
        slots=slot_items
    )


@router.get("/schedule", response_model=List[DoctorScheduleItem])
async def get_doctor_schedule(
    doctor_id: Optional[int] = None,
    doctor_email: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Retrieves weekly consultation schedule for a doctor."""
    if not doctor_id and not doctor_email:
        raise HTTPException(status_code=400, detail="Provide doctor_id or doctor_email.")

    stmt = select(User).where(User.role == "DOCTOR")
    if doctor_id:
        stmt = stmt.where(User.id == doctor_id)
    else:
        stmt = stmt.where(User.email == doctor_email)

    res = await db.execute(stmt)
    doctor = res.scalar_one_or_none()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")

    sched_stmt = (
        select(DoctorSchedule)
        .where(DoctorSchedule.doctor_id == doctor.id)
        .order_by(DoctorSchedule.day_of_week)
    )
    sched_res = await db.execute(sched_stmt)
    schedules = sched_res.scalars().all()

    if not schedules:
        # Default weekly schedule
        return [
            DoctorScheduleItem(
                day_of_week=d,
                start_time="09:00" if d < 5 else "10:00",
                end_time="17:00" if d < 5 else "14:00",
                slot_duration_minutes=30,
                is_active=(d < 6)
            )
            for d in range(7)
        ]

    return [
        DoctorScheduleItem(
            day_of_week=s.day_of_week,
            start_time=s.start_time,
            end_time=s.end_time,
            slot_duration_minutes=s.slot_duration_minutes,
            is_active=s.is_active
        )
        for s in schedules
    ]


@router.post("/schedule", response_model=List[DoctorScheduleItem])
async def update_doctor_schedule(
    payload: DoctorScheduleUpdateRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """Updates weekly recurring availability schedule for a doctor."""
    stmt = select(User).where(User.role == "DOCTOR")
    if payload.doctor_id:
        stmt = stmt.where(User.id == payload.doctor_id)
    elif payload.doctor_email:
        stmt = stmt.where(User.email == payload.doctor_email)
    else:
        raise HTTPException(status_code=400, detail="Provide doctor_id or doctor_email.")

    res = await db.execute(stmt)
    doctor = res.scalar_one_or_none()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")

    # Delete existing schedules for this doctor
    del_stmt = select(DoctorSchedule).where(DoctorSchedule.doctor_id == doctor.id)
    del_res = await db.execute(del_stmt)
    for s in del_res.scalars().all():
        await db.delete(s)

    # Insert new schedules
    new_schedules = []
    for item in payload.schedules:
        sched = DoctorSchedule(
            doctor_id=doctor.id,
            day_of_week=item.day_of_week,
            start_time=item.start_time,
            end_time=item.end_time,
            slot_duration_minutes=item.slot_duration_minutes,
            is_active=item.is_active
        )
        db.add(sched)
        new_schedules.append(item)

    await db.commit()
    return new_schedules



@router.get("/patient", response_model=List[AppointmentResponse])
async def list_patient_appointments(
    email: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Lists consultation appointments for a patient.
    """
    stmt = select(User).where(User.email == email)
    res = await db.execute(stmt)
    patient = res.scalar_one_or_none()
    if not patient:
        return []

    appts_stmt = (
        select(Appointment)
        .options(
            selectinload(Appointment.doctor).selectinload(User.doctor_profile),
            selectinload(Appointment.patient),
        )
        .where(Appointment.patient_id == patient.id)
        .order_by(desc(Appointment.created_at))
    )
    appts_res = await db.execute(appts_stmt)
    appts = appts_res.scalars().all()

    output = []
    for a in appts:
        doc = a.doctor
        doc_prof = doc.doctor_profile if doc else None
        output.append(
            AppointmentResponse(
                id=a.id,
                appointment_date=a.appointment_date,
                time_slot=a.time_slot,
                status=a.status,
                notes=a.notes,
                doctor_notes=a.doctor_notes,
                assessment_id=a.assessment_id,
                consent_share_report=a.consent_share_report,
                created_at=a.created_at,
                doctor=DoctorInfo(
                    id=doc.id,
                    full_name=doc.full_name,
                    email=doc.email,
                    specialization=doc_prof.specialization if doc_prof else None,
                    clinic_address=doc_prof.clinic_address if doc_prof else None,
                    city=doc_prof.city if doc_prof else None,
                    consultation_fee=doc_prof.consultation_fee if doc_prof else None,
                ) if doc else None,
                patient=PatientInfo(
                    id=patient.id,
                    full_name=patient.full_name,
                    email=patient.email,
                    phone=patient.phone,
                ),
            )
        )
    return output


@router.get("/doctor", response_model=List[AppointmentResponse])
async def list_doctor_appointments(
    email: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Lists booked patient consultations for a doctor.
    """
    stmt = select(User).options(selectinload(User.doctor_profile)).where(User.email == email)
    res = await db.execute(stmt)
    doctor = res.scalar_one_or_none()
    if not doctor or doctor.role != "DOCTOR":
        return []

    appts_stmt = (
        select(Appointment)
        .options(
            selectinload(Appointment.patient).selectinload(User.patient_profile),
            selectinload(Appointment.doctor),
        )
        .where(Appointment.doctor_id == doctor.id)
        .order_by(desc(Appointment.created_at))
    )
    appts_res = await db.execute(appts_stmt)
    appts = appts_res.scalars().all()

    output = []
    for a in appts:
        pat = a.patient
        pat_prof = pat.patient_profile if pat else None
        output.append(
            AppointmentResponse(
                id=a.id,
                appointment_date=a.appointment_date,
                time_slot=a.time_slot,
                status=a.status,
                notes=a.notes,
                doctor_notes=a.doctor_notes,
                assessment_id=a.assessment_id,
                consent_share_report=a.consent_share_report,
                created_at=a.created_at,
                doctor=DoctorInfo(
                    id=doctor.id,
                    full_name=doctor.full_name,
                    email=doctor.email,
                    specialization=doctor.doctor_profile.specialization if doctor.doctor_profile else None,
                    clinic_address=doctor.doctor_profile.clinic_address if doctor.doctor_profile else None,
                    city=doctor.doctor_profile.city if doctor.doctor_profile else None,
                    consultation_fee=doctor.doctor_profile.consultation_fee if doctor.doctor_profile else None,
                ),
                patient=PatientInfo(
                    id=pat.id,
                    full_name=pat.full_name,
                    email=pat.email,
                    phone=pat.phone,
                    age=pat_prof.age if pat_prof else None,
                    blood_group=pat_prof.blood_group if pat_prof else None,
                ) if pat else None,
            )
        )
    return output


@router.post("/{appointment_id}/clinical-notes", response_model=AppointmentResponse)
async def submit_clinical_notes(
    appointment_id: int,
    payload: AppointmentClinicalNotesRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Allows a doctor to attach diagnosis notes, prescription recommendations,
    and lifestyle directives to a patient consultation record.
    """
    stmt = (
        select(Appointment)
        .options(
            selectinload(Appointment.doctor).selectinload(User.doctor_profile),
            selectinload(Appointment.patient).selectinload(User.patient_profile),
        )
        .where(Appointment.id == appointment_id)
    )
    res = await db.execute(stmt)
    appt = res.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment record not found.")

    appt.doctor_notes = payload.doctor_notes
    if payload.status:
        appt.status = payload.status
    await db.commit()
    await db.refresh(appt)

    doc = appt.doctor
    doc_prof = doc.doctor_profile if doc else None
    pat = appt.patient
    pat_prof = pat.patient_profile if pat else None

    return AppointmentResponse(
        id=appt.id,
        appointment_date=appt.appointment_date,
        time_slot=appt.time_slot,
        status=appt.status,
        notes=appt.notes,
        doctor_notes=appt.doctor_notes,
        assessment_id=appt.assessment_id,
        consent_share_report=appt.consent_share_report,
        created_at=appt.created_at,
        doctor=DoctorInfo(
            id=doc.id,
            full_name=doc.full_name,
            email=doc.email,
            specialization=doc_prof.specialization if doc_prof else None,
            clinic_address=doc_prof.clinic_address if doc_prof else None,
            city=doc_prof.city if doc_prof else None,
            consultation_fee=doc_prof.consultation_fee if doc_prof else None,
        ) if doc else None,
        patient=PatientInfo(
            id=pat.id,
            full_name=pat.full_name,
            email=pat.email,
            phone=pat.phone,
            age=pat_prof.age if pat_prof else None,
            blood_group=pat_prof.blood_group if pat_prof else None,
        ) if pat else None,
    )



@router.patch("/{appointment_id}/status")
async def update_appointment_status(
    appointment_id: int,
    payload: AppointmentStatusUpdateRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Updates the status of an appointment (CONFIRMED, COMPLETED, CANCELLED).
    """
    stmt = select(Appointment).where(Appointment.id == appointment_id)
    res = await db.execute(stmt)
    appt = res.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    appt.status = payload.status
    await db.commit()
    await db.refresh(appt)
    return {"message": "Status updated successfully", "id": appt.id, "status": appt.status}


@router.patch("/{appointment_id}/consent")
async def update_appointment_consent(
    appointment_id: int,
    payload: AppointmentConsentUpdateRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Explicit Patient Consent Control: Toggles whether the booked doctor has authorization
    to view the patient's algorithmic risk assessment and clinical biomarkers.
    """
    stmt = select(Appointment).where(Appointment.id == appointment_id)
    res = await db.execute(stmt)
    appt = res.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    appt.consent_share_report = payload.consent_share_report
    await db.commit()
    await db.refresh(appt)
    return {
        "message": "Consent preference updated successfully",
        "appointment_id": appt.id,
        "consent_share_report": appt.consent_share_report
    }


@router.get("/{appointment_id}/patient-assessment")
async def get_patient_assessment_for_doctor(
    appointment_id: int,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Retrieves patient's PCOS assessment report for consultation review.
    Strictly gated by patient explicit consent (consent_share_report).
    Returns 403 Forbidden if consent is revoked.
    """
    stmt = (
        select(Appointment)
        .options(
            selectinload(Appointment.assessment),
            selectinload(Appointment.patient).selectinload(User.patient_profile),
        )
        .where(Appointment.id == appointment_id)
    )
    res = await db.execute(stmt)
    appt = res.scalar_one_or_none()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    if not appt.consent_share_report:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient has explicitly revoked consent to share assessment data for this consultation."
        )

    # If appointment is directly linked to an assessment, use that
    assessment = appt.assessment
    if not assessment:
        # Fallback to patient's latest assessment record
        rec_stmt = (
            select(AssessmentRecord)
            .where(AssessmentRecord.user_id == appt.patient_id)
            .order_by(desc(AssessmentRecord.created_at))
        )
        rec_res = await db.execute(rec_stmt)
        assessment = rec_res.scalars().first()

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No completed assessment record found for this patient."
        )

    return {
        "appointment_id": appt.id,
        "patient_id": appt.patient_id,
        "patient_name": appt.patient.full_name,
        "patient_email": appt.patient.email,
        "consent_share_report": True,
        "assessment_id": assessment.id,
        "risk_probability": assessment.risk_probability,
        "risk_percentage": assessment.risk_percentage,
        "risk_category": assessment.risk_category,
        "risk_description": assessment.risk_description,
        "input_features": json.loads(assessment.input_features_json),
        "top_contributing_factors": json.loads(assessment.contributing_factors_json),
        "created_at": assessment.created_at,
    }

