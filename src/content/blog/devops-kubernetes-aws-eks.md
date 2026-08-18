---
title: Deploying Production-Grade Kubernetes on AWS EKS with Terraform & Helm
date: 2026-06-02
description: A complete production guide to provisioning AWS EKS clusters using Terraform modules, configuring Helm charts, and enforcing IAM Roles for Service Accounts (IRSA).
tags: [devops, kubernetes, aws, terraform, helm]
---

## Introduction to Cloud-Native EKS Infrastructure

Deploying Kubernetes in production requires more than running `eksctl create cluster`. A enterprise-grade setup demands Infrastructure as Code (IaC) with **Terraform**, declarative package management via **Helm**, strict security boundaries using **IRSA (IAM Roles for Service Accounts)**, and automated ingress controller provisioning.

In this guide, we walk through building a resilient AWS EKS environment with node autoscaling, ALB ingress integration, and secure AWS service access.

## Architecture Overview

```
                        +---------------------------------------+
                        |           AWS VPC (10.0.0.0/16)       |
                        |                                       |
  User Traffic -------->|  [ AWS ALB (Application Load Balancer) ]
                        |                   |                   |
                        |     +-------------+-------------+     |
                        |     |                           |     |
                        |  [ Private Subnet A ]   [ Private Subnet B ]
                        |  Node Group (t3.medium) Node Group (t3.medium)
                        |    |                       |          |
                        |  [ Pod: App Container ]  [ Pod: App Container ]
                        |            \               /          |
                        |         [ IAM IRSA Security Role ]    |
                        |                    |                  |
                        +--------------------+------------------+
                                             |
                                   [ AWS S3 / DynamoDB ]
```

## Step 1 — Provisioning EKS Cluster with Terraform

We use official Terraform modules for VPC and EKS. Save this in `main.tf`:

```hcl
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "production-eks-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "production-cluster"
  cluster_version = "1.30"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  eks_managed_node_groups = {
    primary = {
      min_size     = 2
      max_size     = 5
      desired_size = 2

      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
    }
  }
}
```

Run Terraform commands to apply infrastructure:

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

## Step 2 — Configuring kubectl Context

Retrieve kubeconfig credentials directly from AWS CLI:

```bash
aws eks update-kubeconfig --region us-east-1 --name production-cluster
kubectl get nodes -o wide
```

## Step 3 — Configuring IRSA for Fine-Grained IAM Access

IRSA maps an IAM Role to a Kubernetes Service Account token, allowing pods to communicate securely with S3 without hardcoding access keys.

```hcl
module "s3_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.0"

  role_name = "eks-s3-access-role"

  attach_s3_policy = true
  s3_policy_permissions = ["s3:GetObject", "s3:PutObject"]
  s3_bucket_arns         = ["arn:aws:s3:::my-app-data-bucket/*"]

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["default:app-service-account"]
    }
  }
}
```

Apply the IAM role and bind it to your Kubernetes deployment manifest:

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
  namespace: default
  annotations:
    eks.amazonaws.com/role-arn: arn:aws:iam::123456789012:role/eks-s3-access-role
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cloud-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cloud-app
  template:
    metadata:
      labels:
        app: cloud-app
    spec:
      serviceAccountName: app-service-account
      containers:
        - name: app
          image: nginx:alpine
          ports:
            - containerPort: 80
```

## Step 4 — Deploying AWS Load Balancer Controller with Helm

Install the AWS Load Balancer Controller to automatically manage ALB/NLB resources:

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=production-cluster \
  --set serviceAccount.create=true \
  --set serviceAccount.name=aws-load-balancer-controller
```

Verify deployment status:

```bash
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## Summary & Best Practices

1. **Never store static AWS keys** inside container environments; leverage IRSA tokens.
2. **Utilize private subnets** for node groups to isolate compute resources.
3. **Automate ingress provisioning** via Helm and AWS Load Balancer Controller.
