<script lang="ts">
  import { route } from "sv-router/generated";
  import { getPost } from "../lib/utils/blog";
  import { p } from "sv-router/generated";

  // correct way to get params in sv-router
  const { slug } = route.getParams("/blog/:slug");
  const post = getPost(slug);

  $effect(() => {
    if (!post) return;
    setTimeout(() => {
      document
        .querySelectorAll<HTMLButtonElement>(".copy-btn")
        .forEach((btn) => {
          btn.addEventListener("click", async () => {
            const code = decodeURIComponent(btn.dataset.code ?? "");
            await navigator.clipboard.writeText(code);

            const span = btn.querySelector("span")!;
            const svg = btn.querySelector("svg")!;

            svg.innerHTML = `<polyline points="20 6 9 17 4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
            span.textContent = "copied!";
            btn.classList.add("copied");

            setTimeout(() => {
              svg.innerHTML = `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`;
              span.textContent = "copy";
              btn.classList.remove("copied");
            }, 2000);
          });
        });
    }, 0);
  });
</script>

{#if post}
  <div class="post-wrap">
    <a href={p("/blog")} class="post-back">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      all posts
    </a>

    <header class="post-header">
      <div class="post-meta">
        <span class="post-date">
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span class="post-dot">·</span>
        <span class="post-read">{post.readingTime} min read</span>
      </div>
      <h1 class="post-title">{post.title}</h1>
      <p class="post-desc">{post.description}</p>
      <div class="post-tags">
        {#each post.tags as tag}
          <span class="tag">{tag}</span>
        {/each}
      </div>
    </header>

    <article class="post-content">
      {@html post.html}
    </article>
  </div>
{:else}
  <div class="not-found">
    <p>post not found.</p>
    <a href={p("/blog")}>← back to blog</a>
  </div>
{/if}

<!-- same styles as before -->
<style>
  .post-wrap {
    padding: 2rem 0 4rem;
  }

  .post-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    color: var(--text-muted);
    text-decoration: none;
    margin-bottom: 2rem;
    transition:
      color 0.2s,
      gap 0.2s;
  }
  .post-back:hover {
    color: var(--text-primary);
    gap: 10px;
  }

  .post-header {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 0.5px solid var(--border);
  }

  .post-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.8rem;
  }

  .post-date,
  .post-read {
    font-size: 0.82rem;
    color: var(--text-muted);
  }
  .post-dot {
    color: var(--border);
  }

  .post-title {
    font-size: 1.9rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    line-height: 1.2;
    margin: 0 0 0.7rem;
  }

  .post-desc {
    font-size: 1rem;
    color: var(--text-secondary);
    line-height: 1.7;
    margin: 0 0 1rem;
  }

  .post-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .tag {
    font-size: 0.7rem;
    font-weight: 500;
    color: var(--text-muted);
    border: 0.5px solid var(--border);
    border-radius: 4px;
    padding: 2px 8px;
    background: var(--bg-outer);
  }

  .post-content :global(h2) {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 2.5rem 0 0.75rem;
  }

  .post-content :global(h3) {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 2rem 0 0.6rem;
  }

  .post-content :global(p) {
    font-size: 0.95rem;
    line-height: 1.85;
    color: var(--text-secondary);
    margin: 0 0 1.2rem;
  }

  .post-content :global(a) {
    color: var(--text-primary);
    text-underline-offset: 3px;
  }

  .post-content :global(ul),
  .post-content :global(ol) {
    padding-left: 1.4rem;
    margin: 0 0 1.2rem;
  }

  .post-content :global(li) {
    font-size: 0.95rem;
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 0.3rem;
  }

  .post-content :global(blockquote) {
    border-left: 2px solid var(--border);
    margin: 1.5rem 0;
    padding: 0.2rem 0 0.2rem 1.2rem;
    color: var(--text-muted);
    font-style: italic;
  }

  .post-content :global(.code-block) {
    margin: 1.5rem 0;
    border: 0.5px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .post-content :global(.code-header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    border-bottom: 0.5px solid var(--border);
    background: var(--bg-outer);
  }

  .post-content :global(.code-lang) {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .post-content :global(.copy-btn) {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: 0.5px solid var(--border);
    border-radius: 5px;
    padding: 3px 9px;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    font-family: inherit;
    transition:
      color 0.2s,
      border-color 0.2s;
  }

  .post-content :global(.copy-btn:hover) {
    color: var(--text-primary);
    border-color: var(--text-muted);
  }

  .post-content :global(.copy-btn.copied) {
    color: #4ade80;
    border-color: #4ade80;
  }

  .post-content :global(.code-block pre) {
    margin: 0;
    padding: 1rem 1.2rem;
    overflow-x: auto;
    background: var(--bg-outer);
  }

  .post-content :global(.code-block code) {
    font-family: "JetBrains Mono", "Fira Code", monospace;
    font-size: 0.85rem;
    line-height: 1.7;
    background: none;
    padding: 0;
  }

  .post-content :global(p code),
  .post-content :global(li code) {
    font-size: 0.82rem;
    font-family: "JetBrains Mono", "Fira Code", monospace;
    background: var(--bg-outer);
    border: 0.5px solid var(--border);
    border-radius: 4px;
    padding: 1px 6px;
    color: var(--text-primary);
  }

  .not-found {
    padding: 3rem 0;
    color: var(--text-muted);
    font-size: 0.9rem;
  }

  .not-found a {
    color: var(--text-secondary);
    text-decoration: none;
  }
</style>
