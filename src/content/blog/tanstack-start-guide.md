---
title: TanStack Start — The New Full Stack React Framework Worth Watching
date: 2026-05-12
description: TanStack Start brings type-safe server functions, file-based routing, and first-class data loading to React. Here's what it looks like in practice.
tags: [fullstack, tanstack, react, typescript]
---

## What is TanStack Start

TanStack Start is a full stack React framework built on TanStack Router. It gives you file-based routing, server functions (like server actions but type-safe end to end), and seamless data loading — without the Next.js baggage.

The key difference: everything is type-safe from the server function to the component. No type casting, no `as unknown as`.

## Setup

```bash
npm create tanstack@latest
# choose: Start, React, TypeScript
cd myapp
npm install
```

## File-Based Routing

```
src/routes/
├── __root.tsx          ← root layout
├── index.tsx           ← /
├── posts/
│   ├── index.tsx       ← /posts
│   └── $postId.tsx     ← /posts/123
└── about.tsx           ← /about
```

## Root Layout

```tsx
// src/routes/__root.tsx
import { createRootRoute, Outlet, Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/posts">Posts</Link>
      </nav>
      <Outlet />
    </div>
  ),
});
```

## Server Function — Type-Safe End to End

```ts
// src/functions/posts.ts
import { createServerFn } from "@tanstack/start";
import { db } from "~/lib/db";

export const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  return db.select().from(posts).orderBy(desc(posts.createdAt));
});

export const createPost = createServerFn({ method: "POST" })
  .validator((data: { title: string; body: string }) => data)
  .handler(async ({ data }) => {
    return db.insert(posts).values(data).returning();
  });
```

## Route with Data Loading

```tsx
// src/routes/posts/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { getPosts } from "~/functions/posts";

export const Route = createFileRoute("/posts/")({
  loader: async () => {
    // runs on server during SSR, client during navigation
    return getPosts();
  },
  component: PostsPage,
});

function PostsPage() {
  const posts = Route.useLoaderData();

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

## Calling Server Functions from Components

```tsx
import { useServerFn } from "@tanstack/start";
import { createPost } from "~/functions/posts";

function NewPostForm() {
  const submitPost = useServerFn(createPost);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await submitPost({
      data: {
        title: form.get("title") as string,
        body: form.get("body") as string,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

## Why It's Different from Next.js

Next.js server actions are great but the TypeScript experience has gaps — you lose types at the action boundary and have to cast. TanStack Start's `createServerFn` with `.validator()` keeps full type safety from the server handler through to the calling component. If you change the return shape on the server, TypeScript errors appear in the component immediately.

It's early but it's the framework I'm most excited about for 2025.
