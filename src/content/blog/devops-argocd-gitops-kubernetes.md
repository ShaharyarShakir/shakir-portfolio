---
title: Declarative GitOps Continuous Delivery with ArgoCD & Kubernetes
date: 2026-06-04
description: Implement true GitOps continuous delivery by deploying ArgoCD to manage multi-cluster Kubernetes applications declaratively from Git repositories.
tags: [devops, gitops, argocd, kubernetes, continuous-delivery]
---

## What is GitOps?

Traditional CI/CD pipelines use imperative scripts (`kubectl apply`) pushing changes to clusters. If manual edits occur on the cluster, **configuration drift** happens silently.

**GitOps** flips this paradigm: Git is the single source of truth. **ArgoCD** runs inside the Kubernetes cluster as a controller, continuously pulling desired states from Git repositories and automatically reconciling any cluster drift.

## GitOps Architecture Blueprint

```
                      +------------------------------------------+
                      |             Git Repository               |
                      |                                          |
                      |  [ Declarative K8s Manifests / Helm ]   |
                      +--------------------+---------------------+
                                           |
                                      Git Commit Push
                                           v
  +----------------------------------------------------------------------+
  |                     Kubernetes Cluster                               |
  |                                                                      |
  |  [ ArgoCD Application Controller ] <--- Pull Sync (Every 3m)         |
  |                 |                                                    |
  |       Detect Configuration Drift?                                    |
  |                 │                                                    |
  |          Auto-Reconcile                                              |
  |                 v                                                    |
  |  [ Production App Deployments & Services ]                           |
  +----------------------------------------------------------------------+
```

## Step 1 — Installing ArgoCD on Kubernetes

Deploy ArgoCD into its dedicated namespace:

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Expose ArgoCD Server UI locally
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Retrieve initial admin credentials:

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

## Step 2 — Declarative Application Definition (`application.yaml`)

Define an ArgoCD `Application` custom resource targeting a Helm chart:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: production-microservices
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: default
  source:
    repoURL: 'https://github.com/company/k8s-infrastructure.git'
    targetRevision: HEAD
    path: charts/production-app
    helm:
      valueFiles:
        - values-production.yaml
  destination:
    server: 'https://kubernetes.default.svc'
    namespace: production
  syncPolicy:
    automated:
      prune: true      # Automatically delete resources removed from Git
      selfHeal: true   # Automatically revert manual kubectl edits
    syncOptions:
      - CreateNamespace=true
```

Apply the ArgoCD application definition:

```bash
kubectl apply -f application.yaml
```

## Step 3 — CLI Verification & Sync Monitoring

Monitor application synchronization state using the ArgoCD CLI:

```bash
# Login via CLI
argocd login localhost:8080 --username admin --password <password> --insecure

# List application sync status
argocd app get production-microservices

# Trigger manual synchronization
argocd app sync production-microservices
```

## GitOps Benefits

1. **Zero Cluster Credentials in CI**: GitHub Actions runners no longer require production `kubeconfig` access keys.
2. **Self-Healing Infrastructure**: If an engineer manually deletes a pod or modifies a service, ArgoCD restores the Git-defined state in seconds.
3. **Instant Audit & Rollback**: Reverting a deployment is as simple as running `git revert HEAD`.
