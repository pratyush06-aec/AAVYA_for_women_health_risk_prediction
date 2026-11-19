from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class FeatureImpact(BaseModel):
    feature: str
    impact: float
    direction: str = Field(description="'increases_risk' or 'reduces_risk'")


class AssessmentPredictionRequest(BaseModel):
    """
    Accepts clinical, lifestyle, and hereditary parameters.
    Can be partial (the model's trained imputers handle missing features)
    or complete.
    """
    features: Dict[str, Any] = Field(
        default_factory=dict,
        description="Dictionary mapping feature names to their observed values"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "features": {
                    "Age (yrs)": 24,
                    "Weight (Kg)": 68.5,
                    "Height(Cm) ": 160,
                    "BMI": 26.75,
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
        }
    )


class AssessmentPredictionResponse(BaseModel):
    prediction: int = Field(description="Binary threshold flag (0: lower risk, 1: elevated risk)")
    prediction_label: Optional[str] = Field(default="Indicative Assessment", description="Clinical label")
    confidence_score: Optional[float] = Field(default=None, description="Statistical classifier confidence percentage (0-100%)")
    confidence_percentage: Optional[float] = Field(default=None, description="Same as confidence_score")
    confidence_statement: Optional[str] = Field(default=None, description="Explanatory text detailing model certainty and basis")
    risk_probability: float = Field(description="Calibrated probability score between 0.0 and 1.0")
    risk_percentage: float = Field(description="Calibrated risk percentage between 0% and 100%")
    risk_category: str = Field(description="'Low Risk', 'Moderate Risk', or 'Elevated Risk'")
    risk_description: str = Field(description="Clinical contextual summary of the risk score")
    top_contributing_factors: List[FeatureImpact] = Field(
        default_factory=list,
        description="Top features impacting this specific prediction and their directional effect"
    )
    model_version: str
    model_architecture: Optional[str] = Field(default="Logistic Regression", description="Underlying model architecture")
    disclaimer: str = Field(
        default="This result is an algorithmic statistical risk estimate for educational and preliminary screening purposes. It is NOT a clinical diagnosis. Consult a qualified gynecologist or endocrinologist."
    )
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class FeatureSchemaResponse(BaseModel):
    total_features: int
    binary_columns: List[str]
    continuous_columns: List[str]
    categorical_columns: List[str]
    numerical_features: List[str]
    binary_mappings: Dict[str, Dict[str, int]]
    top_coefficients: List[Dict[str, Any]]


class SymptomParseRequest(BaseModel):
    text: str = Field(description="Free-form natural language description of symptoms")


class ExtractedSymptom(BaseModel):
    name: str
    feature_mapped: str
    value_inferred: Any
    confidence: float
    snippet: str


class SymptomParseResponse(BaseModel):
    original_text: str
    extracted_features: Dict[str, Any]
    detected_symptoms: List[ExtractedSymptom]
    summary_insight: str


class SaveAssessmentRequest(BaseModel):
    user_email: str
    risk_probability: float
    risk_percentage: float
    risk_category: str
    risk_description: str
    input_features: Dict[str, Any]
    top_contributing_factors: List[Dict[str, Any]]


class AssessmentRecordResponse(BaseModel):
    id: int
    user_id: int
    risk_probability: float
    risk_percentage: float
    risk_category: str
    risk_description: str
    input_features: Dict[str, Any]
    top_contributing_factors: List[Dict[str, Any]]
    created_at: datetime

