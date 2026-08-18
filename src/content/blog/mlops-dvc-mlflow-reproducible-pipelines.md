---
title: Production MLOps: Data Versioning with DVC and Tracking Experiments in MLflow
date: 2026-06-18
description: Build a fully reproducible machine learning training pipeline combining Data Version Control (DVC) for storage tracking and MLflow for experiment metrics logging.
tags: [mlops, dvc, mlflow, python, data-science]
---

## The Machine Learning Reproducibility Crisis

In software engineering, Git tracks code changes. But in Machine Learning, a model artifact depends on **Code + Hyperparameters + Dataset Snapshot**. Changing 1% of training data yields completely different model behavior.

Combining **DVC (Data Version Control)** and **MLflow** builds a robust foundation for ML engineering: DVC tracks large datasets in remote storage, while MLflow logs hyperparameters, metrics, and serialized artifacts.

## Pipeline Architecture

```
 +------------------------------------------------------------------+
 |                     Data & Experiment Pipeline                   |
 |                                                                  |
 |  [ Raw Dataset ] -- dvc add --> [ Amazon S3 / GCS Data Remote ]   |
 |        |                                                         |
 |     dvc repro                                                    |
 |        |                                                         |
 |        v                                                         |
 |  [ Pipeline Run (dvc.yaml) ]                                     |
 |   ├─ stage: preprocess.py                                        |
 |   ├─ stage: train.py ─────── mlflow.log_params() ──┐             |
 |   └─ stage: evaluate.py ───── mlflow.log_metrics() ─┼─> [ MLflow ]
 +-----------------------------------------------------|------------+
                                                       v
                                            [ MLflow Tracking UI ]
```

## Step 1 — Initialize DVC with S3 Remote Storage

Track datasets using lightweight `.dvc` pointer files while committing the metadata to Git:

```bash
# Initialize DVC repository
dvc init

# Add AWS S3 bucket as remote data registry
dvc remote add -d s3remote s3://my-company-ml-datasets/sentiment-v1
dvc remote modify s3remote region us-east-1

# Track a 5GB dataset file
dvc add data/raw/train_corpus.csv
git add data/raw/train_corpus.csv.dvc .gitignore
git commit -m "track raw dataset v1.2"
dvc push
```

## Step 2 — Defining Reproducible Pipelines (`dvc.yaml`)

Define deterministic execution stages with dependencies and output artifacts in `dvc.yaml`:

```yaml
stages:
  preprocess:
    cmd: python src/preprocess.py
    deps:
      - src/preprocess.py
      - data/raw/train_corpus.csv
    outs:
      - data/processed/cleaned.parquet

  train:
    cmd: python src/train.py
    deps:
      - src/train.py
      - data/processed/cleaned.parquet
    params:
      - train.learning_rate
      - train.batch_size
      - train.n_estimators
    outs:
      - models/classifier.joblib

  evaluate:
    cmd: python src/evaluate.py
    deps:
      - src/evaluate.py
      - models/classifier.joblib
      - data/processed/cleaned.parquet
    metrics:
      - metrics.json:
          cache: false
```

## Step 3 — Experiment Tracking with MLflow (`src/train.py`)

Instrument the training code to stream parameters, metrics, and saved models to MLflow:

```python
import joblib
import mlflow
import mlflow.sklearn
import pandas as pd
import yaml
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, f1_score

def run_training():
    # Load hyperparameter defaults from params.yaml
    with open("params.yaml", "r") as f:
        params = yaml.safe_load(f)["train"]

    # Read preprocessed dataset snapshot
    df = pd.read_parquet("data/processed/cleaned.parquet")
    X_train = df.drop(columns=["target"])
    y_train = df["target"]

    # Start MLflow Experiment Run
    mlflow.set_experiment("Sentiment_Classification_v2")

    with mlflow.start_run():
        # Log Hyperparameters
        mlflow.log_params(params)

        model = GradientBoostingClassifier(
            learning_rate=params["learning_rate"],
            n_estimators=params["n_estimators"],
            max_depth=params.get("max_depth", 5)
        )
        model.fit(X_train, y_train)

        # Log Evaluation Metrics
        preds = model.predict(X_train)
        acc = accuracy_score(y_train, preds)
        f1 = f1_score(y_train, preds, average="macro")

        mlflow.log_metric("accuracy", acc)
        mlflow.log_metric("f1_score", f1)

        # Log Model Artifact
        mlflow.sklearn.log_model(model, "model")
        joblib.dump(model, "models/classifier.joblib")
        print(f"Model trained successfully. Accuracy: {acc:.4f}, F1: {f1:.4f}")

if __name__ == "__main__":
    run_training()
```

## Step 4 — Reproducing Experiments

Run the automated pipeline; DVC skips execution if code and data dependencies remain unchanged:

```bash
# Rerun pipeline stages
dvc repro

# Launch MLflow tracking interface
mlflow ui --port 5000
```

Open `http://localhost:5000` to compare parameters, accuracy metrics, and feature importance graphs across historical runs.

## Takeaways

- **Data Versioning**: Every Git commit points to exact dataset hashes via `.dvc` files.
- **Cache Optimization**: `dvc repro` avoids redundant re-computations of unmodified preprocessing stages.
- **Model Traceability**: Track model lineage end-to-end from code commit to MLflow artifact ID.
