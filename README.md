# AAVYA - Hereditary AI for Women's Health Risk Prediction

AAVYA is an early-stage Python research project exploring logistic-regression
models for predicting a PCOS (`pcos_label`) risk indicator from three progressively
expanded PCOS datasets.

> **Important:** This repository is a research and educational experiment, not a
> validated medical device or clinical decision-support system. It does not
> provide diagnoses or treatment recommendations.

## Repository contents

```text
datasets/
├── dataset_1/
│   └── logistic_regression/
│       └── dataset_1_initial/
│           ├── dataset_1.csv
│           └── main.py
├── dataset_1+2/
│   └── logistic_regression/
│       ├── dataset_1 & 2 combined.csv
│       └── main.py
└── dataset_1+2+3/
    └── logistic_regression/
        ├── dataset+1+2+3(final_generated).csv
        ├── dataset_1+2+3(final).csv
        └── main.py
requirements.txt
README.md
```

The `dataset+1+2+3(final_generated).csv` file is a 281-column generated dataset.
The workflow currently executed by `main.py` loads the 280-column
`dataset_1+2+3(final).csv` file.

## Datasets

All four CSV files contain 530 records and use `pcos_label` as the binary target:

| Dataset | CSV | Fields | Negative (`0`) | Positive (`1`) |
|---|---|---:|---:|---:|
| Dataset 1 | `dataset_1.csv` | 60 | 355 | 175 |
| Datasets 1 + 2 | `dataset_1 & 2 combined.csv` | 85 | 355 | 175 |
| Datasets 1 + 2 + 3, generated | `dataset+1+2+3(final_generated).csv` | 281 | 355 | 175 |
| Datasets 1 + 2 + 3, final | `dataset_1+2+3(final).csv` | 280 | 355 | 175 |

The data combines demographic, reproductive, hormonal, symptom, metabolic,
ultrasound, lifestyle, treatment, and family-history information. It is sensitive
health data. Before sharing or using it, confirm that the data was collected and
can be used under appropriate consent, privacy, licensing, and ethical requirements.

## Model workflows

The three scripts share the following core approach:

1. Load their corresponding CSV file.
2. Encode selected `Yes`/`No`, `Regular`/`Irregular`, and family-history fields as numbers.
3. Remove a configured set of identifiers, derived, imputed, or low-value columns.
4. Split the data with an 80/20 stratified train/test split and `random_state=2`.
5. Standardize a configured set of continuous or numeric features.
6. Train a `LogisticRegression(max_iter=100, random_state=2)` classifier.
7. Report accuracy, precision, recall, F1, ROC-AUC, PR-AUC, and the classification report.
8. Display a confusion-matrix heatmap and a performance bar chart.

### Dataset 1 baseline

[dataset_1/main.py](datasets/dataset_1/logistic_regression/dataset_1_initial/main.py)
loads the 60-field baseline dataset, maps `cycle_regularity`, removes selected
columns, performs the 80/20 split, and standardizes the configured numerical
features.

### Combined datasets 1 + 2

[dataset_1+2/main.py](datasets/dataset_1+2/logistic_regression/main.py)
extends the baseline workflow to the 85-field combined dataset. It additionally
maps `yoga_practiced` and includes expanded lifestyle and treatment fields in
the feature set.

The script also contains commented-out code for comparing multiple
`max_iter` values and for balancing with SMOTENC.

### Combined datasets 1 + 2 + 3

[dataset_1+2+3/main.py](datasets/dataset_1+2+3/logistic_regression/main.py)
uses the 280-field final CSV and is the most extensive workflow. It:

- maps `cycle_regularity`, `yoga_practiced`, and numerous family-history
  `Yes`/`No` fields to numeric values;
- removes an extensive set of identifiers, derived fields, family-detail fields,
  imputed columns, and other configured columns;
- reports the retained columns that still contain missing values;
- separates training features into continuous, binary, and categorical columns;
- imputes continuous features with the median and binary/categorical features
  with the most frequent value;
- scales an explicit list of numeric features;
- prints scaled train/test summaries;
- trains and evaluates the baseline logistic-regression model; and
- plots the confusion matrix and model metrics.

SMOTENC imports and implementation code remain in the script, but the
SMOTENC balancing section is currently commented out. The active model is therefore
trained on the imputed, scaled, non-balanced training data.

## Setup

This project uses Python and the packages listed in `requirements.txt`.
The repository provides no managed virtual environment.

From the repository root on Windows, create and activate a virtual environment:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

The workflows use pinned dependencies for pandas, NumPy, scikit-learn,
matplotlib, seaborn, and imbalanced-learn.

## Running the scripts

The scripts currently contain hard-coded absolute Windows CSV paths rooted at
`D:\AAVYA-HeredityAI-for_women_health_risk_prediction`. When using a different
checkout location or operating system, update the `pd.read_csv(...)` argument in
the script you intend to run. Relative paths are recommended for portable use.

Run the Dataset 1 baseline:

```powershell
python datasets/dataset_1/logistic_regression/dataset_1_initial/main.py
```

Run the Dataset 1 + 2 workflow:

```powershell
python "datasets/dataset_1+2/logistic_regression/main.py"
```

Run the Dataset 1 + 2 + 3 workflow:

```powershell
python "datasets/dataset_1+2+3/logistic_regression/main.py"
```

The scripts print model metrics and open Matplotlib plots, so run them in an
environment with graphical display support. Close each plot window to allow the
script to continue.

## Output

Each active workflow prints:

- target-class distribution;
- train/test feature information or scaled summaries;
- accuracy;
- precision;
- recall;
- F1 score;
- ROC-AUC;
- PR-AUC (average precision); and
- a per-class classification report.

It also displays a confusion-matrix heatmap and a metric chart.

No prediction API, saved model artifact, notebook, or web interface is currently
included in the repository.

## Responsible use

Model performance has not been independently validated. Additional work would be
required before any real-world evaluation, including:

- independent train/test or external validation;
- leakage and provenance review;
- missingness analysis;
- class-imbalance and threshold analysis;
- fairness and subgroup-bias evaluation;
- model calibration;
- reproducible data and environment management;
- clinical review and regulatory assessment.

Do not use these experimental outputs to make decisions about an individual's
health, diagnosis, or treatment.
