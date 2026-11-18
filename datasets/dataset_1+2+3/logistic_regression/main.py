import pandas as pd
import matplotlib.pyplot as plt
# import numpy as np
from sklearn.model_selection import train_test_split 
# from sklern.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import classification_report, f1_score, confusion_matrix, accuracy_score, precision_score, recall_score, roc_auc_score, average_precision_score
# from sklearn.metrics import precision_recall_curve, roc_curve, auc
from sklearn.linear_model import LogisticRegression
import seaborn as sns
# from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.preprocessing import StandardScaler
# from sklearn.preprocessing import OrdinalEncoder
from imblearn.over_sampling import SMOTENC
from sklearn.impute import SimpleImputer


dataframe= pd.read_csv("D:\AAVYA-HeredityAI-for_women_health_risk_prediction\datasets\dataset_1+2+3\logistic_regression\dataset_1+2+3(final).csv")
# print(dataframe.head())
# print(dataframe.shape)
# print(dataframe.describe())
# print(dataframe.info())
# print(dataframe.isnull().sum())
# print(dataframe.dtypes)
# print(dataframe.duplicated().sum())
# print(dataframe.select_dtypes(include=["str", "category"]).columns.tolist())

dataframe["cycle_regularity"] = (dataframe["cycle_regularity"].map({"Regular": 0, "Irregular": 1}))
print(dataframe["cycle_regularity"].value_counts(dropna=False))
dataframe["yoga_practiced"] = (dataframe["yoga_practiced"].map({"Yes": 0, "No": 1}))
print(dataframe["yoga_practiced"].value_counts(dropna=False))
dataframe["family_history_pcos"] = (dataframe["family_history_pcos"].map({"Yes": 0, "No": 1}))
print(dataframe["family_history_pcos"].value_counts(dropna=False))
dataframe["family_history_infertility"] = (dataframe["family_history_infertility"].map({"Yes": 0, "No": 1}))
print(dataframe["family_history_infertility"].value_counts(dropna=False))
dataframe["family_history_endometriosis"] = (dataframe["family_history_endometriosis"].map({"Yes": 0, "No": 1}))
print(dataframe["family_history_endometriosis"].value_counts(dropna=False))
dataframe["family_history_early_menopause"] = (dataframe["family_history_early_menopause"].map({"Yes": 0, "No": 1}))
print(dataframe["family_history_early_menopause"].value_counts(dropna=False))
dataframe["mother_pcos"] = (dataframe["mother_pcos"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_pcos"].value_counts(dropna=False))
dataframe["sister_pcos"] = (dataframe["sister_pcos"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_pcos"].value_counts(dropna=False))
dataframe["maternal_grandmother_pcos"] = (dataframe["maternal_grandmother_pcos"].map({"Yes": 0, "No": 1}))
print(dataframe["maternal_grandmother_pcos"].value_counts(dropna=False))
dataframe["paternal_grandmother_pcos"] = (dataframe["paternal_grandmother_pcos"].map({"Yes": 0, "No": 1}))
print(dataframe["paternal_grandmother_pcos"].value_counts(dropna=False))
dataframe["mother_metabolic_syndrome_idf_flag"] = (dataframe["mother_metabolic_syndrome_idf_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_metabolic_syndrome_idf_flag"].value_counts(dropna=False))
dataframe["mother_metabolic_syndrome_atp3_flag"] = (dataframe["mother_metabolic_syndrome_atp3_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_metabolic_syndrome_atp3_flag"].value_counts(dropna=False))
dataframe["mother_irregular_cycles_flag"] = (dataframe["mother_irregular_cycles_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_irregular_cycles_flag"].value_counts(dropna=False))
dataframe["mother_ovarian_morphology_pcos_flag"] = (dataframe["mother_ovarian_morphology_pcos_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_ovarian_morphology_pcos_flag"].value_counts(dropna=False))
dataframe["mother_hirsutism_gt9_flag"] = (dataframe["mother_hirsutism_gt9_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_hirsutism_gt9_flag"].value_counts(dropna=False))
dataframe["mother_alopecia_flag"] = (dataframe["mother_alopecia_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_alopecia_flag"].value_counts(dropna=False))
dataframe["mother_moderate_acne_flag"] = (dataframe["mother_moderate_acne_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_moderate_acne_flag"].value_counts(dropna=False))
dataframe["mother_severe_acne_flag"] = (dataframe["mother_severe_acne_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["mother_severe_acne_flag"].value_counts(dropna=False))
dataframe["father_metabolic_syndrome_idf_flag"] = (dataframe["father_metabolic_syndrome_idf_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["father_metabolic_syndrome_idf_flag"].value_counts(dropna=False))
dataframe["father_metabolic_syndrome_atp3_flag"] = (dataframe["father_metabolic_syndrome_atp3_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["father_metabolic_syndrome_atp3_flag"].value_counts(dropna=False))
dataframe["sister_metabolic_syndrome_idf_flag"] = (dataframe["sister_metabolic_syndrome_idf_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_metabolic_syndrome_idf_flag"].value_counts(dropna=False))
dataframe["sister_metabolic_syndrome_atp3_flag"] = (dataframe["sister_metabolic_syndrome_atp3_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_metabolic_syndrome_atp3_flag"].value_counts(dropna=False))
dataframe["sister_irregular_cycles_flag"] = (dataframe["sister_irregular_cycles_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_irregular_cycles_flag"].value_counts(dropna=False))
dataframe["sister_ovarian_morphology_pcos_flag"] = (dataframe["sister_ovarian_morphology_pcos_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_ovarian_morphology_pcos_flag"].value_counts(dropna=False))
dataframe["sister_hirsutism_gt9_flag"] = (dataframe["sister_hirsutism_gt9_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_hirsutism_gt9_flag"].value_counts(dropna=False))
dataframe["sister_alopecia_flag"] = (dataframe["sister_alopecia_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_alopecia_flag"].value_counts(dropna=False))
dataframe["sister_moderate_acne_flag"] = (dataframe["sister_moderate_acne_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_moderate_acne_flag"].value_counts(dropna=False))
dataframe["sister_severe_acne_flag"] = (dataframe["sister_severe_acne_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["sister_severe_acne_flag"].value_counts(dropna=False))
dataframe["brother_metabolic_syndrome_idf_flag"] = (dataframe["brother_metabolic_syndrome_idf_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["brother_metabolic_syndrome_idf_flag"].value_counts(dropna=False))
dataframe["maternal_pcos_history"] = (dataframe["maternal_pcos_history"].map({"Yes": 0, "No": 1}))
print(dataframe["maternal_pcos_history"].value_counts(dropna=False))
dataframe["paternal_pcos_history"] = (dataframe["paternal_pcos_history"].map({"Yes": 0, "No": 1}))
print(dataframe["paternal_pcos_history"].value_counts(dropna=False))
dataframe["first_degree_metabolic_history"] = (dataframe["first_degree_metabolic_history"].map({"Yes": 0, "No": 1}))
print(dataframe["first_degree_metabolic_history"].value_counts(dropna=False))
dataframe["brother_metabolic_syndrome_atp3_flag"] = (dataframe["brother_metabolic_syndrome_atp3_flag"].map({"Yes": 0, "No": 1}))
print(dataframe["brother_metabolic_syndrome_atp3_flag"].value_counts(dropna=False))


drop_columns = ["weight_kg", "height_cm", "patient_file_no", "blood_group_code", "pulse_bpm", "fast_food_flag_imputed", "resp_rate", "pregnancy_flag", "beta_hcg_1", "fsh_lh_ratio", "hip_in", "waist_in", "whr", "diets_tried", "vitamin_d3", "bp_systolic", "bp_diastolic", "beta_hcg_2", "beta_hcg_2_imputed", "amh_imputed", "marriage_duration_years_imputed", "cycle_regularity_imputed", "rotterdam_phenotype", "exercise_forms_helpful", "tcm_systems_tried", "ayurveda_first_visit_timing", "ayurveda_use_duration", "ayurveda_decision_influence", "ayurveda_choice_reasons", "ayurveda_treatment_forms", "ayurveda_adverse_reaction", "yoga_nonuse_reasons", "yoga_future_interest", "yoga_duration", "yoga_reasons", "yoga_style", "yoga_elements", "family_history_source_detail", "family_history_known_flag", "family_member_count_reported", "family_history_t2d", "family_history_thyroid", "family_history_hypertension", "family_history_cardiovascular_disease", "mother_t2d", "mother_thyroid_disorder", "mother_hypertension", "mother_cardiovascular_disease", "mother_obesity", "father_t2d", "father_thyroid_disorder", "father_hypertension", "father_cardiovascular_disease", "father_obesity", "sister_t2d", "sister_thyroid_disorder", "brother_t2d", "brother_hypertension", "brother_cardiovascular_disease", "brother_obesity", "maternal_grandmother_t2d", "maternal_grandmother_thyroid", "paternal_grandmother_t2d", "paternal_grandmother_thyroid", "maternal_grandfather_t2d", "maternal_grandfather_hypertension", "maternal_grandfather_cardiovascular_disease", "paternal_grandfather_t2d", "paternal_grandfather_hypertension", "paternal_grandfather_cardiovascular_disease", "mother_waist_circumference_cm", "mother_hip_circumference_cm", "mother_whr", "mother_height_cm", "mother_weight_kg", "mother_sbp_mmhg", "mother_dbp_mmhg", "mother_raynaud_index", "mother_obesity_flag", "mother_t2d_diagnosis_flag", "mother_ifg_flag", "mother_igt_flag", "mother_elevated_fasting_insulin_flag", "mother_ir_by_homa_flag", "mother_acanthosis_nigricans_flag", "mother_lh_fsh_ratio", "mother_elevated_testosterone_flag", "mother_elevated_lh_fsh_flag", "father_waist_circumference_cm", "father_hip_circumference_cm", "father_whr", "father_height_cm", "father_weight_kg", "father_sbp_mmhg", "father_dbp_mmhg", "father_bg_fasting", "father_fasting_insulin", "father_quicki", "father_belfiore_index", "father_raynaud_index", "father_tsh", "father_t4", "father_obesity_flag", "father_t2d_diagnosis_flag", "father_ifg_flag", "father_igt_flag", "father_elevated_fasting_insulin_flag", "father_ir_by_homa_flag", "father_acanthosis_nigricans_flag", "father_premature_balding_flag", "sister_waist_circumference_cm", "sister_hip_circumference_cm", "sister_whr", "sister_height_cm", "sister_weight_kg", "sister_sbp_mmhg", "sister_dbp_mmhg", "sister_bg_fasting", "sister_raynaud_index", "sister_obesity_flag", "sister_t2d_diagnosis_flag", "sister_ifg_flag", "sister_igt_flag", "sister_elevated_fasting_insulin_flag", "sister_ir_by_homa_flag", "sister_lh_fsh_ratio", "sister_elevated_testosterone_flag", "sister_elevated_lh_fsh_flag", "brother_bmi", "brother_waist_circumference_cm", "brother_hip_circumference_cm", "brother_whr", "brother_height_cm", "brother_weight_kg", "brother_sbp_mmhg", "brother_dbp_mmhg", "brother_bg_fasting", "brother_fasting_insulin", "brother_quicki", "brother_belfiore_index", "brother_raynaud_index", "brother_tsh", "brother_t4", "brother_obesity_flag", "brother_t2d_diagnosis_flag", "brother_ifg_flag", "brother_igt_flag", "brother_elevated_fasting_insulin_flag", "brother_ir_by_homa_flag", "brother_acanthosis_nigricans_flag", "brother_premature_balding_flag", "family_t2d_count", "family_thyroid_count", "first_degree_pcos_history", "second_degree_pcos_history", "first_degree_t2d_history"]

# existing_columns = [
#     col for col in drop_columns
#     if col in dataframe.columns
# ]

# missing_columns = [
#     col for col in drop_columns
#     if col not in dataframe.columns
# ]

# print("Columns available for removal:", existing_columns)
# print("Columns not found:", missing_columns)


# Check whether all attributes of a family group are missing

# dataframe["father_all_missing"] = (dataframe[["father_metabolic_syndrome_idf_flag", "father_metabolic_syndrome_atp3_flag"]].isnull().all(axis=1))
# dataframe["sister_all_missing"] = (dataframe[["sister_metabolic_syndrome_idf_flag", "sister_metabolic_syndrome_atp3_flag", "sister_irregular_cycles_flag", "sister_ovarian_morphology_pcos_flag", "sister_hirsutism_gt9_flag", "sister_alopecia_flag", "sister_moderate_acne_flag", "sister_severe_acne_flag"]].isnull().all(axis=1))
# dataframe["brother_all_missing"] = (dataframe[["brother_metabolic_syndrome_idf_flag", "brother_metabolic_syndrome_atp3_flag"]].isnull().all(axis=1))

# missingness_summary = dataframe[["father_all_missing", "sister_all_missing", "brother_all_missing"]].value_counts(dropna=False).sort_index()
# print(missingness_summary)


# father_missing_pattern = dataframe[["father_metabolic_syndrome_idf_flag", "father_metabolic_syndrome_atp3_flag"]].isnull()
# print("Father missingness consistency:")
# print(father_missing_pattern.nunique(axis=1).value_counts())

# sister_missing_pattern = dataframe[["sister_metabolic_syndrome_idf_flag", "sister_metabolic_syndrome_atp3_flag", "sister_irregular_cycles_flag", "sister_ovarian_morphology_pcos_flag", "sister_hirsutism_gt9_flag", "sister_alopecia_flag", "sister_moderate_acne_flag", "sister_severe_acne_flag"]].isnull()
# print("\nSister missingness consistency:")
# print(sister_missing_pattern.nunique(axis=1).value_counts())

# brother_missing_pattern = dataframe[["brother_metabolic_syndrome_idf_flag", "brother_metabolic_syndrome_atp3_flag"]].isnull()
# print("\nBrother missingness consistency:")
# print(brother_missing_pattern.nunique(axis=1).value_counts())

# family_related_columns = [
#     col for col in dataframe.columns
#     if any(
#         keyword in col.lower()
#         for keyword in ["father", "sister", "brother", "sibling", "family"])]
# print(family_related_columns)


# father_columns = ["father_metabolic_syndrome_idf_flag", "father_metabolic_syndrome_atp3_flag"]
# sister_columns = ["sister_metabolic_syndrome_idf_flag", "sister_metabolic_syndrome_atp3_flag", "sister_irregular_cycles_flag", "sister_ovarian_morphology_pcos_flag", "sister_hirsutism_gt9_flag", "sister_alopecia_flag", "sister_moderate_acne_flag", "sister_severe_acne_flag"]
# brother_columns = ["brother_metabolic_syndrome_idf_flag", "brother_metabolic_syndrome_atp3_flag"]

# family_columns = father_columns + sister_columns + brother_columns

# for col in family_columns:
#     print(f"\n{col}")
#     print(dataframe[col].value_counts(dropna=False))

# family_imputer = SimpleImputer(strategy="most_frequent")
# dataframe[family_columns] = family_imputer.fit_transform(dataframe[family_columns])

# print("Missing values after imputation:")
# print(dataframe[family_columns].isnull().sum())

# for col in family_columns:
#     print(col, dataframe[col].unique())

# dataframe.to_csv("AAVYA_PCOS_Family_Imputed.csv", index=False)

remaining_columns = [
    col for col in dataframe.columns
    if col not in drop_columns]

remaining_missing = (dataframe[remaining_columns].isnull().sum())
remaining_missing = remaining_missing[remaining_missing > 0].sort_values(ascending=False)

print("Number of retained columns with missing values:", len(remaining_missing))
print("\nMissing-value summary:")
print(remaining_missing)

for col in remaining_missing.index:
    print(f"\n{col}")
    print("Data type:", dataframe[col].dtype)
    print(dataframe[col].value_counts(dropna=False).head(10))

# print(dataframe.head())
# print(dataframe.shape)
# print(dataframe.describe())
# print(dataframe.info())
# print(dataframe.isnull().sum())
# print(dataframe.dtypes)
# print(dataframe.duplicated().sum())
# print(dataframe.select_dtypes(include=["str", "category"]).columns.tolist())

dataframe = dataframe.drop(columns=drop_columns)

# print(dataframe.describe())
# print(dataframe.dtypes)

target_column = "pcos_label"
x = dataframe.drop(columns=[target_column])
y = dataframe[target_column]

# print(x.shape)
# print(y.shape)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.20, stratify=y, random_state=2)

# print("Training missing values:")
# print(x_train.isnull().sum().sum())

# print("\nTesting missing values:")
# print(x_test.isnull().sum().sum())

# all_missing_columns = [
#     col for col in x_train.columns
#     if x_train[col].isnull().all()]

# print("Entirely missing columns in training data:")
# print(all_missing_columns)


numeric_columns = x_train.select_dtypes(
    include=["number"]
).columns.tolist()

binary_columns = [
    col for col in numeric_columns
    if x_train[col].notna().any()
    and set(x_train[col].dropna().unique()).issubset({0, 1})
]
continuous_columns = [
    col for col in numeric_columns
    if col not in binary_columns]
categorical_columns = x_train.select_dtypes(include=["object", "category", "bool"]).columns.tolist()

# print("Binary columns:")
# print(binary_columns)

# print("\nContinuous numerical columns:")
# print(continuous_columns)

# print("\nCategorical columns:")
# print(categorical_columns)

# print("\nNumeric columns:")
# print(numeric_columns)


continuous_imputer = SimpleImputer(strategy="median")
binary_imputer = SimpleImputer(strategy="most_frequent")
categorical_imputer = SimpleImputer(strategy="most_frequent")


if continuous_columns:
    x_train.loc[:, continuous_columns] = (continuous_imputer.fit_transform(x_train[continuous_columns]))
    x_test.loc[:, continuous_columns] = (continuous_imputer.transform(x_test[continuous_columns]))
if binary_columns:
    x_train.loc[:, binary_columns] = (binary_imputer.fit_transform(x_train[binary_columns]))
    x_test.loc[:, binary_columns] = (binary_imputer.transform(x_test[binary_columns]))
if categorical_columns:
    x_train.loc[:, categorical_columns] = (categorical_imputer.fit_transform(x_train[categorical_columns]))
    x_test.loc[:, categorical_columns] = (categorical_imputer.transform(x_test[categorical_columns]))

# print("Training missing values:")
# print(x_train.isnull().sum().sum())

# print("\nTesting missing values:")
# print(x_test.isnull().sum().sum())


print(y.value_counts(normalize=True) * 100)

scaler = StandardScaler()

x_train_scaled = x_train.copy()
x_test_scaled = x_test.copy()

# for col in x_train.select_dtypes(include="number").columns:
#     print(
#         f"{col}: "
#         f"Unique values = {x_train[col].nunique()}, "
#         f"Sample values = {x_train[col].dropna().unique()[:10]}"
#         )

numerical_features = ["age_years", "bmi", "amh", "lh", "fsh", "hemoglobin", "cycle_length_days", "marriage_duration_years", "abortion_count", "tsh", "prolactin", "progesterone", "random_blood_sugar", "weight_gain_flag", "hirsutism_flag", "skin_darkening_flag", "hair_loss_flag", "acne_flag", "follicle_count_left", "follicle_count_right", "avg_follicle_size_left_mm", "avg_follicle_size_right_mm", "endometrium_mm", "fasting_insulin_uiu_ml", "insulin_ogtt_1hr_uiu_ml", "insulin_ogtt_2hr_uiu_ml", "fasting_glucose_mg_dl", "homa_ir", "quicki", "belfiore_index", "raynaud_index", "serum_testosterone_ng_ml", "serum_t4_ug_dl", "fg_score_numeric", "fast_food_flag", "regular_exercise_flag", "sitting_time_per_day", "walking_days_per_week", "walking_duration_per_day", "moderate_activity_days", "moderate_activity_duration", "vigorous_activity_days", "vigorous_activity_duration", "strength_exercise_days", "strength_exercise_duration", "mother_infertility", "mother_endometriosis", "mother_early_menopause", "mother_metabolic_syndrome", "father_metabolic_syndrome", "sister_infertility", "sister_endometriosis", "sister_early_menopause", "brother_metabolic_syndrome", "maternal_grandmother_infertility", "paternal_grandmother_infertility", "mother_bmi", "mother_bg_fasting", "mother_fasting_insulin", "mother_homa_ir", "mother_quicki", "mother_belfiore_index", "mother_tsh", "mother_t4", "mother_cycles_per_year", "mother_hirsutism_duration_years", "mother_fg_score", "mother_lh", "mother_fsh", "mother_testosterone", "mother_prolactin", "father_bmi", "father_homa_ir", "sister_bmi", "sister_fasting_insulin", "sister_homa_ir", "sister_quicki", "sister_belfiore_index", "sister_tsh", "sister_t4", "sister_cycles_per_year", "sister_hirsutism_duration_years", "sister_fg_score", "sister_lh", "sister_fsh", "sister_testosterone", "sister_prolactin", "family_pcos_count", "family_infertility_count"]

x_train_scaled[numerical_features] = (scaler.fit_transform(x_train[numerical_features]))
x_test_scaled[numerical_features] = scaler.transform(x_test[numerical_features])

print(x_train_scaled[numerical_features].describe().round(2))
print(x_test_scaled[numerical_features].describe().round(2))

# plt.figure(figsize=(8, 5))

# sns.countplot(x=y_train, hue=y_train, palette="Set2", legend=False)

# plt.title("PCOS Class Distribution Before Balancing")
# plt.xlabel("PCOS Label (0 = Negative, 1 = Positive)")
# plt.ylabel("Number of Samples")
# plt.xticks([0, 1], ["PCOS Negative", "PCOS Positive"])

# plt.show()

baseline_model = LogisticRegression(max_iter=100, random_state=2)

# iteration_values = [100, 250, 500, 1000, 2000]

# for iteration in iteration_values:

#     model = LogisticRegression(max_iter=iteration, random_state=2)

#     model.fit(x_train_scaled, y_train)

#     print(
#         f"Max Iterations: {iteration} | "
#         f"Actual Iterations: {model.n_iter_[0]} | "
#         f"Test Accuracy: "
#         f"{accuracy_score(y_test, model.predict(x_test_scaled)):.4f}"
#     )

# print("Non-numeric columns:")
# print(x_train_scaled.select_dtypes(exclude=["number"]).dtypes)

# print("\nColumns containing Yes/No or other strings:")

# for col in x_train_scaled.columns:
#     if x_train_scaled[col].dtype == "object":
#         print(f"\n{col}")
#         print(x_train_scaled[col].value_counts(dropna=False))

baseline_model.fit(x_train_scaled, y_train)

y_pred_baseline = baseline_model.predict(x_test_scaled)
y_prob_baseline = baseline_model.predict_proba(x_test_scaled)[:, 1]

baseline_accuracy = accuracy_score(y_test, y_pred_baseline)
baseline_precision = precision_score(y_test, y_pred_baseline, zero_division=0)
baseline_recall = recall_score(y_test, y_pred_baseline, zero_division=0)
baseline_f1 = f1_score(y_test, y_pred_baseline, zero_division=0)
baseline_roc_auc = roc_auc_score(y_test, y_prob_baseline)
baseline_pr_auc = average_precision_score(y_test, y_prob_baseline)

print("BASELINE MODEL PERFORMANCE")

print("Accuracy:", baseline_accuracy)
print("Precision:", baseline_precision)
print("Recall:", baseline_recall)
print("F1 Score:", baseline_f1)
print("ROC-AUC:", baseline_roc_auc)
print("PR-AUC:", baseline_pr_auc)

print(classification_report(y_test, y_pred_baseline, target_names=["PCOS Negative", "PCOS Positive"], zero_division=0))

cm = confusion_matrix(y_test, y_pred_baseline)

plt.figure(figsize=(7, 5))

sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Negative", "Positive"], yticklabels=["Negative", "Positive"])

plt.title("Baseline Logistic Regression - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("Actual Label")

plt.show()

results_df = pd.DataFrame(
    {
        "Baseline": {
            "Accuracy": baseline_accuracy,
            "Precision": baseline_precision,
            "Recall": baseline_recall,
            "F1 Score": baseline_f1, 
            "ROC-AUC": baseline_roc_auc,
            "PR-AUC": baseline_pr_auc
        }
    }
).T

print(results_df.round(4))

metrics_to_plot = ["Accuracy", "Precision", "Recall", "F1 Score", "ROC-AUC", "PR-AUC"]

results_df[metrics_to_plot].plot(kind="bar", figsize=(11, 6), width=0.75)

plt.title("Performance Comparison of Logistic Regression Models")
plt.xlabel("Model")
plt.ylabel("Score")
plt.ylim(0, 1.05)

plt.xticks(rotation=0)
plt.legend(loc="lower right")
plt.grid(axis="y", linestyle="--", alpha=0.5)

plt.tight_layout()
plt.show()

# categorical_indices = [x_train_scaled.columns.get_loc("cycle_regularity"), x_train_scaled.columns.get_loc("yoga_practiced")]
# smotenc = SMOTENC(categorical_features=categorical_indices, sampling_strategy="auto", random_state=2, k_neighbors=10)
# x_train_balanced, y_train_balanced = (smotenc.fit_resample(x_train_scaled, y_train))

# print(y_train_balanced.value_counts(normalize=True) * 100)

# smotenc_model = LogisticRegression(max_iter=100, random_state=2)
# smotenc_model.fit(x_train_balanced, y_train_balanced)

# y_pred_smotenc = smotenc_model.predict(x_test_scaled)
# y_prob_smotenc = smotenc_model.predict_proba(x_test_scaled)[:, 1]

# smotenc_accuracy = accuracy_score(y_test, y_pred_smotenc)
# smotenc_precision = precision_score(y_test, y_pred_smotenc, zero_division=0)
# smotenc_recall = recall_score(y_test, y_pred_smotenc, zero_division=0)
# smotenc_f1 = f1_score(y_test, y_pred_smotenc, zero_division=0)
# smotenc_roc_auc = roc_auc_score(y_test, y_prob_smotenc)
# smotenc_pr_auc = average_precision_score(y_test, y_prob_smotenc)
# print("SMOTENC MODEL PERFORMANCE")

# print("Accuracy:", smotenc_accuracy)
# print("Precision:", smotenc_precision)
# print("Recall:", smotenc_recall)
# print("F1 Score:", smotenc_f1)
# print("ROC-AUC:", smotenc_roc_auc)
# print("PR-AUC:", smotenc_pr_auc)

# print(classification_report(y_test, y_pred_smotenc, target_names=["PCOS Negative", "PCOS Positive"], zero_division= 0))

# cm_smotenc = confusion_matrix(y_test, y_pred_smotenc)

# plt.figure(figsize=(7, 5))

# sns.heatmap(cm_smotenc, annot=True, fmt="d", cmap="Greens", xticklabels=["Negative", "Positive"], yticklabels=["Negative", "Positive"])

# plt.title("SMOTENC Logistic Regression - Confusion Matrix")
# plt.xlabel("Predicted Label")
# plt.ylabel("Actual Label")

# plt.show()