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