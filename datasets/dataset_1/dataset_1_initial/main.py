import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.metrics import classification_report, f1_score, confusion_matrix, accuracy_score, precision_score, recall_score, roc_auc_score, roc_curve, auc
from sklearn.linear_model import LogisticRegression
import seaborn as sns
from imblearn.pipeline import Pipeline as ImbPipeline
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from imblearn.over_sampling import SMOTENC
from sklearn.pipeline import Pipeline


dataframe= pd.read_csv("D:\AAVYA-HeredityAI-for_women_health_risk_prediction\datasets\dataset_1\dataset_1_initial\model_1_clinical.csv")
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

plt.figure(figsize=(8, 5))

sns.countplot(x=y_train, hue=y_train, palette="Set2", legend=False)

plt.title("PCOS Class Distribution Before Balancing")
plt.xlabel("PCOS Label (0 = Negative, 1 = Positive)")
plt.ylabel("Number of Samples")
plt.xticks([0, 1], ["PCOS Negative", "PCOS Positive"])

plt.show()

