---
title: Real-Time Feature Engineering: Implementing a Feast Feature Store with Redis
date: 2026-06-26
description: Eliminate training-serving skew by deploying a Feast feature store backed by Redis for sub-millisecond online feature serving and PostgreSQL for offline batch training.
tags: [mlops, feature-store, feast, redis, streaming]
---

## What is Training-Serving Skew?

Training-serving skew occurs when the code or data pipelines used to compute features during offline training differ from the pipelines computing features in production real-time APIs.

A **Feature Store** acts as the single source of truth for machine learning features, providing low-latency feature serving via Redis for online inference while persisting historical feature point-in-time joins for offline training.

## Feast Architecture Overview

```
                  +----------------------------------------------------+
                  |               Feast Feature Store                  |
                  |                                                    |
  Raw Batch Data -+--> [ PostgreSQL / BigQuery ]                       |
  (Historical)    |             |                                      |
                  |     feast materialize                              |
                  |             |                                      |
  Real-time Stream+--> [ Redis Online Store ]                          |
                  |             |                                      |
                  |   get_online_features()                            |
                  +-------------+--------------------------------------+
                                |
                                v
                     [ Low-Latency ML API ]
```

## Step 1 — Defining Features in Python (`feature_store.yaml`)

Initialize your Feast project configuration with PostgreSQL (Offline) and Redis (Online):

```yaml
project: fraud_detection_store
registry: data/registry.pb
provider: local
online_store:
  type: redis
  connection_string: "localhost:6379,password=secret"
offline_store:
  type: postgres
  host: localhost
  port: 5432
  database: ml_features
  user: feast_user
  password: feast_password
```

## Step 2 — Defining Entities & Feature Views (`features.py`)

Define user behavioral features with expiration windows:

```python
from datetime import timedelta
from feast import (
    Entity,
    Field,
    FeatureView,
    Field,
    FileSource,
    KafkaSource,
    PushSource,
)
from feast.types import Array, Float32, Int64, String

# Define entity key
user_entity = Entity(
    name="user_id",
    value_type=Entity.ValueType.INT64,
    description="Unique identification key for user account"
)

# Offline Batch Data Source definition
user_stats_source = FileSource(
    name="user_stats_source",
    path="data/user_transaction_stats.parquet",
    timestamp_field="event_timestamp",
    created_timestamp_column="created_timestamp"
)

# Feature View registration
user_transaction_feature_view = FeatureView(
    name="user_transaction_features",
    entities=[user_entity],
    ttl=timedelta(days=30),
    schema=[
        Field(name="avg_transaction_amount_30d", dtype=Float32),
        Field(name="failed_login_attempts_24h", dtype=Int64),
        Field(name="is_foreign_ip", dtype=Int64),
    ],
    online=True,
    source=user_stats_source,
)
```

## Step 3 — Materializing Features into Redis

Sync feature states from batch data into the Redis memory cache:

```bash
# Apply Feast feature definitions to the registry
feast apply

# Materialize historical features to Redis for real-time serving
feast materialize 2026-05-01T00:00:00 2026-06-26T00:00:00
```

## Step 4 — High-Throughput Online Feature Retrieval in FastAPI

Fetch low-latency online features directly inside real-time inference routes:

```python
from fastapi import FastAPI, HTTPException
from feast import FeatureStore
from pydantic import BaseModel
import joblib

app = FastAPI(title="Fraud Detection Inference Service")
store = FeatureStore(repo_path=".")
model = joblib.load("models/fraud_detector.joblib")

class PredictRequest(BaseModel):
    user_id: int
    current_amount: float

@app.post("/predict")
async def predict(request: PredictRequest):
    # Fetch real-time online features from Redis (Latency < 2ms)
    response = store.get_online_features(
        features=[
            "user_transaction_features:avg_transaction_amount_30d",
            "user_transaction_features:failed_login_attempts_24h",
            "user_transaction_features:is_foreign_ip",
        ],
        entity_rows=[{"user_id": request.user_id}]
    ).to_dict()

    if not response["avg_transaction_amount_30d"][0]:
        raise HTTPException(status_code=404, detail="User features not found")

    avg_amt = response["avg_transaction_amount_30d"][0]
    failed_logins = response["failed_login_attempts_24h"][0]
    is_foreign = response["is_foreign_ip"][0]

    # Combine online features with payload data
    feature_vector = [[request.current_amount, avg_amt, failed_logins, is_foreign]]
    probability = float(model.predict_proba(feature_vector)[0][1])

    return {
        "user_id": request.user_id,
        "fraud_probability": round(probability, 4),
        "is_suspicious": probability > 0.75
    }
```

## Key Architectural Advantages

- **Zero Skew**: The same transformation definition produces training datasets and populates online Redis keys.
- **Microsecond Latency**: Redis serving guarantees feature vector assembly in under 2 milliseconds.
- **Auditability**: Point-in-time joins avoid future data leakage during offline model backtesting.
