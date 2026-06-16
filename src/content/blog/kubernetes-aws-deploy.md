---
title: Deploying to AWS EKS — From Zero to Production Kubernetes
date: 2024-10-22
description: How to set up an EKS cluster, write Kubernetes manifests, and deploy a containerized app with zero downtime rolling updates.
tags: [devops, kubernetes, aws, eks]
---

## Kubernetes on AWS Without the Pain

EKS is AWS's managed Kubernetes service. You don't manage the control plane — AWS does. You just worry about your workloads.

This is how I deployed the VProfile app to EKS after getting it working locally with Docker Compose.

## Step 1 — Create the EKS Cluster

Install `eksctl` first:

```bash
curl --silent --location \
  "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" \
  | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```

Create the cluster:

```bash
eksctl create cluster \
  --name vprofile-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 4 \
  --managed
```

This takes about 15 minutes. Grab a coffee.

## Step 2 — Write the Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vprofile-app
  labels:
    app: vprofile
spec:
  replicas: 2
  selector:
    matchLabels:
      app: vprofile
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: vprofile
    spec:
      containers:
        - name: app
          image: youruser/vprofile:latest
          ports:
            - containerPort: 8080
          env:
            - name: DB_HOST
              valueFrom:
                secretKeyRef:
                  name: vprofile-secrets
                  key: db-host
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 10
```

## Step 3 — Expose with a LoadBalancer Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: vprofile-service
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
spec:
  type: LoadBalancer
  selector:
    app: vprofile
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
```

## Step 4 — Store Secrets Properly

Never hardcode credentials. Use Kubernetes Secrets:

```bash
kubectl create secret generic vprofile-secrets \
  --from-literal=db-host=your-rds-endpoint \
  --from-literal=db-password=yourpassword
```

## Step 5 — Deploy and Verify

```bash
kubectl apply -f k8s/
kubectl get pods -w
kubectl get svc vprofile-service
```

The `EXTERNAL-IP` from the service output is your public URL.

## Rolling Updates

When you push a new image, update the deployment:

```bash
kubectl set image deployment/vprofile-app app=youruser/vprofile:v2
kubectl rollout status deployment/vprofile-app
```

Zero downtime. The old pods stay up until new ones are healthy.

## Cleanup

EKS costs money. Delete when done:

```bash
eksctl delete cluster --name vprofile-cluster
```
