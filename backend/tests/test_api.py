"""
API Integration & Unit Tests for AAVYA Backend
Tests public seams: /api/v1/health, /api/v1/assessment/schema, and /api/v1/assessment/predict
"""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_root_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "operational"
    assert "medical_disclaimer" in data
    assert "NOT a diagnostic medical device" in data["medical_disclaimer"]


@pytest.mark.asyncio
async def test_health_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["database"] == "connected"


@pytest.mark.asyncio
async def test_feature_schema_endpoint():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/api/v1/assessment/schema")
    assert response.status_code == 200
    data = response.json()
    assert data["total_features"] > 0
    assert len(data["top_coefficients"]) > 0
    assert "cycle_regularity" in data["binary_mappings"]


@pytest.mark.asyncio
async def test_assessment_prediction_with_symptoms():
    payload = {
        "features": {
            "Age (yrs)": 24,
            "Weight (Kg)": 72.0,
            "Height(Cm) ": 160.0,
            "BMI": 28.1,
            "Cycle(R/I)": "Irregular",
            "Cycle length(days)": 45,
            "Weight gain(Y/N)": "Yes",
            "hair growth(Y/N)": "Yes",
            "Skin darkening (Y/N)": "Yes",
            "Hair loss(Y/N)": "Yes",
            "Pimples(Y/N)": "Yes",
            "Fast food (Y/N)": "Yes",
            "Reg.Exercise(Y/N)": "No"
        }
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/assessment/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert 0.0 <= data["risk_probability"] <= 1.0
    assert 0.0 <= data["risk_percentage"] <= 100.0
    assert data["risk_category"] in ["Low Risk", "Moderate Risk", "Elevated Risk"]
    assert len(data["top_contributing_factors"]) > 0
    assert "disclaimer" in data
    assert "NOT a clinical diagnosis" in data["disclaimer"]


@pytest.mark.asyncio
async def test_assessment_prediction_empty_payload():
    """Imputation test: verifies engine handles sparse/empty input without throwing exceptions"""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/v1/assessment/predict", json={"features": {}})
    assert response.status_code == 200
    data = response.json()
    assert "risk_probability" in data
    assert "risk_category" in data
