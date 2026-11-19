"""
Tests for NLP Symptom Parsing, Assessment Persistence & History, and Doctor Appointment Booking
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_parse_free_text_symptoms():
    payload = {
        "text": "I am 23 years old. I haven't had my period in 45 days, have terrible acne on my jawline and facial hair growth on my chin. I also eat fast food every week and do not exercise."
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/assessment/parse-symptoms", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["extracted_features"]["Age (yrs)"] == 23
    assert data["extracted_features"]["Cycle(R/I)"] == "Irregular"
    assert data["extracted_features"]["hair growth(Y/N)"] == "Yes"
    assert data["extracted_features"]["Pimples(Y/N)"] == "Yes"
    assert data["extracted_features"]["Fast food (Y/N)"] == "Yes"
    assert data["extracted_features"]["Reg.Exercise(Y/N)"] == "No"
    assert len(data["detected_symptoms"]) >= 4


@pytest.mark.asyncio
async def test_parse_symptoms_with_negation():
    payload = {
        "text": "My periods are regular every 28 days. No facial hair and clear skin. I work out regularly."
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/assessment/parse-symptoms", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["extracted_features"].get("Cycle(R/I)") == "Regular"
    assert data["extracted_features"].get("hair growth(Y/N)") == "No"
    assert data["extracted_features"].get("Reg.Exercise(Y/N)") == "Yes"


@pytest.mark.asyncio
async def test_save_and_retrieve_assessment_history():
    user_email = "pratyush00710@gmail.com"
    save_payload = {
        "user_email": user_email,
        "risk_probability": 0.78,
        "risk_percentage": 78.0,
        "risk_category": "Elevated Risk",
        "risk_description": "Elevated likelihood of phenotypic PCOS markers under Rotterdam criteria.",
        "input_features": {
            "Age (yrs)": 24,
            "Cycle(R/I)": "Irregular",
            "hair growth(Y/N)": "Yes",
            "Pimples(Y/N)": "Yes"
        },
        "top_contributing_factors": [
            {"feature": "Cycle(R/I)", "impact": 1.45, "direction": "increases_risk"},
            {"feature": "hair growth(Y/N)", "impact": 0.82, "direction": "increases_risk"}
        ]
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Save
        save_res = await client.post("/api/v1/assessment/save", json=save_payload)
        assert save_res.status_code == 200
        saved_data = save_res.json()
        assert saved_data["risk_percentage"] == 78.0
        assert saved_data["risk_category"] == "Elevated Risk"
        record_id = saved_data["id"]

        # Retrieve History
        hist_res = await client.get(f"/api/v1/assessment/history?email={user_email}")
        assert hist_res.status_code == 200
        history = hist_res.json()
        assert len(history) >= 1
        assert any(h["id"] == record_id for h in history)


@pytest.mark.asyncio
async def test_appointment_booking_and_status_flow():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Fetch verified doctors to get doctor ID
        doc_res = await client.get("/api/v1/users/doctors")
        assert doc_res.status_code == 200
        doctors = doc_res.json()
        assert len(doctors) > 0
        doctor_id = doctors[0]["id"]
        doctor_email = doctors[0]["email"]

        # 2. Book appointment
        book_payload = {
            "patient_email": "priyabouri47@gmail.com",
            "doctor_id": doctor_id,
            "appointment_date": "2026-12-05",
            "time_slot": "11:30 AM",
            "notes": "Follow-up discussion on elevated metabolic assessment scores.",
            "assessment_id": None
        }
        book_res = await client.post("/api/v1/appointments/book", json=book_payload)
        assert book_res.status_code == 200
        appt = book_res.json()
        assert appt["status"] == "PENDING"
        assert appt["time_slot"] == "11:30 AM"
        appt_id = appt["id"]

        # 3. Patient checks appointments
        pat_appts_res = await client.get("/api/v1/appointments/patient?email=priyabouri47@gmail.com")
        assert pat_appts_res.status_code == 200
        pat_appts = pat_appts_res.json()
        assert any(a["id"] == appt_id for a in pat_appts)

        # 4. Doctor checks appointments
        doc_appts_res = await client.get(f"/api/v1/appointments/doctor?email={doctor_email}")
        assert doc_appts_res.status_code == 200
        doc_appts = doc_appts_res.json()
        assert any(a["id"] == appt_id for a in doc_appts)

        # 5. Doctor confirms appointment
        update_res = await client.patch(
            f"/api/v1/appointments/{appt_id}/status",
            json={"status": "CONFIRMED"}
        )
        assert update_res.status_code == 200
        assert update_res.json()["status"] == "CONFIRMED"
