"""
Unit and Integration Tests for Clerk Auth Sync, Role Assignment, and Onboarding in NeonDB
"""
from uuid import uuid4
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_sync_existing_doctor():
    payload = {
        "clerk_id": "user_clerk_doc_01",
        "email": "pratyush0306@gmail.com",
        "full_name": "Pratyush Dutta",
        "avatar_url": "https://img.clerk.com/doc1.png",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/auth/sync", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "pratyush0306@gmail.com"
    assert data["role"] == "DOCTOR"
    assert data["full_name"] == "Pratyush Dutta"
    assert data["is_profile_complete"] is True
    assert data["doctor_profile"] is not None
    assert "Endocrinologist" in data["doctor_profile"]["specialization"]


@pytest.mark.asyncio
async def test_sync_second_doctor():
    payload = {
        "clerk_id": "user_clerk_doc_02",
        "email": "pratyush032006@gmail.com",
        "full_name": "Pratyush Dutta",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/auth/sync", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "pratyush032006@gmail.com"
    assert data["role"] == "DOCTOR"
    assert data["doctor_profile"]["city"] == "Kolkata"


@pytest.mark.asyncio
async def test_sync_existing_patient():
    payload = {
        "clerk_id": "user_clerk_pat_01",
        "email": "pratyush00710@gmail.com",
        "full_name": "Pratyush (Patient)",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/auth/sync", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "pratyush00710@gmail.com"
    assert data["role"] == "PATIENT"
    assert data["is_profile_complete"] is True
    assert data["patient_profile"]["age"] == 24


@pytest.mark.asyncio
async def test_sync_new_patient_and_onboarding():
    unique_id = uuid4().hex[:6]
    new_email = f"newpatient_{unique_id}@gmail.com"
    payload = {
        "clerk_id": f"user_clerk_new_{unique_id}",
        "email": new_email,
        "full_name": "Riya Sharma",
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Sync new user
        res = await client.post("/api/v1/auth/sync", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["role"] == "PATIENT"
        assert data["is_profile_complete"] is False

        # Step 2: Complete onboarding
        onboard_payload = {
            "age": 25,
            "date_of_birth": "2001-03-12",
            "phone": "+91 91234 56789",
            "blood_group": "A+",
            "emergency_contact": "+91 91234 00000",
            "medical_history_summary": "Irregular periods and acne.",
        }
        onboard_res = await client.post(
            f"/api/v1/users/onboarding?email={new_email}",
            json=onboard_payload
        )
        assert onboard_res.status_code == 200
        onboard_data = onboard_res.json()
        assert onboard_data["is_profile_complete"] is True
        assert onboard_data["patient_profile"]["blood_group"] == "A+"
        assert onboard_data["patient_profile"]["age"] == 25


@pytest.mark.asyncio
async def test_list_verified_doctors():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.get("/api/v1/users/doctors")
    assert res.status_code == 200
    doctors = res.json()
    assert len(doctors) >= 2
    doc_emails = [d["email"] for d in doctors]
    assert "pratyush0306@gmail.com" in doc_emails
    assert "pratyush032006@gmail.com" in doc_emails
