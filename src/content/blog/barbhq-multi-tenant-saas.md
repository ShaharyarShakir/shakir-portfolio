---
title: Architecting BarbHQ SaaS — Multi-Tenant Routing & Real-Time Booking Queues
date: 2026-08-05
description: Lessons from building BarbHQ — a multi-tenant shop management OS with custom subdomains, appointment slot locking, and Expo mobile integration.
tags: [fullstack, saas, react, express, mongodb]
---

## The Barber Shop Problem

Traditional appointment scheduling software forces barber shop owners into bloated, rigid third-party platforms with high per-transaction fees. Shop owners need tenant isolation, customized booking subdomains (`shopname.barbhq.com`), automated staff commission calculators, and mobile check-in capabilities for staff on the floor.

I built **BarbHQ** as a modern multi-tenant SaaS platform that bridges web administration with mobile shop operations.

```
                  ┌────────────────────────┐
                  │ Custom Subdomain Router│
                  └───────────┬────────────┘
                              │
             ┌────────────────┴────────────────┐
             ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐
│ Shop A (tenant_id: 101) │       │ Shop B (tenant_id: 102) │
│ - Appointments          │       │ - Appointments          │
│ - Staff POS Checkout    │       │ - Staff POS Checkout    │
│ - Client Loyalty        │       │ - Client Loyalty        │
└─────────────────────────┘       └─────────────────────────┘
```

## Multi-Tenant Host Middleware in Express

To resolve tenants dynamically based on incoming HTTP request headers or subdomains without spinning up separate infrastructure instances, I implemented custom Express middleware:

```ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../db';
import { tenants } from '../db/schema';
import { eq } from 'drizzle-orm';

export interface TenantRequest extends Request {
  tenantId?: string;
  tenantSlug?: string;
}

export async function resolveTenant(
  req: TenantRequest,
  res: Response,
  next: NextFunction
) {
  const host = req.headers.host || '';
  // Extract subdomain e.g. "barberkings.barbhq.com" -> "barberkings"
  const parts = host.split('.');
  
  let tenantSlug = 'default';
  if (parts.length > 2 && parts[0] !== 'www' && parts[0] !== 'app') {
    tenantSlug = parts[0];
  } else if (req.headers['x-tenant-slug']) {
    tenantSlug = req.headers['x-tenant-slug'] as string;
  }

  const [tenant] = await db
    .select()
    .from(tenants)
    .where(eq(tenants.slug, tenantSlug))
    .limit(1);

  if (!tenant && tenantSlug !== 'default') {
    return res.status(404).json({ error: { message: 'Shop tenant not found' } });
  }

  req.tenantId = tenant ? tenant.id : undefined;
  req.tenantSlug = tenantSlug;
  next();
}
```

## Concurrency Control in Appointment Slot Locking

When two clients try to book the exact same 30-minute haircut slot simultaneously, race conditions occur. In BarbHQ, slot reservations use optimistic locking with time-to-live (TTL) expiration locks in Redis:

```ts
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL!);

export async function lockBookingSlot(
  shopId: string,
  barberId: string,
  timeSlotIso: string,
  clientId: string
): Promise<boolean> {
  const lockKey = `lock:${shopId}:${barberId}:${timeSlotIso}`;
  
  // Set lock if Not Exists (NX) with 300 second (5 min) TTL
  const acquired = await redis.set(lockKey, clientId, 'EX', 300, 'NX');
  return acquired === 'OK';
}
```

## Key Architecture Takeaways

- **Strict Isolation**: Always scope database queries by `tenantId` at the repository layer.
- **Cross-Platform Sync**: Keeping schema contracts aligned between React web dashboard and React Native Expo mobile app prevents payload mismatches.
