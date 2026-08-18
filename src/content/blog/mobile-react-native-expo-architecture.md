---
title: Production React Native Architecture: Offline-First Sync & Native Modules
date: 2026-07-20
description: Build scalable cross-platform mobile apps using React Native Expo, WatermelonDB SQLite storage, background task synchronization, and JSI native modules.
tags: [mobile, react-native, expo, mobile-dev, cross-platform]
---

## Building Resilient Mobile Applications

Mobile devices routinely lose cellular connectivity in subways, basements, or remote locations. A network failure should never freeze an app UI or corrupt user input data.

Building an **Offline-First** mobile app requires local-first SQLite persistence (**WatermelonDB**), background task queues, and seamless background sync protocols when network connections resume.

## Mobile Architecture Diagram

```
  React Native App UI
          |
  [ React Native Components ]
          |
   (Reads/Writes Instantly <1ms)
          v
  [ Local SQLite Database (WatermelonDB) ]
          |
  [ Offline Mutation Queue ]
          |
   (Background Sync Engine)
          |
  [ NetInfo Connection Listener ]
          |
     (Network Restored?)
    ┌─────┴─────┐
   YES          NO
    │           └── Wait in Queue
    v
  [ REST / GraphQL Backend API ]
```

## Step 1 — WatermelonDB Schema & Model Definition (`src/db/schema.ts`)

Define high-performance local SQLite database structures with indices:

```typescript
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'notes',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string' },
        { name: 'is_synced', type: 'boolean' },
        { name: 'updated_at', type: 'number' },
      ]
    }),
  ]
});
```

Define model methods (`src/db/Note.ts`):

```typescript
import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, action } from '@nozbe/watermelondb/decorators';

export default class Note extends Model {
  static table = 'notes';

  @field('title') title!: string;
  @field('content') content!: string;
  @field('is_synced') isSynced!: boolean;
  @readonly @date('updated_at') updatedAt!: Date;

  @action async markSynced() {
    await this.update(note => {
      note.isSynced = true;
    });
  }
}
```

## Step 2 — Offline Synchronization Engine (`src/services/sync.ts`)

Manage differential data sync between local SQLite and remote REST endpoints:

```typescript
import { synchronize } from '@nozbe/watermelondb/sync';
import { database } from '../db';
import NetInfo from '@react-native-community/netinfo';

export async function syncOfflineData() {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    console.log('Device is offline. Postponing database synchronization.');
    return;
  }

  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const response = await fetch(
        `https://api.myapp.com/sync?last_pulled_at=${lastPulledAt || 0}`
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      
      const { changes, timestamp } = await response.json();
      return { changes, timestamp };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`https://api.myapp.com/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changes, lastPulledAt }),
      });
      if (!response.ok) {
        throw new Error(await response.text());
      }
    },
  });
}
```

## Step 3 — Background Task Manager with Expo Tasks (`src/tasks/backgroundSync.ts`)

Schedule background syncing even when the app is minimized:

```typescript
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { syncOfflineData } from '../services/sync';

const BACKGROUND_SYNC_TASK = 'BACKGROUND_OFFLINE_SYNC';

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log('Executing background database synchronization task...');
    await syncOfflineData();
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background sync failed:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundSync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
    minimumInterval: 15 * 60, // Execute every 15 minutes
    stopOnTerminate: false,
    startOnBoot: true,
  });
}
```

## Key Architectural Principles

1. **Instant UI Responses**: All UI mutations write directly to local SQLite in under 1 millisecond.
2. **Deterministic Conflict Resolution**: Server state wins during timestamp collisions while preserving unsaved local draft entries.
3. **Optimized Battery Life**: Background tasks leverage `BackgroundFetch` to execute when devices are idle.
