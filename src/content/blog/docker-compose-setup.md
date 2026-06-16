---
title: The Perfect Docker Compose Dev Setup for Full Stack Apps
date: 2024-03-14
description: Stop installing Postgres, Redis, and other services locally. Use Docker Compose to create a consistent, one-command dev environment for your whole team.
tags: [devops, docker, fullstack, developer-experience]
---

## Why Your Local Dev Setup is Broken

You install Postgres locally. Your teammate installs a different version. Your CI runs yet another. "Works on my machine" is real and Docker Compose solves it.

Here's the exact setup I use for full stack projects — Node.js backend, React frontend, Postgres, Redis, and an email testing server.

## The docker-compose.yml

```yaml
version: "3.9"

services:
  # PostgreSQL
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev -d myapp_dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --save 20 1 --loglevel warning

  # Mailpit — local email testing
  mail:
    image: axllent/mailpit
    ports:
      - "8025:8025" # web UI
      - "1025:1025" # SMTP

  # Backend — Node.js
  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "4000:4000"
    volumes:
      - ./api:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://dev:devpassword@db:5432/myapp_dev
      REDIS_URL: redis://redis:6379
      SMTP_HOST: mail
      SMTP_PORT: 1025
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_started
    command: npm run dev

  # Frontend — React/Vite
  web:
    build:
      context: ./web
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./web:/app
      - /app/node_modules
    environment:
      VITE_API_URL: http://localhost:4000
    command: npm run dev -- --host

volumes:
  postgres_data:
  redis_data:
```

## Dockerfile.dev for Node.js

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4000
CMD ["npm", "run", "dev"]
```

The `volumes: /app/node_modules` trick is important — it prevents the container's node_modules from being overwritten by your host's node_modules bind mount.

## One-Command Start

```bash
docker compose up
```

All services start in the right order (db healthcheck ensures Postgres is ready before the API connects), with hot reload working for both frontend and backend.

## Environment Variables

Create a `.env` file at the root:

```bash
POSTGRES_PASSWORD=devpassword
JWT_SECRET=dev-secret-change-in-production
```

Reference in compose:

```yaml
environment:
  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
```

## Useful Commands

```bash
# start all services
docker compose up

# start in background
docker compose up -d

# view logs
docker compose logs -f api

# run db migrations
docker compose exec api npm run migrate

# open postgres shell
docker compose exec db psql -U dev myapp_dev

# stop everything
docker compose down

# stop and wipe volumes (fresh start)
docker compose down -v
```

## Production Differences

The dev compose is for local only. For production, use separate configs — no bind mounts, no dev servers, proper secrets management. But for development, this setup means any new team member can be running the full stack in under 5 minutes.
