---
title: Skilld — Building an AI Agent Procedural Skill Registry with Clerk & PostgreSQL
date: 2026-07-20
description: How I designed Skilld — an index and explorer for reusable autonomous AI agent tools, featuring real-time code snippet search and Clerk authentication.
tags: [fullstack, ai-agents, postgresql, clerk, typescript]
---

## The AI Agent Context Void

Autonomous AI coding agents and LLM tool pipelines rely heavily on procedural instructions, custom functions, and domain-specific context files. But developers repeatedly recreate the same web search tools, database connectors, and git handlers for every new agent project.

I built **Skilld** as an open registry where engineers publish, search, version, and integrate reusable procedural AI agent skills.

```
       ┌────────────────────────┐
       │   Skilld Central Hub   │
       └───────────┬────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
[Web Scraping] [SQL Query] [Git Operations]
  Skill JSON     Skill JSON    Skill JSON
```

## Schema & Trigram Indexing for Fast Code Search

Skill snippets contain Markdown, TypeScript, Python, and JSON parameters. To deliver sub-50ms search response times across thousands of skill listings without spinning up Elasticsearch, I leveraged PostgreSQL **Trigram Indexing (`pg_trgm`)**:

```sql
-- Enable trigram extension for fuzzy text matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE agent_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  code_snippet TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  stars_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- GIN Trigram Index on title, description, and code snippet
CREATE INDEX skills_search_trgm_idx ON agent_skills
USING GIN ((title || ' ' || description || ' ' || code_snippet) gin_trgm_ops);
```

## Seamless Authentication with Clerk & PostgreSQL Sync

Skilld allows developers to bookmark skills and publish new agent blueprints. Using Clerk for authentication ensures OAuth logins (GitHub, Google) work instantly.

Here is how user permissions and skill creation are handled cleanly in the API layer:

```ts
import { auth } from '@clerk/nextjs/server';
import { db } from '@/db';
import { agentSkills } from '@/db/schema';

export async function createSkillHandler(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await req.json();
  const { title, description, codeSnippet, tags } = body;

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const [newSkill] = await db
    .insert(agentSkills)
    .values({
      authorId: userId,
      title,
      slug: `${slug}-${Math.random().toString(36).substring(2, 6)}`,
      description,
      codeSnippet,
      tags: tags || [],
    })
    .returning();

  return new Response(JSON.stringify(newSkill), { status: 201 });
}
```

## Lessons from AI Agent Tooling

1. **Standardized Declarations**: Standardizing skill parameter schemas (Input JSON Schema + Output Description) allows agents to invoke third-party skills dynamically.
2. **Speed is Crucial**: Trigram indexes in PostgreSQL provide instant search without external search infrastructure costs.
