"""
Database Table Initialization and User/Doctor Seed Script
Initializes schemas and pre-seeds the designated doctor and patient accounts in NeonDB / SQLite.
"""
import asyncio
from sqlalchemy import select, text
from app.database.session import engine, AsyncSessionLocal
from app.database.base import Base
from app.database.models import User, DoctorProfile, PatientProfile, DoctorSchedule, UserRole

DOCTOR_SEEDS = [
    {
        "email": "pratyush0306@gmail.com",
        "full_name": "Pratyush Dutta",
        "role": UserRole.DOCTOR.value,
        "phone": "+91 98300 12345",
        "is_verified": True,
        "profile": {
            "specialization": "Reproductive Endocrinologist & PCOS Lead",
            "qualification": "MBBS, MD (OBGYN), Fellowship in Reproductive Endocrinology",
            "license_number": "MCI-2015-88312",
            "years_of_experience": 12,
            "clinic_address": "AAVYA Clinical Center, 12th Main, Indiranagar",
            "city": "Bengaluru",
            "consultation_fee": 900.0,
            "bio": "Specialist in complex PCOS phenotyping, metabolic syndromic management, and ovarian restoration.",
            "is_available": True,
        }
    },
    {
        "email": "pratyush032006@gmail.com",
        "full_name": "Pratyush Dutta",
        "role": UserRole.DOCTOR.value,
        "phone": "+91 98300 67890",
        "is_verified": True,
        "profile": {
            "specialization": "Senior Gynecologist & Adolescent PCOS Specialist",
            "qualification": "MBBS, MS (OBGYN), DGO",
            "license_number": "MCI-2016-94103",
            "years_of_experience": 10,
            "clinic_address": "AAVYA Women's Specialty Hub, Sector V, Salt Lake",
            "city": "Kolkata",
            "consultation_fee": 800.0,
            "bio": "Focused on young adult endocrine health, cycle normalization, and lifestyle integration.",
            "is_available": True,
        }
    }
]

PATIENT_SEEDS = [
    {
        "email": "pratyush00710@gmail.com",
        "full_name": "Pratyush (Patient)",
        "role": UserRole.PATIENT.value,
        "phone": "+91 98765 43210",
        "is_verified": True,
        "profile": {
            "date_of_birth": "2002-05-14",
            "age": 24,
            "blood_group": "B+",
            "emergency_contact": "+91 98765 00001",
            "medical_history_summary": "Initial hormonal evaluation requested.",
            "is_onboarding_complete": True,
        }
    },
    {
        "email": "priyabouri47@gmail.com",
        "full_name": "Priya Bouri",
        "role": UserRole.PATIENT.value,
        "phone": "+91 98765 11223",
        "is_verified": True,
        "profile": {
            "date_of_birth": "2003-08-22",
            "age": 23,
            "blood_group": "O+",
            "emergency_contact": "+91 98765 00002",
            "medical_history_summary": "Family history of irregular cycles and metabolic variance.",
            "is_onboarding_complete": True,
        }
    }
]


async def init_and_seed_db():
    print("[NeonDB / Database] Initializing schema tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            await conn.execute(text("ALTER TABLE appointments ADD COLUMN doctor_notes TEXT;"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE appointments ADD COLUMN consent_share_report BOOLEAN DEFAULT 1;"))
        except Exception:
            pass
    print("[NeonDB / Database] Schema tables verified.")

    async with AsyncSessionLocal() as session:
        # Seed Doctors
        for doc_data in DOCTOR_SEEDS:
            stmt = select(User).where(User.email == doc_data["email"])
            res = await session.execute(stmt)
            existing_user = res.scalar_one_or_none()

            if not existing_user:
                print(f"[Seed] Creating doctor account: {doc_data['email']} ({doc_data['full_name']})")
                user = User(
                    email=doc_data["email"],
                    full_name=doc_data["full_name"],
                    role=doc_data["role"],
                    phone=doc_data["phone"],
                    is_verified=doc_data["is_verified"],
                )
                session.add(user)
                await session.flush()

                doc_prof = DoctorProfile(
                    user_id=user.id,
                    **doc_data["profile"]
                )
                session.add(doc_prof)
                await session.flush()
                target_doc_id = user.id
            else:
                print(f"[Seed] Doctor {doc_data['email']} already exists in database.")
                target_doc_id = existing_user.id

            # Ensure default weekly availability schedule exists
            sched_stmt = select(DoctorSchedule).where(DoctorSchedule.doctor_id == target_doc_id)
            sched_res = await session.execute(sched_stmt)
            existing_scheds = sched_res.scalars().all()
            if not existing_scheds:
                print(f"[Seed] Generating weekly consultation schedule for doctor #{target_doc_id}")
                for day in range(7):
                    if day < 5:  # Mon - Fri
                        session.add(DoctorSchedule(
                            doctor_id=target_doc_id,
                            day_of_week=day,
                            start_time="09:00",
                            end_time="17:00",
                            slot_duration_minutes=30,
                            is_active=True
                        ))
                    elif day == 5:  # Sat
                        session.add(DoctorSchedule(
                            doctor_id=target_doc_id,
                            day_of_week=day,
                            start_time="10:00",
                            end_time="14:00",
                            slot_duration_minutes=30,
                            is_active=True
                        ))
                    else:  # Sun
                        session.add(DoctorSchedule(
                            doctor_id=target_doc_id,
                            day_of_week=day,
                            start_time="10:00",
                            end_time="14:00",
                            slot_duration_minutes=30,
                            is_active=False
                        ))

        # Seed Patients
        for pat_data in PATIENT_SEEDS:
            stmt = select(User).where(User.email == pat_data["email"])
            res = await session.execute(stmt)
            existing_user = res.scalar_one_or_none()

            if not existing_user:
                print(f"[Seed] Creating patient account: {pat_data['email']} ({pat_data['full_name']})")
                user = User(
                    email=pat_data["email"],
                    full_name=pat_data["full_name"],
                    role=pat_data["role"],
                    phone=pat_data["phone"],
                    is_verified=pat_data["is_verified"],
                )
                session.add(user)
                await session.flush()

                pat_prof = PatientProfile(
                    user_id=user.id,
                    **pat_data["profile"]
                )
                session.add(pat_prof)
            else:
                print(f"[Seed] Patient {pat_data['email']} already exists in database.")

        await session.commit()
    print("[NeonDB / Database] Seeding complete.")


if __name__ == "__main__":
    asyncio.run(init_and_seed_db())
