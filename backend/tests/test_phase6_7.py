"""
Phase 6 & Phase 7 Test Suite:
- Phase 6: Free-text symptom extraction, candidate symptom recognition, and model confidence score prediction.
- Phase 7: Doctor discovery, weekly recurring schedule management, dynamic slot generation, and concurrency-safe booking (409 Conflict on double-booking).
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_phase6_freetext_symptom_extraction_and_alias():
    """Verifies that free-text symptom intake correctly extracts phenotypic and cycle markers."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        text_payload = {
            "text": "I haven't had my period in 45 days. My face has severe cystic acne and I've noticed excess facial hair on my chin. I also gained weight and eat junk food daily."
        }
        # Test alias endpoint /extract-symptoms
        res = await ac.post("/api/v1/assessment/extract-symptoms", json=text_payload)
        assert res.status_code == 200
        data = res.json()
        assert "extracted_features" in data
        assert "detected_symptoms" in data
        feats = data["extracted_features"]
        assert feats.get("Cycle(R/I)") == "Irregular"
        assert feats.get("hair growth(Y/N)") == "Yes"
        assert feats.get("Pimples(Y/N)") == "Yes"
        assert feats.get("Weight gain(Y/N)") == "Yes"
        assert feats.get("Fast food (Y/N)") == "Yes"

        # Now test that extracted features feed directly into the trained model inference engine
        pred_res = await ac.post("/api/v1/assessment/predict", json={"features": feats})
        assert pred_res.status_code == 200
        pred_data = pred_res.json()
        assert "confidence_score" in pred_data
        assert pred_data["confidence_score"] > 50.0
        assert "risk_category" in pred_data
        assert "disclaimer" in pred_data
        assert "Logistic Regression" in pred_data["model_architecture"]


@pytest.mark.asyncio
async def test_phase7_doctor_discovery_endpoints():
    """Verifies both /api/v1/doctors and /api/v1/users/doctors return verified doctors."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        res1 = await ac.get("/api/v1/doctors")
        assert res1.status_code == 200
        docs1 = res1.json()
        assert len(docs1) >= 2

        res2 = await ac.get("/api/v1/users/doctors?city=Bengaluru")
        assert res2.status_code == 200
        docs2 = res2.json()
        assert len(docs2) >= 1
        assert "Bengaluru" in docs2[0]["city"]


@pytest.mark.asyncio
async def test_phase7_doctor_schedule_management_and_slots():
    """Verifies weekly recurring schedule configuration and slot generation."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get doctors to find ID
        doc_res = await ac.get("/api/v1/doctors")
        doc = doc_res.json()[0]
        doc_id = doc["id"]

        # 1. Fetch current weekly schedule
        sched_res = await ac.get(f"/api/v1/appointments/schedule?doctor_id={doc_id}")
        assert sched_res.status_code == 200
        schedules = sched_res.json()
        assert len(schedules) == 7

        # 2. Update schedule: set Monday to 10:00 - 13:00 (30 min slots)
        updated_schedules = [
            {
                "day_of_week": 0,  # Monday
                "start_time": "10:00",
                "end_time": "13:00",
                "slot_duration_minutes": 30,
                "is_active": True,
            }
        ]
        upd_res = await ac.post(
            "/api/v1/appointments/schedule",
            json={"doctor_id": doc_id, "schedules": updated_schedules}
        )
        assert upd_res.status_code == 200

        # 3. Query slots on a Monday (2026-12-07 is a Monday)
        slots_res = await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}&date=2026-12-07")
        assert slots_res.status_code == 200
        slot_data = slots_res.json()
        assert slot_data["is_working_day"] is True
        assert slot_data["day_name"] == "Monday"
        times = [s["time_slot"] for s in slot_data["slots"]]
        assert "10:00 AM" in times
        assert "10:30 AM" in times
        assert "12:30 PM" in times


@pytest.mark.asyncio
async def test_phase7_concurrency_safe_booking_conflict():
    """
    Verifies that simultaneous or duplicate bookings on the exact same doctor, date,
    and time slot result in a 409 Conflict for the second booking attempt.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        # Get doctor
        doc_res = await ac.get("/api/v1/doctors")
        doc_id = doc_res.json()[0]["id"]

        booking_date = "2026-12-15"
        booking_slot = "11:00 AM"

        # Patient 1 books the slot
        payload_1 = {
            "patient_email": "pratyush00710@gmail.com",
            "doctor_id": doc_id,
            "appointment_date": booking_date,
            "time_slot": booking_slot,
            "notes": "Patient 1 first consultation",
        }
        res_1 = await ac.post("/api/v1/appointments/book", json=payload_1)
        assert res_1.status_code == 200
        data_1 = res_1.json()
        assert data_1["time_slot"] == booking_slot
        assert data_1["status"] in ("CONFIRMED", "PENDING")

        # Patient 2 attempts to book the EXACT SAME doctor, date, and slot
        payload_2 = {
            "patient_email": "priyabouri47@gmail.com",
            "doctor_id": doc_id,
            "appointment_date": booking_date,
            "time_slot": booking_slot,
            "notes": "Patient 2 conflicting attempt",
        }
        res_2 = await ac.post("/api/v1/appointments/book", json=payload_2)
        assert res_2.status_code == 409
        assert "already booked" in res_2.json()["detail"]

        # Verify that GET /slots marks this slot as available = False
        slots_res = await ac.get(f"/api/v1/appointments/slots?doctor_id={doc_id}&date={booking_date}")
        assert slots_res.status_code == 200
        slot_items = slots_res.json()["slots"]
        target_slot = next((s for s in slot_items if s["time_slot"] == booking_slot), None)
        assert target_slot is not None
        assert target_slot["available"] is False
