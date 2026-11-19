"""
Inference Service for AAVYA PCOS Risk Prediction
Loads serialized model bundle and executes calibrated inference.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
import joblib
import pandas as pd
import numpy as np

BUNDLE_PATH = Path(__file__).resolve().parent / "models" / "pcos_model_bundle.joblib"
SCHEMA_PATH = Path(__file__).resolve().parent / "models" / "feature_schema.json"

# Common feature aliases mapping patient/questionnaire keys to model feature names
FEATURE_ALIASES: Dict[str, str] = {
    "Age (yrs)": "age",
    "Age": "age",
    "Weight (Kg)": "weight_kg",
    "Weight": "weight_kg",
    "Height(Cm) ": "height_cm",
    "Height(Cm)": "height_cm",
    "Height": "height_cm",
    "BMI": "bmi",
    "Cycle(R/I)": "cycle_regularity",
    "Cycle regularity": "cycle_regularity",
    "Cycle length(days)": "cycle_length_days",
    "Cycle length": "cycle_length_days",
    "Marriage Status (Yrs)": "marriage_status_yrs",
    "Pregnant(Y/N)": "pregnant_flag",
    "No. of aborptions": "abortions_count",
    "Weight gain(Y/N)": "weight_gain_flag",
    "hair growth(Y/N)": "hirsutism_flag",
    "Skin darkening (Y/N)": "skin_darkening_flag",
    "Hair loss(Y/N)": "hair_loss_flag",
    "Pimples(Y/N)": "acne_flag",
    "Fast food (Y/N)": "fast_food_flag",
    "Reg.Exercise(Y/N)": "regular_exercise_flag",
    "Yoga": "yoga_practiced",
    "Family history of PCOS": "family_history_pcos",
    "Family history of Infertility": "family_history_infertility",
    "Family history of Endometriosis": "family_history_endometriosis",
    "Family history of Early Menopause": "family_history_early_menopause",
}

class PCOSInferenceEngine:
    _instance = None

    def __init__(self):
        if not BUNDLE_PATH.exists():
            raise FileNotFoundError(f"Model bundle not found at {BUNDLE_PATH}. Run export_model.py first.")
        
        self.bundle = joblib.load(BUNDLE_PATH)
        self.model = self.bundle["model"]
        self.scaler = self.bundle["scaler"]
        self.continuous_imputer = self.bundle["continuous_imputer"]
        self.binary_imputer = self.bundle["binary_imputer"]
        self.categorical_imputer = self.bundle["categorical_imputer"]
        self.feature_names = self.bundle["feature_names"]
        self.binary_columns = self.bundle["binary_columns"]
        self.continuous_columns = self.bundle["continuous_columns"]
        self.categorical_columns = self.bundle["categorical_columns"]
        self.numerical_features = self.bundle["numerical_features"]
        self.binary_mappings = self.bundle["binary_mappings"]
        self.metrics = self.bundle["metrics"]
        self.version = self.bundle.get("version", "1.0.0")

        with open(SCHEMA_PATH, "r") as f:
            self.schema = json.load(f)

    @classmethod
    def get_instance(cls) -> "PCOSInferenceEngine":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def predict(self, raw_input: Dict[str, Any]) -> Dict[str, Any]:
        """
        Accepts raw feature dictionary (from questionnaire or free-text extraction),
        applies exact training transformations, and returns risk probability + stratification.
        """
        # Normalize input keys using aliases
        normalized_input = {}
        for k, v in raw_input.items():
            canonical_key = FEATURE_ALIASES.get(k, k)
            normalized_input[canonical_key] = v

        processed_input = {}
        for col in self.feature_names:
            val = normalized_input.get(col, None)

            # Apply specific binary mappings if present
            if col in self.binary_mappings and isinstance(val, str):
                val = self.binary_mappings[col].get(val, val)

            # Universal Yes/No and Regular/Irregular translation
            if isinstance(val, str):
                v_lower = val.strip().lower()
                if v_lower in ("yes", "y", "irregular"):
                    val = 1
                elif v_lower in ("no", "n", "regular"):
                    val = 0
                else:
                    try:
                        val = float(val)
                    except ValueError:
                        val = None

            # Convert boolean to 0/1
            if isinstance(val, bool):
                val = 1 if val else 0

            processed_input[col] = [val]

        df = pd.DataFrame(processed_input, columns=self.feature_names)
        # Ensure float dtype so None becomes np.nan for sklearn imputers
        df = df.apply(pd.to_numeric, errors="coerce")

        # Apply imputers
        if self.continuous_columns:
            df.loc[:, self.continuous_columns] = self.continuous_imputer.transform(df[self.continuous_columns])
        if self.binary_columns:
            df.loc[:, self.binary_columns] = self.binary_imputer.transform(df[self.binary_columns])
        if self.categorical_columns:
            df.loc[:, self.categorical_columns] = self.categorical_imputer.transform(df[self.categorical_columns])

        # Failsafe for any stray NaN
        if df.isna().any().any():
            df = df.fillna(0.0)

        # Apply scaling
        df_scaled = df.copy()
        df_scaled[self.numerical_features] = self.scaler.transform(df[self.numerical_features])

        # Inference
        probability = float(self.model.predict_proba(df_scaled)[0, 1])
        prediction = int(probability >= 0.5)
        # Model classification confidence is the probability of the chosen class
        confidence = float(max(probability, 1.0 - probability))
        confidence_percentage = round(confidence * 100, 1)

        # Risk Stratification
        if probability < 0.35:
            risk_category = "Low Risk"
            risk_description = "Statistical risk indicators are low based on reported factors."
        elif probability < 0.65:
            risk_category = "Moderate Risk"
            risk_description = "Moderate likelihood of PCOS-related risk patterns; clinical consultation is suggested."
        else:
            risk_category = "Elevated Risk"
            risk_description = "Significant PCOS-associated biomarkers or symptoms reported. Specialist review strongly recommended."

        # Top feature attributions (coefficients * normalized value)
        coefficients = self.model.coef_[0]
        feature_impacts = []
        for feat, coef, val in zip(self.feature_names, coefficients, df_scaled.iloc[0]):
            impact = coef * val
            if abs(impact) > 0.05:
                feature_impacts.append({
                    "feature": feat,
                    "impact": round(float(impact), 4),
                    "direction": "increases_risk" if impact > 0 else "reduces_risk"
                })

        feature_impacts.sort(key=lambda x: abs(x["impact"]), reverse=True)

        confidence_statement = (
            f"The trained Logistic Regression model evaluated your phenotypic, cycle, and metabolic parameters "
            f"and predicts '{risk_category}' with {confidence_percentage}% classification confidence "
            f"({round(probability * 100, 1)}% calibrated PCOS risk probability)."
        )

        return {
            "prediction": prediction,
            "prediction_label": "Elevated Risk / Indicative of PCOS" if prediction == 1 else "Low Risk / Non-Indicative",
            "confidence_score": confidence_percentage,
            "confidence_percentage": confidence_percentage,
            "risk_probability": round(probability, 4),
            "risk_percentage": round(probability * 100, 1),
            "risk_category": risk_category,
            "risk_description": risk_description,
            "confidence_statement": confidence_statement,
            "top_contributing_factors": feature_impacts[:6],
            "model_version": self.version,
            "model_architecture": "Logistic Regression (L2 Regularized with Median/Mode Imputation & Robust Scaling)",
            "disclaimer": "This result is an algorithmic statistical risk estimate for educational and preliminary screening purposes. It is NOT a clinical diagnosis. Consult a qualified gynecologist or endocrinologist."
        }

inference_engine = PCOSInferenceEngine.get_instance()
