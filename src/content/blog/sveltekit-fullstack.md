---
title: SvelteKit Full Stack — Form Actions, Load Functions, and PostgreSQL
date: 2024-06-05
description: SvelteKit's form actions make full stack development feel natural. Here's how to build a data-driven app with server load functions and direct DB access.
tags: [fullstack, sveltekit, svelte, postgresql]
---

## SvelteKit is the Most Underrated Full Stack Framework

No separate API layer. No useEffect for data fetching. No client-side state for server data. Just load functions that run on the server and form actions that handle mutations.

## Project Setup

```bash
npm create svelte@latest myapp
cd myapp
npm install
npm install drizzle-orm postgres drizzle-kit
```

## Database with Drizzle

```ts
// src/lib/server/db.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
```

```ts
// src/lib/server/schema.ts
import { pgTable, text, timestamp, uuid, boolean } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
```

## Load Function — Server-Side Data Fetching

```ts
// src/routes/todos/+page.server.ts
import { db } from "$lib/server/db";
import { todos } from "$lib/server/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
  const session = await locals.getSession();
  if (!session) throw redirect(303, "/login");

  const userTodos = await db
    .select()
    .from(todos)
    .where(eq(todos.userId, session.user.id))
    .orderBy(desc(todos.createdAt));

  return { todos: userTodos };
};
```

## Form Actions — Mutations Without an API

```ts
// src/routes/todos/+page.server.ts (continued)
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  create: async ({ request, locals }) => {
    const session = await locals.getSession();
    const data = await request.formData();
    const text = data.get("text")?.toString();

    if (!text || text.length < 1) {
      return fail(400, { error: "Todo text is required" });
    }

    await db.insert(todos).values({
      userId: session!.user.id,
      text,
    });
  },

  toggle: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    const completed = data.get("completed") === "true";

    await db
      .update(todos)
      .set({ completed: !completed })
      .where(eq(todos.id, id!));
  },

  delete: async ({ request }) => {
    const data = await request.formData();
    const id = data.get("id")?.toString();
    await db.delete(todos).where(eq(todos.id, id!));
  },
};
```

## The Page Component

```svelte
<!-- src/routes/todos/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<h1>My Todos</h1>

<!-- Create form -->
<form method="POST" action="?/create" use:enhance>
  <input name="text" placeholder="Add a todo..." required />
  <button type="submit">Add</button>
</form>

<!-- Todo list -->
{#each data.todos as todo}
  <div class="todo" class:completed={todo.completed}>
    <form method="POST" action="?/toggle" use:enhance>
      <input type="hidden" name="id" value={todo.id} />
      <input type="hidden" name="completed" value={todo.completed} />
      <button type="submit">{todo.text}</button>
    </form>

    <form method="POST" action="?/delete" use:enhance>
      <input type="hidden" name="id" value={todo.id} />
      <button type="submit">×</button>
    </form>
  </div>
{/each}
```

The `use:enhance` directive makes form submissions feel instant — no full page reload.

## Why This Pattern Beats React + API

With Next.js or a React SPA you write a form component, an API route, a fetch call, loading state, error state, and cache invalidation. In SvelteKit you write a form and an action. That's it. The framework handles the rest.
