from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from app.schemas.assessment import AssessmentPredictionResponse, ExtractedSymptom


class ChatMessage(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(description="User prompt or symptom description")
    history: Optional[List[ChatMessage]] = Field(default_factory=list)


class ChatResponse(BaseModel):
    reply: str
    prediction: Optional[AssessmentPredictionResponse] = None
    detected_symptoms: Optional[List[ExtractedSymptom]] = None
    confidence_score: Optional[float] = None
    risk_percentage: Optional[float] = None
    risk_category: Optional[str] = None
    is_prediction_triggered: bool = False
