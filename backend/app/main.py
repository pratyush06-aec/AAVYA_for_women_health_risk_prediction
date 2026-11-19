"""
AAVYA – HeredityAI Main Application Entrypoint
FastAPI Backend for PCOS Risk Estimation, Clinical Support, and Doctor-Patient Connectivity.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.ml.inference import inference_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application startup and shutdown lifecycle management:
    - Pre-warms and verifies PCOS ML inference engine
    - Ensures database schemas and tables are initialized
    """
    # Startup: Verify inference engine
    assert inference_engine is not None
    assert inference_engine.model is not None
    print(f"[{settings.PROJECT_NAME}] ML Model loaded successfully (version {inference_engine.version}).")
    
    # Ensure database tables exist
    from app.database.base import Base
    from app.database.session import engine
    from app.database.init_db import init_and_seed_db
    try:
        await init_and_seed_db()
        print(f"[{settings.PROJECT_NAME}] Database schemas and seeds verified.")
    except Exception as e:
        print(f"[{settings.PROJECT_NAME}] Database initialization notice: {e}")

    yield
    # Shutdown logic (if any)
    print(f"[{settings.PROJECT_NAME}] Shutting down cleanly.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "AAVYA – HeredityAI API: Clinical & Lifestyle PCOS Risk Estimation, "
        "Symptom Intelligence, and Doctor Connectivity Platform."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "operational",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR,
        "medical_disclaimer": (
            "AAVYA is an AI-assisted health risk estimation platform, NOT a diagnostic medical device. "
            "Algorithmic scores are statistical assessments intended to guide proactive clinical consultation."
        )
    }
