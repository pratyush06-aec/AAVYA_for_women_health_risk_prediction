import json
from typing import Any, Dict, List
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.ml.inference import inference_engine
from app.services.symptom_parser import symptom_parser
from app.database.session import get_db
from app.database.models import User, AssessmentRecord
from app.schemas.assessment import (
    AssessmentPredictionRequest,
    AssessmentPredictionResponse,
    FeatureSchemaResponse,
    SymptomParseRequest,
    SymptomParseResponse,
    SaveAssessmentRequest,
    AssessmentRecordResponse,
)

router = APIRouter()


@router.post("/predict", response_model=AssessmentPredictionResponse)
def predict_pcos_risk(payload: AssessmentPredictionRequest) -> Any:
    """
    Direct ML inference endpoint for PCOS risk estimation.
    Accepts clinical, lifestyle, and hereditary features (supports partial feature sets).
    Returns calibrated statistical risk probability, risk stratification tier,
    top contributing features, and mandatory non-diagnostic clinical disclaimer.
    """
    try:
        result = inference_engine.predict(payload.features)
        return result
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline execution error: {str(exc)}"
        )


@router.post("/parse-symptoms", response_model=SymptomParseResponse)
@router.post("/extract-symptoms", response_model=SymptomParseResponse)
def parse_free_text_symptoms(payload: SymptomParseRequest) -> Any:
    """
    Clinical NLP endpoint that analyzes free-form natural language symptom descriptions,
    detects phenotypic & gynecological PCOS indicators with negation handling,
    and returns mapped features ready for model inference.
    """
    try:
        return symptom_parser.parse(payload.text)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Symptom parsing error: {str(exc)}"
        )


@router.post("/save", response_model=AssessmentRecordResponse)
async def save_assessment_record(
    payload: SaveAssessmentRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Persists an assessment result into NeonDB / SQLite for longitudinal tracking,
    dashboard display, and doctor review.
    """
    try:
        # Find user by email
        stmt = select(User).where(User.email == payload.user_email)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()

        if not user:
            # Auto-create baseline patient user record if not yet synced
            user = User(
                email=payload.user_email,
                full_name=payload.user_email.split("@")[0].capitalize(),
                role="PATIENT",
                is_verified=False
            )
            db.add(user)
            await db.flush()

        record = AssessmentRecord(
            user_id=user.id,
            risk_probability=payload.risk_probability,
            risk_percentage=payload.risk_percentage,
            risk_category=payload.risk_category,
            risk_description=payload.risk_description,
            input_features_json=json.dumps(payload.input_features),
            contributing_factors_json=json.dumps(payload.top_contributing_factors)
        )
        db.add(record)
        await db.commit()
        await db.refresh(record)

        return AssessmentRecordResponse(
            id=record.id,
            user_id=record.user_id,
            risk_probability=record.risk_probability,
            risk_percentage=record.risk_percentage,
            risk_category=record.risk_category,
            risk_description=record.risk_description,
            input_features=json.loads(record.input_features_json),
            top_contributing_factors=json.loads(record.contributing_factors_json),
            created_at=record.created_at
        )
    except Exception as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save assessment record: {str(exc)}"
        )


@router.get("/history", response_model=List[AssessmentRecordResponse])
async def get_assessment_history(
    email: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Retrieves longitudinal assessment records for a specific patient.
    """
    try:
        stmt = select(User).where(User.email == email)
        res = await db.execute(stmt)
        user = res.scalar_one_or_none()
        if not user:
            return []

        rec_stmt = (
            select(AssessmentRecord)
            .where(AssessmentRecord.user_id == user.id)
            .order_by(desc(AssessmentRecord.created_at))
        )
        records_res = await db.execute(rec_stmt)
        records = records_res.scalars().all()

        return [
            AssessmentRecordResponse(
                id=r.id,
                user_id=r.user_id,
                risk_probability=r.risk_probability,
                risk_percentage=r.risk_percentage,
                risk_category=r.risk_category,
                risk_description=r.risk_description,
                input_features=json.loads(r.input_features_json),
                top_contributing_factors=json.loads(r.contributing_factors_json),
                created_at=r.created_at
            )
            for r in records
        ]
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch assessment history: {str(exc)}"
        )



@router.get("/schema", response_model=FeatureSchemaResponse)
def get_feature_schema() -> Any:
    """
    Returns feature schema metadata:
    - Expected input features
    - Continuous, binary, and categorical classifications
    - Canonical binary mappings (e.g., 'Yes'/'No' -> 1/0)
    - Top coefficients from the trained logistic regression model
    """
    try:
        schema = inference_engine.schema
        coefs = []
        if hasattr(inference_engine.model, "coef_"):
            raw_coefs = inference_engine.model.coef_[0]
            for feat, coef in zip(inference_engine.feature_names, raw_coefs):
                coefs.append({
                    "feature": feat,
                    "coefficient": round(float(coef), 4),
                    "impact_direction": "increases_risk" if coef > 0 else "reduces_risk"
                })
            coefs.sort(key=lambda x: abs(x["coefficient"]), reverse=True)

        return {
            "total_features": len(inference_engine.feature_names),
            "binary_columns": inference_engine.binary_columns,
            "continuous_columns": inference_engine.continuous_columns,
            "categorical_columns": inference_engine.categorical_columns,
            "numerical_features": inference_engine.numerical_features,
            "binary_mappings": inference_engine.binary_mappings,
            "top_coefficients": coefs[:20],
        }
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load feature schema: {str(exc)}"
        )
