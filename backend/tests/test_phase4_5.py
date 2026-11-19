"""
Unit and Integration Tests for Phase 4 (Doctor Discovery & Clinical Notes)
and Phase 5 (Conversational Symptom Chatbot with Trained Model Confidence Score)
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_chat_symptom_description_prints_confidence_score():
    """
    Phase 5 test: User describes symptoms and asks for prediction.
    Verifies that the trained model runs, evaluates features, and prints
    the statistical confidence score, risk probability, and feature impacts.
    """
    payload = {
        "message": "I haven't had my period in 45 days, have terrible cystic acne along my jawline, and facial hair on my chin. Can you predict my PCOS risk score?",
        "history": []
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/chat/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_prediction_triggered"] is True
    assert data["confidence_score"] is not None
    assert 50.0 <= data["confidence_score"] <= 100.0
    assert 0.0 <= data["risk_percentage"] <= 100.0
    assert data["risk_category"] in ["Low Risk", "Moderate Risk", "Elevated Risk"]
    assert "Trained Model Confidence Score" in data["reply"]
    assert f"`{data['confidence_score']}%`" in data["reply"]
    assert len(data["detected_symptoms"]) >= 2


@pytest.mark.asyncio
async def test_chat_general_rotterdam_query():
    """
    Phase 5 test: User asks educational question about Rotterdam diagnostic guidelines.
    """
    payload = {
        "message": "What are the Rotterdam criteria for diagnosing PCOS?",
        "history": []
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        res = await client.post("/api/v1/chat/message", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_prediction_triggered"] is False
    assert "Rotterdam Consensus" in data["reply"]
    assert "Hyperandrogenism" in data["reply"]


@pytest.mark.asyncio
async def test_doctor_discovery_with_city_and_specialty_filter():
    """
    Phase 4 test: Doctor directory search with filtering by city & specialization.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # 1. Filter by city: Bengaluru
        res_blr = await client.get("/api/v1/users/doctors?city=Bengaluru")
        assert res_blr.status_code == 200
        blr_docs = res_blr.json()
        assert len(blr_docs) >= 1
        assert all("Bengaluru" in d["city"] for d in blr_docs)

        # 2. Filter by city: Kolkata
        res_kol = await client.get("/api/v1/users/doctors?city=Kolkata")
        assert res_kol.status_code == 200
        kol_docs = res_kol.json()
        assert len(kol_docs) >= 1
        assert all("Kolkata" in d["city"] for d in kol_docs)


@pytest.mark.asyncio
async def test_doctor_clinical_notes_submission():
    """
    Phase 4 test: Doctor submits clinical diagnosis and prescription notes on an appointment.
    """
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        # Step 1: Book appointment
        doc_res = await client.get("/api/v1/users/doctors")
        doctor_id = doc_res.json()[0]["id"]

        book_res = await client.post("/api/v1/appointments/book", json={
            "patient_email": "priyabouri47@gmail.com",
            "doctor_id": doctor_id,
            "appointment_date": "2026-12-10",
            "time_slot": "02:30 PM",
            "notes": "Patient reports severe oligomenorrhea and hyperandrogenic phenotypes."
        })
        assert book_res.status_code == 200
        appt_id = book_res.json()["id"]

        # Step 2: Doctor submits clinical notes
        notes_payload = {
            "doctor_notes": "Prescribed Myo-inositol + D-Chiro Inositol (40:1). Requested Day 3 LH/FSH panel and pelvic ultrasound.",
            "status": "COMPLETED"
        }
        notes_res = await client.post(f"/api/v1/appointments/{appt_id}/clinical-notes", json=notes_payload)
        assert notes_res.status_code == 200
        updated_appt = notes_res.json()
        assert updated_appt["status"] == "COMPLETED"
        assert "Myo-inositol" in updated_appt["doctor_notes"]
