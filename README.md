# AAVYA - Hereditary AI for Women's Health Risk Prediction

This repository is an early-stage data workspace for exploring clinical features
related to polycystic ovary syndrome (PCOS). Despite the repository name, the
current contents are a dataset only: there is no implemented prediction model,
training or evaluation pipeline, application, or clinical decision-support
system.

## Project status

- One initial clinical dataset is present: 530 rows and 60 columns.
- The `dataset_1_refined`, `dataset_2`, and `dataset_3` directories are empty.
- No source code, notebooks, dependency files, automated tests, or model
  artifacts are currently included.
- Dataset provenance, collection methods, consent, and license are not
  documented in this repository.

Consequently, there are currently no project-specific installation, training,
or prediction commands. The data can be inspected with standard CSV tools.

## Repository layout

```text
datasets/
├── dataset_1/
│   ├── dataset_1_initial/
│   │   └── model_1_clinical.csv
│   └── dataset_1_refined/       # Empty
├── dataset_2/                   # Empty
└── dataset_3/                   # Empty
```

## Dataset

[`datasets/dataset_1/dataset_1_initial/model_1_clinical.csv`](datasets/dataset_1/dataset_1_initial/model_1_clinical.csv)
contains 530 observations and 60 fields. It includes a `pcos_label` field
(355 records labeled `0`, 175 labeled `1`), a `rotterdam_phenotype` field,
clinical measurements, reproductive history, symptom indicators, and
calculated or imputation-related fields.

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
should be verified before analysis. The current CSV has no blank cells, but
some fields are explicitly named as imputed or are accompanied by imputation
indicators. Review the data-generation and preprocessing methodology before
using those fields.

## Inspecting the CSV

Python's standard library is sufficient to read the file; no project
dependencies are provided:

```python
import csv
from pathlib import Path

path = Path("datasets/dataset_1/dataset_1_initial/model_1_clinical.csv")

with path.open(newline="", encoding="utf-8") as csv_file:
    rows = list(csv.DictReader(csv_file))

print(f"Rows: {len(rows)}")
print(f"Columns: {len(rows[0]) if rows else 0}")
```

Run this from the repository root.

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

## Next steps

To turn this data workspace into a reproducible project, document the dataset's
source and schema, define the target and evaluation approach, and add versioned
preprocessing, training, and validation code. Any model should be evaluated
for data leakage, class imbalance, bias, and limitations before its results are
shared or considered for any clinical context.
