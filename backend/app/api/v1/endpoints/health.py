from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.core.config import settings
from app.ml.inference import inference_engine
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check(db: AsyncSession = Depends(get_db)):
    """
    System health and readiness probe:
    - Verifies database connectivity (NeonDB or local SQLite fallback)
    - Verifies ML inference engine readiness and model artifact loading
    """
    db_status = "connected"
    try:
        result = await db.execute(text("SELECT 1"))
        _ = result.scalar()
    except Exception as exc:
        db_status = f"unreachable: {str(exc)}"

    model_loaded = (inference_engine is not None and hasattr(inference_engine, "model"))
    model_version = inference_engine.version if model_loaded else "unknown"

    return HealthResponse(
        status="healthy" if db_status == "connected" and model_loaded else "degraded",
        database=db_status,
        model_loaded=model_loaded,
        model_version=model_version,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc)
    )
