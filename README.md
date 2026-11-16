# AAVYA - Hereditary AI for Women's Health Risk Prediction

This repository contains a PCOS-related clinical dataset and a Python-based
baseline workflow for binary risk prediction. It is an early-stage research and
exploration project, not a validated clinical decision-support system.

## Current status

- The dataset contains 530 rows and 60 columns.
- `datasets/dataset_1/dataset_1_initial/main.py` loads the CSV, prepares the
  feature matrix, trains a logistic regression model, and prints evaluation
  metrics.
- The workflow includes:
  - mapping `cycle_regularity` values to numeric labels (`Regular` -> 0,
    `Irregular` -> 1)
  - dropping a curated set of non-model columns
  - train/test splitting with stratification on `pcos_label`
  - numeric feature scaling using `StandardScaler`
  - baseline model evaluation with accuracy, precision, recall, F1, ROC-AUC,
    and a classification report
  - a confusion matrix heatmap rendered with Seaborn
- An experimental SMOTENC-based balancing pipeline is included as commented-out
  code for future exploration.
- Pinned dependencies are listed in
  `datasets/dataset_1/dataset_1_initial/requirements.txt`.
- The `dataset_1_refined`, `dataset_2`, and `dataset_3` directories remain
  empty placeholders in this repository.

## Repository layout

```text
datasets/
├── dataset_1/
│   ├── dataset_1_initial/
│   │   ├── main.py
│   │   ├── model_1_clinical.csv
│   │   └── requirements.txt
│   └── dataset_1_refined/       # Placeholder
├── dataset_2/                   # Placeholder
└── dataset_3/                   # Placeholder
```

## Dataset

[`datasets/dataset_1/dataset_1_initial/model_1_clinical.csv`](datasets/dataset_1/dataset_1_initial/model_1_clinical.csv)
contains 530 observations and 60 fields. The target column is `pcos_label`.
The dataset includes 355 negative cases (`0`) and 175 positive cases (`1`).
Other features cover demographics, reproductive history, hormonal markers,
symptom flags, and clinical/ultrasound values.

Examples of feature groups include:

- **Demographics and measurements:** age, BMI, blood pressure, pulse, and
  respiratory rate.
- **Reproductive and hormonal values:** cycle regularity and length, pregnancy
  and abortion counts, beta-hCG, FSH, LH, TSH, prolactin, progesterone, AMH,
  testosterone, and T4.
- **Symptoms and lifestyle indicators:** hirsutism, skin darkening, hair loss,
  acne, weight gain, fast-food intake, and exercise.
- **Metabolic and ultrasound fields:** glucose, insulin, derived index values,
  follicle counts, sizes, and endometrium thickness.

The current pipeline drops several columns before modeling, including:
non-predictive or redundant fields, imputation indicators, and some metadata or
measurement variables not used in the baseline classifier.

## Run the baseline model

From the repository root, create a virtual environment, install the pinned
requirements, and run the script:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r datasets/dataset_1/dataset_1_initial/requirements.txt
python datasets/dataset_1/dataset_1_initial/main.py
```

The script currently contains a hard-coded absolute Windows path to the CSV on
its original development machine. If your checkout is in a different location,
update the `pd.read_csv(...)` path in `main.py` before running it.

## What the script does

The current `main.py` performs the following actions:

1. Loads the PCOS clinical dataset.
2. Encodes `cycle_regularity` as a numeric binary field.
3. Drops a selected set of columns considered unnecessary for the current
   baseline model.
4. Splits the data into training and test sets with `test_size=0.20` and
   stratification on `pcos_label`.
5. Scales selected numerical features with `StandardScaler`.
6. Trains a `LogisticRegression` classifier.
7. Evaluates the model on the held-out test set and prints:
   - Accuracy
   - Precision
   - Recall
   - F1 score
   - ROC-AUC
   - Classification report
8. Displays a confusion matrix heatmap for model error analysis.

This is a baseline model for experimentation and research. It is not yet a
production-ready medical prediction pipeline.

## Responsible use

This repository is not a medical device and does not provide diagnostic or
treatment recommendations. No model performance, bias, or clinical validity has
been formally established here. Do not use this dataset or any future model
output to make decisions about an individual's care.

The dataset concerns reproductive and health data. Before sharing data,
publishing results, or using it for research or development, establish
provenance, data rights, privacy protections, and any applicable consent or
ethics requirements.

## Further development

Before building a reproducible predictive workflow, document the dataset source
and schema, define the classification target and evaluation strategy, and add
versioned preprocessing, training, validation, and reporting code. Any future
model should be evaluated for class imbalance, data leakage, bias, and
limitations before being shared or used in clinical contexts.
