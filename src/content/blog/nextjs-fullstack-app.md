---
title: Building a Full Stack App with Next.js 14 App Router and PostgreSQL
date: 2024-08-20
description: Server components, server actions, and direct database queries — the modern Next.js full stack approach without a separate API layer.
tags: [fullstack, nextjs, postgresql, react]
---

## Next.js 14 Changed Everything

The App Router with React Server Components means you can query your database directly in a component. No API route needed. No useEffect. No loading state spaghetti.

Here's how to build a real app with it.

## Project Setup

```bash
npx create-next-app@latest myapp --typescript --tailwind --app
cd myapp
npm install drizzle-orm pg drizzle-kit
npm install -D @types/pg
```

## Database Schema with Drizzle

```ts
// src/db/schema.ts
import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id, {
    onDelete: "cascade",
  }),
  title: text("title").notNull(),
  completed: integer("completed").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## DB Connection

```ts
// src/db/index.ts
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);
```

## Server Component — Fetch Directly

```tsx
// src/app/projects/page.tsx
import { db } from "@/db";
import { projects } from "@/db/schema";
import { desc } from "drizzle-orm";

export default async function ProjectsPage() {
  // this runs on the server — no API call needed
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return (
    <div>
      <h1>Projects</h1>
      {allProjects.map((project) => (
        <div key={project.id}>
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## Server Action — Mutate Without an API

```ts
// src/app/projects/actions.ts
"use server";

import { db } from "@/db";
import { projects } from "@/db/schema";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title) throw new Error("Title is required");

  await db.insert(projects).values({ title, description });
  revalidatePath("/projects");
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/projects");
}
```

## Form That Uses the Server Action

```tsx
// src/app/projects/new/page.tsx
import { createProject } from "../actions";

export default function NewProjectPage() {
  return (
    <form action={createProject}>
      <input name="title" placeholder="Project title" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create Project</button>
    </form>
  );
}
```

No useState. No fetch. No API route. The form POSTs directly to the server action, the database gets updated, and Next.js revalidates the cache.

## The Mental Model Shift

Stop thinking in client/server. Think in components that happen to run on the server or the client. Server components are the default — they have direct database access and zero JS bundle cost. Add `'use client'` only when you need interactivity.
