---
title: Full-Stack Observability: Prometheus, Grafana, and Loki Microservice Monitoring
date: 2026-06-10
description: Set up complete metric collecting, distributed log aggregation, and real-time dashboard monitoring using Prometheus, Loki, and Grafana in Docker Compose.
tags: [devops, observability, prometheus, grafana, logging]
---

## Observability vs. Monitoring

Traditional monitoring asks: *"Is the server up?"* Observability asks: *"Why is endpoint latency spiking specifically for multi-tenant accounts in region us-west-2?"*

To gain true operational insight, you need three pillars: **Metrics** (Prometheus), **Logs** (Loki), and **Visualization** (Grafana).

## Telemetry Stack Architecture

```
                  +----------------------------------------------+
                  |               Microservices                  |
                  |                                              |
                  |  [ Service A ] ---- metrics ----> /metrics   |
                  |       |                                 ^    |
                  |     logs                                |    |
                  |       v                                 |    |
                  |  [ Promtail ]                      Prometheus|
                  +-------+---------------------------------|----+
                          |                                 |
                          v                                 v
                     [ Grafana Loki ]              [ Prometheus DB ]
                          \                                 /
                           \                               /
                            +------------+----------------+
                                         |
                                         v
                               [ Grafana Dashboards ]
```

## Step 1 — Prometheus Scraping Setup (`prometheus.yml`)

Configure Prometheus to collect metrics every 15 seconds from your backend endpoints:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'api-service'
    metrics_path: '/metrics'
    static_configs:
      - targets: ['api-service:8080']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
```

## Step 2 — Instrumenting Node.js / Express Application

Expose Prometheus metrics natively in Node.js using `prom-client`:

```typescript
import express from 'express';
import client from 'prom-client';

const app = express();
const collectDefaultMetrics = client.collectDefaultMetrics;

// Enable default metrics (CPU, Memory, Event Loop Lag)
collectDefaultMetrics({ prefix: 'node_app_' });

// Custom Histogram for HTTP latency monitoring
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5]
});

// Middleware to record request metrics
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route?.path || req.path, code: res.statusCode });
  });
  next();
});

// Metrics scrap endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(8080, () => console.log('Server running on port 8080'));
```

## Step 3 — Docker Compose Stack (`docker-compose.logging.yml`)

Deploy Prometheus, Grafana, Loki, and Promtail in a unified stack:

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.51.0
    container_name: prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  loki:
    image: grafana/loki:2.9.4
    container_name: loki
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  promtail:
    image: grafana/promtail:2.9.4
    container_name: promtail
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

  grafana:
    image: grafana/grafana:10.4.0
    container_name: grafana
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

## Step 4 — Useful PromQL & LogQL Queries

### 99th Percentile Request Latency (PromQL)

```promql
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### Filtering Error Logs in Loki (LogQL)

```logql
{job="varlogs"} |= "error" | json | status_code >= 500
```

## Key Metrics to Watch

- **p99 Latency**: Detect long-tail latency spikes before users notice sluggish response times.
- **Error Rate Ratio**: Alert on sudden jumps in HTTP 5xx responses.
- **Event Loop Lag**: Detect Node.js event loop blocks caused by CPU-bound sync tasks.
