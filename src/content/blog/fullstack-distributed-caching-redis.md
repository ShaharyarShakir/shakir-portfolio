---
title: Scaling High-Throughput APIs with Redis Caching & Database Connection Pooling
date: 2026-07-12
description: Architecture techniques for handling 10,000+ requests per second using Redis distributed caching layer, cache stampede protection, and PostgreSQL connection pooling.
tags: [fullstack, redis, performance, api, nodejs]
---

## The Database Bottleneck at Scale

When application traffic spikes, primary SQL relational databases hit connection and CPU limits. Executing expensive multi-table JOIN operations on every incoming HTTP request degrades system response times from 30ms to 4000ms+.

To maintain ultra-low latency, high-throughput systems deploy an in-memory **Redis Caching Layer** combined with **PgBouncer Connection Pooling**.

## High-Throughput Caching Architecture

```
  Incoming API Traffic (10,000 req/sec)
                  |
                  v
       [ Node.js API Cluster ]
                  |
        1. Query Redis Cache
        ┌─────────┴─────────┐
    Cache HIT           Cache MISS
  (0.8ms response)          │
        │             2. Acquire Pooled Conn
        │                   │
        │                   v
        │         [ PgBouncer Connection Pool ]
        │                   │
        │             3. Query Postgres DB
        │                   │
        │             4. Populate Redis Cache (TTL)
        └───────────────────┘
```

## Step 1 — Cache-Aside Pattern with Mutex (Stampede Prevention)

Implement the Cache-Aside pattern enhanced with locks to avoid **Cache Stampedes** (where 1,000 simultaneous cache misses overload the database concurrently):

```typescript
import { createClient } from 'redis';
import { Pool } from 'pg';

const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
redis.connect();

const pgPool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  user: 'app_user',
  password: 'db_password',
  database: 'production_db',
  max: 20, // Connection pool limit
  idleTimeoutMillis: 30000,
});

export async function getCachedData<T>(
  cacheKey: string,
  ttlSeconds: number,
  dbQueryFn: () => Promise<T>
): Promise<T> {
  // 1. Check Redis cache first
  const cachedVal = await redis.get(cacheKey);
  if (cachedVal) {
    return JSON.parse(cachedVal) as T;
  }

  // 2. Acquire lock key to prevent cache stampede
  const lockKey = `lock:${cacheKey}`;
  const acquiredLock = await redis.set(lockKey, 'locked', {
    NX: true,
    EX: 5 // Lock expires in 5s
  });

  if (!acquiredLock) {
    // Another worker is populating the cache; sleep and retry
    await new Promise((res) => setTimeout(res, 50));
    return getCachedData(cacheKey, ttlSeconds, dbQueryFn);
  }

  try {
    // 3. Execute expensive DB query safely
    const dbResult = await dbQueryFn();

    // 4. Save result into Redis with TTL
    await redis.set(cacheKey, JSON.stringify(dbResult), { EX: ttlSeconds });
    return dbResult;
  } finally {
    await redis.del(lockKey);
  }
}
```

## Step 2 — High-Performance Fastify API Route

Build an optimized HTTP route utilizing the caching engine:

```typescript
import Fastify from 'fastify';
import { getCachedData } from './cacheEngine';
import { pgPool } from './db';

const app = Fastify({ logger: true });

app.get('/api/v1/products/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  const cacheKey = `product:${id}`;

  try {
    const product = await getCachedData(cacheKey, 300, async () => {
      const { rows } = await pgPool.query(
        'SELECT id, name, price, stock, specs FROM products WHERE id = $1',
        [id]
      );
      return rows[0];
    });

    if (!product) {
      return reply.status(404).send({ error: 'Product not found' });
    }

    return reply.header('X-Cache-Status', 'HIT').send(product);
  } catch (err) {
    app.log.error(err);
    return reply.status(500).send({ error: 'Internal Server Error' });
  }
});

app.listen({ port: 3000, host: '0.0.0.0' }, () => {
  console.log('Fastify API cluster listening on port 3000');
});
```

## Step 3 — PgBouncer Connection Pooling Configuration (`pgbouncer.ini`)

Manage thousands of transient API client queries using PgBouncer transaction pooling:

```ini
[databases]
production_db = host=127.0.0.1 port=5432 dbname=production_db

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

# Transaction pooling maps client queries to a small pool of persistent DB connections
pool_mode = transaction
max_client_conn = 5000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
```

## Benchmarks & Performance Impact

- **Database CPU Utilization**: Drops from 94% down to 12% under 10,000 req/sec loads.
- **p99 API Response Latency**: Reduced from 420ms down to **1.2ms** for cache hits.
- **Connection Overhead**: PgBouncer multiplexes 5,000 API clients into 25 persistent Postgres sockets.
