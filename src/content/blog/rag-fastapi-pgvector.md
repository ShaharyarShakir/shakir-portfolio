---
title: Building a RAG System with FastAPI and pgvector
date: 2024-04-08
description: Retrieval Augmented Generation from scratch — document ingestion, embedding storage in PostgreSQL, semantic search, and a FastAPI backend.
tags: [mlops, fullstack, fastapi, python, postgresql]
---

## What is RAG and Why Does It Matter

RAG (Retrieval Augmented Generation) lets you give an LLM access to your own documents without fine-tuning. You store document embeddings in a vector database, find relevant chunks at query time, and inject them into the LLM prompt.

This is exactly how I built Document Copilot — a PDF chat app using FastAPI, pgvector, and OpenAI.

## Architecture

```
User query
    ↓
Embed query (OpenAI)
    ↓
Vector search (pgvector)
    ↓
Retrieve top-k chunks
    ↓
Build prompt with context
    ↓
LLM response (OpenAI GPT-4)
    ↓
Stream back to user
```

## Setup PostgreSQL with pgvector

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  chunk_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON chunks USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

## FastAPI App Structure

```
app/
├── main.py
├── routers/
│   ├── documents.py
│   └── chat.py
├── services/
│   ├── embeddings.py
│   ├── ingestion.py
│   └── retrieval.py
└── db.py
```

## Document Ingestion Service

```python
# app/services/ingestion.py
import PyPDF2
import openai
from typing import Generator

def extract_text(file_bytes: bytes) -> str:
    import io
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    return '\n'.join(page.extract_text() for page in reader.pages)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> list[str]:
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks

def get_embedding(text: str) -> list[float]:
    response = openai.embeddings.create(
        model='text-embedding-3-small',
        input=text,
    )
    return response.data[0].embedding
```

## Upload and Ingest Route

```python
# app/routers/documents.py
from fastapi import APIRouter, UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.ingestion import extract_text, chunk_text, get_embedding
from app.db import get_session

router = APIRouter()

@router.post('/upload')
async def upload_document(
    file: UploadFile,
    session: AsyncSession = Depends(get_session)
):
    content = await file.read()
    text = extract_text(content)
    chunks = chunk_text(text)

    # save document record
    doc = Document(filename=file.filename)
    session.add(doc)
    await session.flush()

    # embed and save chunks
    for i, chunk_text in enumerate(chunks):
        embedding = get_embedding(chunk_text)
        chunk = Chunk(
            document_id=doc.id,
            content=chunk_text,
            embedding=embedding,
            chunk_index=i,
        )
        session.add(chunk)

    await session.commit()
    return { 'document_id': str(doc.id), 'chunks': len(chunks) }
```

## Semantic Search

```python
# app/services/retrieval.py
from sqlalchemy import text
from app.services.ingestion import get_embedding

async def semantic_search(
    query: str,
    session: AsyncSession,
    top_k: int = 5,
    document_id: str | None = None
) -> list[dict]:
    query_embedding = get_embedding(query)

    where_clause = ''
    params = { 'embedding': query_embedding, 'limit': top_k }

    if document_id:
        where_clause = 'WHERE c.document_id = :doc_id'
        params['doc_id'] = document_id

    result = await session.execute(text(f'''
        SELECT
            c.content,
            c.chunk_index,
            1 - (c.embedding <=> :embedding::vector) AS similarity
        FROM chunks c
        {where_clause}
        ORDER BY c.embedding <=> :embedding::vector
        LIMIT :limit
    '''), params)

    return [
        { 'content': row.content, 'similarity': float(row.similarity) }
        for row in result.fetchall()
    ]
```

## Chat Route with Streaming

```python
# app/routers/chat.py
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.retrieval import semantic_search
import openai

router = APIRouter()

@router.post('/chat')
async def chat(
    body: ChatRequest,
    session: AsyncSession = Depends(get_session)
):
    chunks = await semantic_search(body.query, session, document_id=body.document_id)
    context = '\n\n'.join(c['content'] for c in chunks)

    prompt = f'''Answer the question based on the context below.
If the answer isn't in the context, say "I don't know."

Context:
{context}

Question: {body.query}'''

    async def generate():
        stream = openai.chat.completions.create(
            model='gpt-4o-mini',
            messages=[{ 'role': 'user', 'content': prompt }],
            stream=True,
        )
        for chunk in stream:
            delta = chunk.choices[0].delta.content or ''
            yield delta

    return StreamingResponse(generate(), media_type='text/plain')
```

The IVFFlat index on the embedding column is what makes vector search fast at scale. Without it, every query does a full table scan — fine for hundreds of documents, unusable for thousands.
