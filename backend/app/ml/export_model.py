"""
Model Exporter for AAVYA PCOS Risk Prediction
Extracts, trains, and serializes the exact model from datasets/dataset_1+2+3/logistic_regression/main.py
"""

import os
import json
import joblib
import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score, average_precision_score
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
CSV_PATH = BASE_DIR / "datasets" / "dataset_1+2+3" / "logistic_regression" / "dataset_1+2+3(final).csv"
OUTPUT_DIR = Path(__file__).resolve().parent / "models"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

MODEL_BUNDLE_PATH = OUTPUT_DIR / "pcos_model_bundle.joblib"
SCHEMA_PATH = OUTPUT_DIR / "feature_schema.json"

def export_trained_model():
    print(f"Loading dataset from: {CSV_PATH}")
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at {CSV_PATH}")

    dataframe = pd.read_csv(CSV_PATH)

    binary_mappings = {
        "cycle_regularity": {"Regular": 0, "Irregular": 1},
        "yoga_practiced": {"Yes": 0, "No": 1},
        "family_history_pcos": {"Yes": 0, "No": 1},
        "family_history_infertility": {"Yes": 0, "No": 1},
        "family_history_endometriosis": {"Yes": 0, "No": 1},
        "family_history_early_menopause": {"Yes": 0, "No": 1},
        "mother_pcos": {"Yes": 0, "No": 1},
        "sister_pcos": {"Yes": 0, "No": 1},
        "maternal_grandmother_pcos": {"Yes": 0, "No": 1},
        "paternal_grandmother_pcos": {"Yes": 0, "No": 1},
        "mother_metabolic_syndrome_idf_flag": {"Yes": 0, "No": 1},
        "mother_metabolic_syndrome_atp3_flag": {"Yes": 0, "No": 1},
        "mother_irregular_cycles_flag": {"Yes": 0, "No": 1},
        "mother_ovarian_morphology_pcos_flag": {"Yes": 0, "No": 1},
        "mother_hirsutism_gt9_flag": {"Yes": 0, "No": 1},
        "mother_alopecia_flag": {"Yes": 0, "No": 1},
        "mother_moderate_acne_flag": {"Yes": 0, "No": 1},
        "mother_severe_acne_flag": {"Yes": 0, "No": 1},
        "father_metabolic_syndrome_idf_flag": {"Yes": 0, "No": 1},
        "father_metabolic_syndrome_atp3_flag": {"Yes": 0, "No": 1},
        "sister_metabolic_syndrome_idf_flag": {"Yes": 0, "No": 1},
        "sister_metabolic_syndrome_atp3_flag": {"Yes": 0, "No": 1},
        "sister_irregular_cycles_flag": {"Yes": 0, "No": 1},
        "sister_ovarian_morphology_pcos_flag": {"Yes": 0, "No": 1},
        "sister_hirsutism_gt9_flag": {"Yes": 0, "No": 1},
        "sister_alopecia_flag": {"Yes": 0, "No": 1},
        "sister_moderate_acne_flag": {"Yes": 0, "No": 1},
        "sister_severe_acne_flag": {"Yes": 0, "No": 1},
        "brother_metabolic_syndrome_idf_flag": {"Yes": 0, "No": 1},
        "maternal_pcos_history": {"Yes": 0, "No": 1},
        "paternal_pcos_history": {"Yes": 0, "No": 1},
        "first_degree_metabolic_history": {"Yes": 0, "No": 1},
        "brother_metabolic_syndrome_atp3_flag": {"Yes": 0, "No": 1},
    }

    for col, mapping in binary_mappings.items():
        if col in dataframe.columns:
            dataframe[col] = dataframe[col].map(mapping)

    drop_columns = [
        "weight_kg", "height_cm", "patient_file_no", "blood_group_code", "pulse_bpm",
        "fast_food_flag_imputed", "resp_rate", "pregnancy_flag", "beta_hcg_1", "fsh_lh_ratio",
        "hip_in", "waist_in", "whr", "diets_tried", "vitamin_d3", "bp_systolic", "bp_diastolic",
        "beta_hcg_2", "beta_hcg_2_imputed", "amh_imputed", "marriage_duration_years_imputed",
        "cycle_regularity_imputed", "rotterdam_phenotype", "exercise_forms_helpful",
        "tcm_systems_tried", "ayurveda_first_visit_timing", "ayurveda_use_duration",
        "ayurveda_decision_influence", "ayurveda_choice_reasons", "ayurveda_treatment_forms",
        "ayurveda_adverse_reaction", "yoga_nonuse_reasons", "yoga_future_interest",
        "yoga_duration", "yoga_reasons", "yoga_style", "yoga_elements",
        "family_history_source_detail", "family_history_known_flag",
        "family_member_count_reported", "family_history_t2d", "family_history_thyroid",
        "family_history_hypertension", "family_history_cardiovascular_disease", "mother_t2d",
        "mother_thyroid_disorder", "mother_hypertension", "mother_cardiovascular_disease",
        "mother_obesity", "father_t2d", "father_thyroid_disorder", "father_hypertension",
        "father_cardiovascular_disease", "father_obesity", "sister_t2d", "sister_thyroid_disorder",
        "brother_t2d", "brother_hypertension", "brother_cardiovascular_disease", "brother_obesity",
        "maternal_grandmother_t2d", "maternal_grandmother_thyroid", "paternal_grandmother_t2d",
        "paternal_grandmother_thyroid", "maternal_grandfather_t2d", "maternal_grandfather_hypertension",
        "maternal_grandfather_cardiovascular_disease", "paternal_grandfather_t2d",
        "paternal_grandfather_hypertension", "paternal_grandfather_cardiovascular_disease",
        "mother_waist_circumference_cm", "mother_hip_circumference_cm", "mother_whr",
        "mother_height_cm", "mother_weight_kg", "mother_sbp_mmhg", "mother_dbp_mmhg",
        "mother_raynaud_index", "mother_obesity_flag", "mother_t2d_diagnosis_flag",
        "mother_ifg_flag", "mother_igt_flag", "mother_elevated_fasting_insulin_flag",
        "mother_ir_by_homa_flag", "mother_acanthosis_nigricans_flag", "mother_lh_fsh_ratio",
        "mother_elevated_testosterone_flag", "mother_elevated_lh_fsh_flag",
        "father_waist_circumference_cm", "father_hip_circumference_cm", "father_whr",
        "father_height_cm", "father_weight_kg", "father_sbp_mmhg", "father_dbp_mmhg",
        "father_bg_fasting", "father_fasting_insulin", "father_quicki", "father_belfiore_index",
        "father_raynaud_index", "father_tsh", "father_t4", "father_obesity_flag",
        "father_t2d_diagnosis_flag", "father_ifg_flag", "father_igt_flag",
        "father_elevated_fasting_insulin_flag", "father_ir_by_homa_flag",
        "father_acanthosis_nigricans_flag", "father_premature_balding_flag",
        "sister_waist_circumference_cm", "sister_hip_circumference_cm", "sister_whr",
        "sister_height_cm", "sister_weight_kg", "sister_sbp_mmhg", "sister_dbp_mmhg",
        "sister_bg_fasting", "sister_raynaud_index", "sister_obesity_flag",
        "sister_t2d_diagnosis_flag", "sister_ifg_flag", "sister_igt_flag",
        "sister_elevated_fasting_insulin_flag", "sister_ir_by_homa_flag",
        "sister_lh_fsh_ratio", "sister_elevated_testosterone_flag", "sister_elevated_lh_fsh_flag",
        "brother_bmi", "brother_waist_circumference_cm", "brother_hip_circumference_cm",
        "brother_whr", "brother_height_cm", "brother_weight_kg", "brother_sbp_mmhg",
        "brother_dbp_mmhg", "brother_bg_fasting", "brother_fasting_insulin", "brother_quicki",
        "brother_belfiore_index", "brother_raynaud_index", "brother_tsh", "brother_t4",
        "brother_obesity_flag", "brother_t2d_diagnosis_flag", "brother_ifg_flag",
        "brother_igt_flag", "brother_elevated_fasting_insulin_flag", "brother_ir_by_homa_flag",
        "brother_acanthosis_nigricans_flag", "brother_premature_balding_flag",
        "family_t2d_count", "family_thyroid_count", "first_degree_pcos_history",
        "second_degree_pcos_history", "first_degree_t2d_history"
    ]

    dataframe = dataframe.drop(columns=[col for col in drop_columns if col in dataframe.columns])

    target_column = "pcos_label"
    X = dataframe.drop(columns=[target_column])
    y = dataframe[target_column]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, stratify=y, random_state=2
    )

    numeric_columns = X_train.select_dtypes(include=["number"]).columns.tolist()
    binary_columns = [
        col for col in numeric_columns
        if X_train[col].notna().any() and set(X_train[col].dropna().unique()).issubset({0, 1})
    ]
    continuous_columns = [col for col in numeric_columns if col not in binary_columns]
    categorical_columns = X_train.select_dtypes(include=["object", "category", "bool"]).columns.tolist()

    continuous_imputer = SimpleImputer(strategy="median")
    binary_imputer = SimpleImputer(strategy="most_frequent")
    categorical_imputer = SimpleImputer(strategy="most_frequent")

    if continuous_columns:
        X_train.loc[:, continuous_columns] = continuous_imputer.fit_transform(X_train[continuous_columns])
        X_test.loc[:, continuous_columns] = continuous_imputer.transform(X_test[continuous_columns])
    if binary_columns:
        X_train.loc[:, binary_columns] = binary_imputer.fit_transform(X_train[binary_columns])
        X_test.loc[:, binary_columns] = binary_imputer.transform(X_test[binary_columns])
    if categorical_columns:
        X_train.loc[:, categorical_columns] = categorical_imputer.fit_transform(X_train[categorical_columns])
        X_test.loc[:, categorical_columns] = categorical_imputer.transform(X_test[categorical_columns])

    numerical_features = [
        "age_years", "bmi", "amh", "lh", "fsh", "hemoglobin", "cycle_length_days",
        "marriage_duration_years", "abortion_count", "tsh", "prolactin", "progesterone",
        "random_blood_sugar", "weight_gain_flag", "hirsutism_flag", "skin_darkening_flag",
        "hair_loss_flag", "acne_flag", "follicle_count_left", "follicle_count_right",
        "avg_follicle_size_left_mm", "avg_follicle_size_right_mm", "endometrium_mm",
        "fasting_insulin_uiu_ml", "insulin_ogtt_1hr_uiu_ml", "insulin_ogtt_2hr_uiu_ml",
        "fasting_glucose_mg_dl", "homa_ir", "quicki", "belfiore_index", "raynaud_index",
        "serum_testosterone_ng_ml", "serum_t4_ug_dl", "fg_score_numeric", "fast_food_flag",
        "regular_exercise_flag", "sitting_time_per_day", "walking_days_per_week",
        "walking_duration_per_day", "moderate_activity_days", "moderate_activity_duration",
        "vigorous_activity_days", "vigorous_activity_duration", "strength_exercise_days",
        "strength_exercise_duration", "mother_infertility", "mother_endometriosis",
        "mother_early_menopause", "mother_metabolic_syndrome", "father_metabolic_syndrome",
        "sister_infertility", "sister_endometriosis", "sister_early_menopause",
        "brother_metabolic_syndrome", "maternal_grandmother_infertility",
        "paternal_grandmother_infertility", "mother_bmi", "mother_bg_fasting",
        "mother_fasting_insulin", "mother_homa_ir", "mother_quicki", "mother_belfiore_index",
        "mother_tsh", "mother_t4", "mother_cycles_per_year", "mother_hirsutism_duration_years",
        "mother_fg_score", "mother_lh", "mother_fsh", "mother_testosterone", "mother_prolactin",
        "father_bmi", "father_homa_ir", "sister_bmi", "sister_fasting_insulin", "sister_homa_ir",
        "sister_quicki", "sister_belfiore_index", "sister_tsh", "sister_t4",
        "sister_cycles_per_year", "sister_hirsutism_duration_years", "sister_fg_score",
        "sister_lh", "sister_fsh", "sister_testosterone", "sister_prolactin",
        "family_pcos_count", "family_infertility_count"
    ]

    scaler = StandardScaler()
    X_train_scaled = X_train.copy()
    X_test_scaled = X_test.copy()

    valid_numerical_features = [f for f in numerical_features if f in X_train.columns]
    X_train_scaled[valid_numerical_features] = scaler.fit_transform(X_train[valid_numerical_features])
    X_test_scaled[valid_numerical_features] = scaler.transform(X_test[valid_numerical_features])

    model = LogisticRegression(max_iter=100, random_state=2)
    model.fit(X_train_scaled, y_train)

    y_pred = model.predict(X_test_scaled)
    y_prob = model.predict_proba(X_test_scaled)[:, 1]

    metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, y_prob)),
        "pr_auc": float(average_precision_score(y_test, y_prob)),
    }

    print("Model Export Metrics:", metrics)

    # Save Bundle
    bundle = {
        "model": model,
        "scaler": scaler,
        "continuous_imputer": continuous_imputer,
        "binary_imputer": binary_imputer,
        "categorical_imputer": categorical_imputer,
        "feature_names": X.columns.tolist(),
        "binary_columns": binary_columns,
        "continuous_columns": continuous_columns,
        "categorical_columns": categorical_columns,
        "numerical_features": valid_numerical_features,
        "binary_mappings": binary_mappings,
        "drop_columns": drop_columns,
        "metrics": metrics,
        "version": "1.0.0"
    }

    joblib.dump(bundle, MODEL_BUNDLE_PATH)
    print(f"Serialized model bundle saved to: {MODEL_BUNDLE_PATH}")

    # Generate Feature Schema JSON for API and Frontend validation
    feature_schema = {
        "version": "1.0.0",
        "total_features": len(X.columns),
        "target": "pcos_label",
        "features": []
    }

    for col in X.columns:
        col_type = "binary" if col in binary_columns else ("continuous" if col in continuous_columns else "categorical")
        feature_schema["features"].append({
            "name": col,
            "type": col_type,
            "is_scaled": col in valid_numerical_features,
            "mapped_values": binary_mappings.get(col, None)
        })

    with open(SCHEMA_PATH, "w") as f:
        json.dump(feature_schema, f, indent=2)
    print(f"Feature schema contract saved to: {SCHEMA_PATH}")

    return bundle

if __name__ == "__main__":
    export_trained_model()
