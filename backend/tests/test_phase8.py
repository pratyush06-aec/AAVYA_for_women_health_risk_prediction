"""
Phase 8 Test Suite:
- Patient Dashboard: Longitudinal assessment history, explicit consent control toggle.
- Doctor Dashboard: Patient assessment report viewer (gated by consent, 403 Forbidden when revoked),
  availability management, and doctor profile editing.
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_phase8_explicit_consent_control_and_doctor_report_gating():
    """
    Verifies that patient can toggle consent for sharing assessment data with the booked doctor,
    and that the doctor endpoint strictly enforces 403 Forbidden when consent is revoked.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # 1. First, create an assessment record for the patient
        save_payload = {
            "user_email": "priyabouri47@gmail.com",
            "risk_probability": 0.742,
            "risk_percentage": 74.2,
            "risk_category": "Elevated Risk",
            "risk_description": "Phenotypic markers indicate elevated risk.",
            "input_features": {"Cycle(R/I)": "Irregular", "BMI": 28.5},
            "top_contributing_factors": [{"feature": "Cycle(R/I)", "impact": 0.85}],
        }
        rec_res = await ac.post("/api/v1/assessment/save", json=save_payload)
        assert rec_res.status_code == 200
        assessment_id = rec_res.json()["id"]

        # 2. Get verified doctor ID
        doc_res = await ac.get("/api/v1/doctors")
        doc_id = doc_res.json()[0]["id"]

        # 3. Book consultation with default consent = True
        book_payload = {
            "patient_email": "priyabouri47@gmail.com",
            "doctor_id": doc_id,
            "appointment_date": "2026-12-18",
            "time_slot": "03:00 PM",
            "notes": "Review irregular periods and elevated risk score.",
            "assessment_id": assessment_id,
            "consent_share_report": True,
        }
        book_res = await ac.post("/api/v1/appointments/book", json=book_payload)
        assert book_res.status_code == 200
        appt_id = book_res.json()["id"]
        assert book_res.json()["consent_share_report"] is True

        # 4. Doctor queries patient assessment report (Consent is Granted)
        doc_report_res = await ac.get(f"/api/v1/appointments/{appt_id}/patient-assessment")
        assert doc_report_res.status_code == 200
        report_data = doc_report_res.json()
        assert report_data["consent_share_report"] is True
        assert report_data["risk_percentage"] == 74.2
        assert report_data["risk_category"] == "Elevated Risk"

        # 5. Patient revokes consent via explicit consent toggle
        consent_res = await ac.patch(
            f"/api/v1/appointments/{appt_id}/consent",
            json={"consent_share_report": False}
        )
        assert consent_res.status_code == 200
        assert consent_res.json()["consent_share_report"] is False

        # 6. Doctor attempts to view report again (Consent is Revoked -> 403 Forbidden)
        blocked_res = await ac.get(f"/api/v1/appointments/{appt_id}/patient-assessment")
        assert blocked_res.status_code == 403
        assert "revoked consent" in blocked_res.json()["detail"].lower()

        # 7. Patient re-enables consent
        regrant_res = await ac.patch(
            f"/api/v1/appointments/{appt_id}/consent",
            json={"consent_share_report": True}
        )
        assert regrant_res.status_code == 200
        regranted_fetch = await ac.get(f"/api/v1/appointments/{appt_id}/patient-assessment")
        assert regranted_fetch.status_code == 200


@pytest.mark.asyncio
async def test_phase8_doctor_profile_management():
    """
    Verifies that a doctor can update their profile metadata, consultation fee,
    practice location, and availability in NeonDB.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        update_payload = {
            "email": "pratyush0306@gmail.com",
            "consultation_fee": 1100.0,
            "clinic_address": "AAVYA Advanced Endocrine Hub, 100ft Road, Indiranagar",
            "bio": "Leading clinical trials on metabolic PCOS intervention.",
            "is_available": False,
        }
        res = await ac.patch("/api/v1/users/doctor/profile", json=update_payload)
        assert res.status_code == 200
        data = res.json()
        assert data["consultation_fee"] == 1100.0
        assert "100ft Road" in data["clinic_address"]
        assert data["is_available"] is False

        # Verify reflected in doctor discovery
        docs_res = await ac.get("/api/v1/doctors")
        assert docs_res.status_code == 200
        target = next((d for d in docs_res.json() if d["email"] == "pratyush0306@gmail.com"), None)
        assert target is not None
        assert target["consultation_fee"] == 1100.0
        assert target["is_available"] is False

        # Reset availability back to True
        await ac.patch(
            "/api/v1/users/doctor/profile",
            json={"email": "pratyush0306@gmail.com", "is_available": True, "consultation_fee": 900.0}
        )
