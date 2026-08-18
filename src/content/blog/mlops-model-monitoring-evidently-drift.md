---
title: Detecting Concept Drift & Data Corruption in Production Models with Evidently AI
date: 2026-06-30
description: Build automated real-time model monitoring pipelines to catch data drift, prediction degradation, and numerical anomalies using Evidently AI and Prometheus alerts.
tags: [mlops, model-monitoring, data-drift, python]
---

## Why Models Fail Silently in Production

Unlike traditional backend software that throws explicit HTTP 500 stack traces when breaking, Machine Learning models fail silently. User behaviors shift, upstream APIs mutate field structures, and sensor hardware degrades over time.

This phenomenon is called **Data Drift** (changes in input feature distributions) and **Concept Drift** (changes in the relationship between input features and target labels).

## Drift Detection Architecture

```
  Production Traffic
          |
          v
  [ Production ML Service ]
          |
    (Inference Logs)
          v
  [ Vector Store / PostgreSQL ]
          |
          v
  [ Evidently AI Analyzer Service ]
   ├── Compare Reference vs. Current Batch
   ├── Compute Kolmogorov-Smirnov & Wasserstein Drift Tests
   └── Expose Metrics via Prometheus Exporter
          |
          v
  [ Slack / PagerDuty Alert System ]
```

## Step 1 — Building the Batch Drift Engine with Evidently AI

Create a monitoring module that compares historical reference baseline datasets against modern inference logs:

```python
import pandas as pd
from evidently.report import Report
from evidently.metric_preset import DataDriftPreset, TargetDriftPreset
from evidently.metrics import DatasetDriftMetric

def evaluate_data_drift(reference_path: str, current_path: str, output_html: str):
    # Load reference training baseline and current week logs
    reference_data = pd.read_csv(reference_path)
    current_data = pd.read_csv(current_path)

    # Initialize Evidently Monitoring Report
    drift_report = Report(metrics=[
        DatasetDriftMetric(),
        DataDriftPreset(),
        TargetDriftPreset()
    ])

    # Run statistical tests (Kolmogorov-Smirnov, Wasserstein, Chi-Square)
    drift_report.run(reference_data=reference_data, current_data=current_data)
    
    # Export interactive HTML visual dashboard
    drift_report.save_html(output_html)
    
    # Extract numerical summary for automated alerting
    result = drift_report.as_dict()
    dataset_drift = result["metrics"][0]["result"]["dataset_drift"]
    drifted_features_count = result["metrics"][0]["result"]["number_of_drifted_columns"]
    
    print(f"Dataset Drift Detected: {dataset_drift}")
    print(f"Drifted Feature Count: {drifted_features_count}")
    
    return dataset_drift, drifted_features_count

if __name__ == "__main__":
    evaluate_data_drift("data/reference_baseline.csv", "data/production_logs_june.csv", "drift_report.html")
```

## Step 2 — Real-Time Streaming Drift Exporter with Prometheus

Export drift metrics to Prometheus for automated Ops alert routing:

```python
import time
import pandas as pd
from evidently.collector.client import CollectorClient
from prometheus_client import start_http_server, Gauge

# Define Prometheus Gauges
DATA_DRIFT_SCORE = Gauge("model_data_drift_score", "P-value score of dataset drift")
DRIFTED_FEATURES = Gauge("model_drifted_features_total", "Total count of drifted input features")

def monitor_live_stream():
    reference_df = pd.read_csv("data/reference_baseline.csv")
    
    start_http_server(8085)
    print("Prometheus Drift Exporter running on port 8085...")

    while True:
        # Pull recent production batch from logs
        current_df = pd.read_csv("data/live_inference_buffer.csv")
        
        if len(current_df) > 100:
            # Perform quick statistical verification
            from scipy.stats import ks_2samp
            drift_count = 0
            
            for col in ["user_age", "income", "credit_score"]:
                stat, p_value = ks_2samp(reference_df[col], current_df[col])
                if p_value < 0.05: # Statistical significance threshold
                    drift_count += 1
            
            DATA_DRIFT_SCORE.set(drift_count / 3.0)
            DRIFTED_FEATURES.set(drift_count)
            
        time.sleep(60) # Evaluate every minute

if __name__ == "__main__":
    monitor_live_stream()
```

## Step 3 — Prometheus Alerting Rules (`drift-alerts.yml`)

Configure Alertmanager rules to ping Slack when drift exceeds thresholds:

```yaml
groups:
  - name: ml_model_monitoring
    rules:
      - alert: HighDataDriftDetected
        expr: model_data_drift_score > 0.5
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "Machine Learning Model Data Drift Exceeded Target"
          description: "Over 50% of input features show statistically significant drift. Model retraining required."
```

## Recommended Drift Remediation Steps

1. **Trigger Automated Retraining Pipelines**: Trigger your DVC/MLflow training pipeline on drift alerts.
2. **Fallback to Heuristic Rules**: Route requests to safe baseline fallback logic if prediction variance spikes abnormally.
3. **Audit Input Data Quality**: Check upstream database migrations for missing values or unexpected null conversions.
