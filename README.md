# AAVYA - Hereditary AI for Women's Health Risk Prediction

This repository contains an initial PCOS-related clinical dataset and a small
Python script for exploratory inspection. It is an early-stage data workspace,
not a completed prediction application or clinical decision-support system.

## Current status

- The initial clinical CSV contains 530 rows and 60 columns.
- `main.py` prints a preview, the dataset dimensions, descriptive statistics,
  and DataFrame information.
- The script does **not** train or evaluate a prediction model.
- Pinned Python dependencies for this dataset workspace are listed in
  `datasets/dataset_1/dataset_1_initial/requirements.txt`.
- The `dataset_1_refined`, `dataset_2`, and `dataset_3` directories are empty
  placeholders and may not be included in a Git checkout.
- Dataset provenance, collection methods, consent, and license are not
  documented in this repository.

## Repository layout

```text
datasets/
├── dataset_1/
│   ├── dataset_1_initial/
│   │   ├── main.py
│   │   ├── model_1_clinical.csv
│   │   └── requirements.txt
│   └── dataset_1_refined/       # Empty placeholder
├── dataset_2/                   # Empty placeholder
└── dataset_3/                   # Empty placeholder
```

## Dataset

[`model_1_clinical.csv`](datasets/dataset_1/dataset_1_initial/model_1_clinical.csv)
contains 530 observations and 60 fields. The `pcos_label` field has 355 records
labeled `0` and 175 labeled `1`. Other fields include `rotterdam_phenotype`,
clinical measurements, reproductive history, symptom indicators, and
calculated or imputation-related values.

Examples of field groups include:

- **Demographics and measurements:** age, weight, height, BMI, blood pressure,
  pulse, and respiratory rate.
- **Reproductive and hormonal measures:** cycle regularity and length,
  pregnancy and abortion fields, beta-hCG, FSH, LH, TSH, prolactin,
  progesterone, AMH, testosterone, and T4.
- **Symptoms and lifestyle indicators:** hirsutism, skin darkening, hair loss,
  acne, weight gain, fast-food intake, and exercise.
- **Metabolic and ultrasound fields:** glucose, insulin, derived indices,
  follicle counts and sizes, and endometrium thickness.

Column names describe the available fields; units and clinical definitions
should be verified before analysis. The CSV currently has no blank cells, but
some fields are explicitly named as imputed or are accompanied by imputation
indicators. Review the data-generation and preprocessing methodology before
using those fields.

## Run the inspection script

From the repository root, install the pinned dependencies and run the script:

```powershell
python -m pip install -r datasets/dataset_1/dataset_1_initial/requirements.txt
python datasets/dataset_1/dataset_1_initial/main.py
```

The script currently contains an absolute Windows path to the CSV on its
original development machine. If your checkout is in a different location,
update the `pd.read_csv(...)` path in `main.py` before running it.

## Responsible use

This repository is not a medical device and does not provide diagnostic or
treatment recommendations. No model performance, bias, or clinical validity
has been established here. Do not use this dataset or any future model output
to make decisions about an individual's care.

The data concerns health and reproductive health. Before sharing it, publishing
results, or using it for research or development, establish its provenance,
rights to use, privacy protections, and any applicable consent or ethics
requirements. Do not infer that the data is synthetic, anonymized, or licensed
for reuse because those details are not documented here.

## Further development

Before building a reproducible prediction workflow, document the dataset's
source and schema, define the target and evaluation approach, and add versioned
preprocessing, training, and validation code. Evaluate any future model for
data leakage, class imbalance, bias, and limitations before sharing its
results or considering any clinical context.
