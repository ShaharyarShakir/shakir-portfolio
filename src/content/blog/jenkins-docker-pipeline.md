---
title: Building a Production CI/CD Pipeline with Jenkins and Docker
date: 2025-11-10
description: A step-by-step guide to setting up a real Jenkins pipeline that builds, tests, and deploys Docker containers automatically.
tags: [devops, jenkins, docker, ci-cd]
---

## Why Jenkins Still Wins

Everyone's chasing GitHub Actions and CircleCI, but Jenkins gives you something they don't — full control over your infrastructure. No per-minute billing. No vendor lock-in. Your pipeline, your rules.

This is the exact setup I used in my VProfile project to ship a multi-tier Java app to AWS EKS.

## Prerequisites

- A Linux server (Ubuntu 22.04) with at least 2GB RAM
- Docker installed
- Jenkins installed and running on port 8080

## Step 1 — Install Required Jenkins Plugins

Go to **Manage Jenkins → Plugins** and install:

- Docker Pipeline
- Pipeline
- Git
- Blue Ocean (optional but great UI)

## Step 2 — Write the Jenkinsfile

Create a `Jenkinsfile` at the root of your repo:

```groovy
pipeline {
  agent any

  environment {
    IMAGE_NAME = 'myapp'
    DOCKER_HUB = credentials('dockerhub-creds')
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/youruser/yourrepo.git'
      }
    }

    stage('Build Image') {
      steps {
        sh 'docker build -t $IMAGE_NAME:$BUILD_NUMBER .'
      }
    }

    stage('Run Tests') {
      steps {
        sh 'docker run --rm $IMAGE_NAME:$BUILD_NUMBER npm test'
      }
    }

    stage('Push to DockerHub') {
      steps {
        sh '''
          echo $DOCKER_HUB_PSW | docker login -u $DOCKER_HUB_USR --password-stdin
          docker tag $IMAGE_NAME:$BUILD_NUMBER $DOCKER_HUB_USR/$IMAGE_NAME:latest
          docker push $DOCKER_HUB_USR/$IMAGE_NAME:latest
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh 'docker-compose -f docker-compose.prod.yml up -d'
      }
    }
  }

  post {
    failure {
      echo 'Pipeline failed — check logs above'
    }
    success {
      echo 'Deployed successfully'
    }
  }
}
```

## Step 3 — Add Docker Compose for Production

```yaml
version: "3.8"

services:
  app:
    image: youruser/myapp:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: unless-stopped
```

## Step 4 — Configure Webhooks

In your GitHub repo go to **Settings → Webhooks → Add webhook**:

- Payload URL: `http://your-jenkins-server:8080/github-webhook/`
- Content type: `application/json`
- Trigger: `Just the push event`

Now every push to main triggers the full pipeline automatically.

## Common Pitfalls

The biggest mistake I made early on was running Docker inside Jenkins without adding the jenkins user to the docker group:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

Without this you get a cryptic permission denied error that wastes an hour.

## Result

Every git push now automatically builds a Docker image, runs tests, pushes to DockerHub, and deploys — in under 3 minutes. That's a real pipeline, not a toy.
