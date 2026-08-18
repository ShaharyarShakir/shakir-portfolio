---
title: Building Real-Time Subscriptions with GraphQL, Hasura, and PostgreSQL
date: 2026-07-06
description: Construct a low-latency real-time API layer using Hasura GraphQL Engine, PostgreSQL event triggers, and auto-generated GraphQL subscriptions over WebSockets.
tags: [fullstack, graphql, hasura, postgres, realtime]
---

## Eliminating Manual REST Endpoint Boilerplate

Writing custom REST controllers, ORM queries, and authorization filters for dozens of database entities consumes developer velocity.

**Hasura GraphQL Engine** connects directly to PostgreSQL database schemas, instantly auto-generating instant, high-performance **GraphQL Queries**, **Mutations**, and real-time **Subscriptions** over WebSockets with granular Role-Based Access Control (RBAC).

## Architecture Blueprint

```
  React / Svelte UI Client
            |
  [ GraphQL Subscription (WebSocket `wss://`) ]
            |
            v
  [ Hasura GraphQL Engine ]
            |
   (JIT Query Compilation to SQL)
            |
            v
  [ PostgreSQL Database ] ── LISTEN / NOTIFY ──> [ Event Triggers ]
```

## Step 1 — Hasura Permissions & Metadata Setup (`metadata/tables.yaml`)

Define row-level security permissions declaratively:

```yaml
- table:
    schema: public
    name: user_messages
  select_permissions:
    - role: user
      permission:
        columns:
          - id
          - sender_id
          - recipient_id
          - content
          - created_at
        filter:
          _or:
            - sender_id:
                _eq: X-Hasura-User-Id
            - recipient_id:
                _eq: X-Hasura-User-Id
```

## Step 2 — Real-Time GraphQL Subscription (`chatSubscription.ts`)

Subscribe to live chat updates directly from frontend components:

```typescript
import { createClient } from 'graphql-ws';

const client = createClient({
  url: 'wss://api.myapp.com/v1/graphql',
  connectionParams: {
    headers: {
      'x-hasura-admin-secret': 'my_admin_secret_key',
    },
  },
});

const LIVE_CHAT_SUBSCRIPTION = `
  subscription OnNewMessage($recipientId: String!) {
    user_messages(
      where: { recipient_id: { _eq: $recipientId } }
      order_by: { created_at: desc }
      limit: 10
    ) {
      id
      sender_id
      content
      created_at
    }
  }
`;

export function subscribeToMessages(recipientId: String, onMessage: (data: any) => void) {
  return client.subscribe(
    {
      query: LIVE_CHAT_SUBSCRIPTION,
      variables: { recipientId },
    },
    {
      next: (data) => onMessage(data.data),
      error: (err) => console.error('Subscription error:', err),
      complete: () => console.log('Subscription completed'),
    }
  );
}
```

## Step 3 — Hasura Event Trigger Actions (`serverlessWebhook.ts`)

Trigger asynchronous serverless webhooks whenever database rows mutate:

```typescript
import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.post('/events/message-created', async (request, reply) => {
    const payload = request.body as any;
    const newMessage = payload.event.data.new;

    console.log(`Processing async event for new message ID: ${newMessage.id}`);

    // Trigger secondary tasks (Push Notifications, Search Indexing)
    await fetch('https://api.myapp.com/v1/notifications/send', {
      method: 'POST',
      body: JSON.stringify({
        userId: newMessage.recipient_id,
        body: `New message from ${newMessage.sender_id}`,
      })
    });

    return reply.status(200).send({ status: 'OK' });
  });
}
```

## Core Advantages

1. **JIT Compilation to Single SQL Queries**: Hasura compiles GraphQL documents directly into single optimized PostgreSQL queries, avoiding N+1 database connection bugs.
2. **Instant WebSockets**: Real-time subscriptions require zero custom socket handler code.
