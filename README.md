# AAVYA - Hereditary AI for Women's Health Risk Prediction

This repository contains two PCOS-related datasets and experimental Python
workflows for exploring logistic-regression-based risk prediction. This is an
early-stage research project, not a validated clinical decision-support system.

## Repository contents

```text
datasets/
├── dataset_1/
│   └── logistic_regression/
│       └── dataset_1_initial/
│           ├── dataset_1.csv
│           └── main.py
└── dataset_1+2/
    └── logistic_regression/
        ├── dataset_1 & 2 combined.csv
        └── main.py
requirements.txt
```

The root-level `requirements.txt` lists the pinned Python dependencies used by
the scripts, including pandas, scikit-learn, matplotlib, seaborn, and
imbalanced-learn.

## Datasets

Both CSV files contain 530 rows with `pcos_label` as the target: 355 negative
cases (`0`) and 175 positive cases (`1`).

- `datasets/dataset_1/logistic_regression/dataset_1_initial/dataset_1.csv`
  contains 60 fields.
- `datasets/dataset_1+2/logistic_regression/dataset_1 & 2 combined.csv`
  contains 85 fields, including additional lifestyle and treatment-related
  fields.

The columns cover demographic, reproductive, hormonal, symptom, metabolic,
ultrasound, and lifestyle information. This data concerns sensitive health
information; confirm its provenance, rights, privacy protections, consent, and
ethics requirements before sharing or using it.

## Workflows

### Dataset 1 baseline

`datasets/dataset_1/logistic_regression/dataset_1_initial/main.py` runs a
baseline logistic-regression workflow. It maps `cycle_regularity` to numeric
values, removes selected columns, makes a stratified 80/20 train/test split,
standardizes selected numerical features, trains the classifier, and reports
accuracy, precision, recall, F1, ROC-AUC, and a classification report. It also
displays a confusion-matrix heatmap.

### Combined dataset experiment

`datasets/dataset_1+2/logistic_regression/main.py` currently loads the combined
CSV, maps `cycle_regularity` and `yoga_practiced` to numeric values, and removes
selected columns, including `diets_tried`. It then makes a stratified 80/20
train/test split, standardizes the selected numerical features, and displays
the target distribution and scaled-feature summaries. It trains and evaluates
a baseline logistic-regression model, comparing several `max_iter` values and
reporting accuracy, precision, recall, F1, ROC-AUC, and a classification
report. It also displays a class-distribution plot and a confusion-matrix
heatmap. SMOTENC balancing code is present but remains commented out.

## Setup and running

From the repository root, create and activate a virtual environment, then
install the root dependencies:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Both scripts currently use hard-coded absolute Windows paths to read their CSV
files. Before running a script from another checkout location or operating
system, update its `pd.read_csv(...)` path to point to the matching CSV.

Run the dataset 1 baseline with:

```powershell
python datasets/dataset_1/logistic_regression/dataset_1_initial/main.py
```

Run the combined-dataset experiment with:

```powershell
python "datasets/dataset_1+2/logistic_regression/main.py"
```

Both workflows display plots, so run them in an environment with graphical
display support.

## Responsible use

This repository is not a medical device and does not provide diagnostic or
treatment recommendations. Model performance, bias, and clinical validity have
not been formally established. Do not use any model output to make decisions
about an individual's care.

Any future model should be evaluated for data leakage, class imbalance, bias,
reproducibility, and clinical limitations before its results are shared or
considered for use in a clinical context.
