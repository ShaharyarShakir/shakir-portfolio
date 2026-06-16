---
title: Building a Real MLOps Pipeline with DVC and MLflow
date: 2024-09-15
description: Stop running Jupyter notebooks manually. Build a reproducible ML pipeline with DVC for data versioning and MLflow for experiment tracking.
tags: [mlops, dvc, mlflow, python]
---

## The Problem with Notebook-Driven ML

You train a model. It works. Two weeks later you can't reproduce it because you don't remember which dataset version you used or what hyperparameters you tried.

DVC and MLflow solve this together. DVC versions your data and pipeline stages. MLflow tracks every experiment run.

## Project Structure

```
sentiment-analysis/
├── data/
│   ├── raw/
│   └── processed/
├── src/
│   ├── prepare.py
│   ├── train.py
│   └── evaluate.py
├── dvc.yaml
├── params.yaml
└── mlflow/
```

## Step 1 — Set Up DVC

```bash
pip install dvc dvc-s3
dvc init
git add .dvc .gitignore
git commit -m "init dvc"
```

Add remote storage (S3):

```bash
dvc remote add -d myremote s3://your-bucket/dvc-store
dvc remote modify myremote region us-east-1
```

Track your raw data:

```bash
dvc add data/raw/comments.csv
git add data/raw/comments.csv.dvc .gitignore
git commit -m "track raw data"
dvc push
```

## Step 2 — Define the Pipeline in dvc.yaml

```yaml
stages:
  prepare:
    cmd: python src/prepare.py
    deps:
      - src/prepare.py
      - data/raw/comments.csv
    outs:
      - data/processed/train.csv
      - data/processed/test.csv
    params:
      - prepare.test_size
      - prepare.random_state

  train:
    cmd: python src/train.py
    deps:
      - src/train.py
      - data/processed/train.csv
    outs:
      - models/model.pkl
    params:
      - train.n_estimators
      - train.max_depth
      - train.learning_rate

  evaluate:
    cmd: python src/evaluate.py
    deps:
      - src/evaluate.py
      - models/model.pkl
      - data/processed/test.csv
    metrics:
      - metrics/scores.json
```

## Step 3 — params.yaml

```yaml
prepare:
  test_size: 0.2
  random_state: 42

train:
  n_estimators: 200
  max_depth: 6
  learning_rate: 0.1
```

## Step 4 — Train with MLflow Tracking

```python
# src/train.py
import mlflow
import mlflow.sklearn
import lightgbm as lgb
import yaml
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer

def train():
    params = yaml.safe_load(open('params.yaml'))['train']
    train_df = pd.read_csv('data/processed/train.csv')

    X_train = train_df['text']
    y_train = train_df['label']

    with mlflow.start_run():
        mlflow.log_params(params)

        pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=10000)),
            ('clf', lgb.LGBMClassifier(**params))
        ])

        pipeline.fit(X_train, y_train)

        mlflow.sklearn.log_model(pipeline, 'model')
        mlflow.log_artifact('params.yaml')

        import joblib
        joblib.dump(pipeline, 'models/model.pkl')

if __name__ == '__main__':
    train()
```

## Step 5 — Run the Pipeline

```bash
dvc repro
```

DVC checks which stages are stale and only reruns what changed. Change a param and rerun — only the affected stages execute.

## Step 6 — View MLflow UI

```bash
mlflow ui
```

Open `http://localhost:5000` to compare runs, parameters, and metrics side by side.

## The Result

Every run is reproducible. Every dataset version is tracked. Every experiment is logged. This is what MLOps actually looks like in practice.
