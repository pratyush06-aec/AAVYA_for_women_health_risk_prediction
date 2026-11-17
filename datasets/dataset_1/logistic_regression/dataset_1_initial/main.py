import pandas as pd
import matplotlib.pyplot as plt
# import numpy as np
from sklearn.model_selection import train_test_split 
# from sklern.model_selection import StratifiedKFold, cross_validate
from sklearn.metrics import classification_report, f1_score, confusion_matrix, accuracy_score, precision_score, recall_score, roc_auc_score, roc_curve, auc
from sklearn.linear_model import LogisticRegression
import seaborn as sns
# from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.preprocessing import StandardScaler
# from sklearn.preprocessing import OrdinalEncoder
from imblearn.over_sampling import SMOTENC


dataframe= pd.read_csv("D:\AAVYA-HeredityAI-for_women_health_risk_prediction\datasets\dataset_1\logistic_regression\dataset_1_initial\dataset_1.csv")
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

drop_columns = ["weight_kg", "height_cm", "patient_file_no", "blood_group_code", "pulse_bpm", "resp_rate", "pregnancy_flag", "beta_hcg_1", "fsh_lh_ratio", "hip_in", "waist_in", "whr", "vitamin_d3", "fast_food_flag", "regular_exercise_flag", "bp_systolic", "bp_diastolic", "beta_hcg_2", "beta_hcg_2_imputed", "amh_imputed", "marriage_duration_years_imputed", "cycle_regularity_imputed", "rotterdam_phenotype"]

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

dataframe = dataframe.drop(columns=drop_columns)

# print(dataframe.describe())
# print(dataframe.dtypes)

target_column = "pcos_label"
x = dataframe.drop(columns=[target_column])
y = dataframe[target_column]

print(x.shape)
print(y.shape)

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.20, stratify=y, random_state=2)

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

numerical_features = ["age_years", "bmi", "amh", "lh", "fsh", "hemoglobin", "cycle_length_days", "marriage_duration_years", "abortion_count", "tsh", "prolactin", "progesterone", "random_blood_sugar", "weight_gain_flag", "hirsutism_flag", "skin_darkening_flag", "hair_loss_flag", "acne_flag", "follicle_count_left", "follicle_count_right", "avg_follicle_size_left_mm", "avg_follicle_size_right_mm", "endometrium_mm", "fasting_insulin_uiu_ml", "insulin_ogtt_1hr_uiu_ml", "insulin_ogtt_2hr_uiu_ml", "fasting_glucose_mg_dl", "homa_ir", "quicki", "belfiore_index", "raynaud_index", "serum_testosterone_ng_ml", "serum_t4_ug_dl", "fg_score_numeric"]

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

baseline_model.fit(x_train_scaled, y_train)

y_pred_baseline = baseline_model.predict(x_test_scaled)
y_prob_baseline = baseline_model.predict_proba(x_test_scaled)[:, 1]

baseline_accuracy = accuracy_score(y_test, y_pred_baseline)
baseline_precision = precision_score(y_test, y_pred_baseline, zero_division=0)
baseline_recall = recall_score(y_test, y_pred_baseline, zero_division=0)
baseline_f1 = f1_score(y_test, y_pred_baseline, zero_division=0)
baseline_roc_auc = roc_auc_score(y_test, y_prob_baseline)

print("BASELINE MODEL PERFORMANCE")

print("Accuracy:", baseline_accuracy)
print("Precision:", baseline_precision)
print("Recall:", baseline_recall)
print("F1 Score:", baseline_f1)
print("ROC-AUC:", baseline_roc_auc)

print(classification_report(y_test, y_pred_baseline, target_names=["PCOS Negative", "PCOS Positive"], zero_division=0))

cm = confusion_matrix(y_test, y_pred_baseline)

plt.figure(figsize=(7, 5))

sns.heatmap(cm, annot=True, fmt="d", cmap="Blues", xticklabels=["Negative", "Positive"], yticklabels=["Negative", "Positive"])

plt.title("Baseline Logistic Regression - Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("Actual Label")

plt.show()

# categorical_indices = [x_train_scaled.columns.get_loc("cycle_regularity")]
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

# print("BASELINE MODEL PERFORMANCE")

# print("Accuracy:", smotenc_accuracy)
# print("Precision:", smotenc_precision)
# print("Recall:", smotenc_recall)
# print("F1 Score:", smotenc_f1)
# print("ROC-AUC:", smotenc_roc_auc)

# print(classification_report(y_test, y_pred_smotenc, target_names=["PCOS Negative", "PCOS Positive"], zero_division= 0))

# cm_smotenc = confusion_matrix(y_test, y_pred_smotenc)

# plt.figure(figsize=(7, 5))

# sns.heatmap(cm_smotenc, annot=True, fmt="d", cmap="Greens", xticklabels=["Negative", "Positive"], yticklabels=["Negative", "Positive"])

# plt.title("SMOTENC Logistic Regression - Confusion Matrix")
# plt.xlabel("Predicted Label")
# plt.ylabel("Actual Label")

# plt.show()