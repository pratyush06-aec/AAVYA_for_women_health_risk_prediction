from fastapi import APIRouter
from app.api.v1.endpoints import health, assessment, auth, users, appointments, chat

api_router = APIRouter()

api_router.include_router(health.router, prefix="/health", tags=["Health & Readiness"])
api_router.include_router(assessment.router, prefix="/assessment", tags=["PCOS Assessment & Risk Estimation"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & User Sync"])
api_router.include_router(users.router, prefix="/users", tags=["Users & Doctors"])
api_router.add_api_route("/doctors", users.list_verified_doctors, methods=["GET"], tags=["Doctor Directory"], response_model=users.List[dict])
api_router.include_router(appointments.router, prefix="/appointments", tags=["Doctor Consultations & Appointments"])
api_router.include_router(chat.router, prefix="/chat", tags=["Conversational AI Chatbot & Symptom Intelligence"])


