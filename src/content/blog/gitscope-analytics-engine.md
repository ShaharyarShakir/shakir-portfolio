---
title: Building GitScope — High-Performance GitHub Analytics with ECharts & Drizzle ORM
date: 2026-08-10
description: How I built GitScope (GitDash) to query, cache, and visualize multi-repo GitHub commit streaks, code velocity metrics, and language breakdowns.
tags: [fullstack, github, sveltekit, analytics, postgresql]
---

## The Challenge

GitHub gives you a basic contribution heatmap on your profile, but when managing multiple client repositories, organization teams, or personal side projects, getting a unified high-level snapshot of velocity, pull request turnaround time, and issue resolution rate requires jumping across dozens of pages.

I built **GitScope (GitDash)** as a centralized developer analytics dashboard that syncs commits across any number of public or private repos, calculates streak statistics, and renders interactive Apache ECharts visualizations in real time.

## Database Schema & Cache Invalidation with Drizzle ORM

Hitting GitHub's REST API repeatedly will exhaust rate limits fast. GitScope uses PostgreSQL with Drizzle ORM to maintain an aggregated snapshot of commit activity, refreshing data in background sync queues.

Here is the Drizzle schema designed for high-frequency queries:

```ts
import { pgTable, text, timestamp, integer, date, index } from 'drizzle-orm/pg-core';

export const repositories = pgTable('repositories', {
  id: text('id').primaryKey(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  stars: integer('stars').default(0),
  forks: integer('forks').default(0),
  language: text('language'),
  lastSyncedAt: timestamp('last_synced_at').defaultNow(),
});

export const dailyCommits = pgTable('daily_commits', {
  id: text('id').primaryKey(), // repoId_YYYY-MM-DD
  repoId: text('repo_id').references(() => repositories.id, { onDelete: 'cascade' }),
  commitDate: date('commit_date').notNull(),
  count: integer('count').notNull().default(0),
  authorEmail: text('author_email').notNull(),
}, (table) => [
  index('date_author_idx').on(table.commitDate, table.authorEmail)
]);
```

## Calculating Continuous Commit Streaks Efficiently

Calculating current and longest commit streaks across thousands of raw daily commit logs can be an $O(N \log N)$ nightmare if done lazily. 

Here is the optimized streak algorithm running inside the SvelteKit load function:

```ts
type DailyStat = { date: string; count: number };

export function calculateStreaks(dailyStats: DailyStat[]) {
  if (dailyStats.length === 0) return { currentStreak: 0, longestStreak: 0 };

  // Sort dates descending
  const sorted = [...dailyStats].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // Check if active today or yesterday to preserve active streak
  let checkDate = sorted[0].date === today || sorted[0].date === yesterday;

  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].count > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (checkDate) currentStreak = tempStreak;
    } else {
      checkDate = false;
      tempStreak = 0;
    }
  }

  return { currentStreak, longestStreak };
}
```

## ECharts Visualizations in SvelteKit

Apache ECharts provides high-fps Canvas/SVG rendering. To make ECharts responsive within dark/light Svelte themes, I wrapped the chart instance in a Svelte action lifecycle directive:

```svelte
<script lang="ts">
  import * as echarts from 'echarts';

  let { dataOptions, isDark } = $props<{ dataOptions: any; isDark: boolean }>();
  let chartElement: HTMLDivElement;
  let chartInstance: echarts.ECharts | null = null;

  $effect(() => {
    if (!chartElement) return;

    if (!chartInstance) {
      chartInstance = echarts.init(chartElement, isDark ? 'dark' : undefined);
    } else {
      chartInstance.dispose();
      chartInstance = echarts.init(chartElement, isDark ? 'dark' : undefined);
    }

    chartInstance.setOption(dataOptions);

    const handleResize = () => chartInstance?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance?.dispose();
      chartInstance = null;
    };
  });
</script>

<div bind:this={chartElement} class="w-full h-72"></div>
```

## Takeaway

By decoupling API ingestion from frontend rendering using a cached PostgreSQL database, GitScope delivers instant page transitions while processing github analytics across dozens of repositories.
