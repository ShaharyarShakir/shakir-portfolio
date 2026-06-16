<script lang="ts">
  import { getAllPosts } from "../lib/utils/blog";
  import { p } from "sv-router/generated";

  const posts = getAllPosts();
</script>

<div class="blog-wrap">
  <div class="blog-header">
    <h1 class="blog-title">Blog</h1>
    <p class="blog-lead">Writing about DevOps, MlOps, and building things.</p>
  </div>

  <div class="post-list">
    {#each posts as post}
      <a
        class="post-row"
        href={p("/blog/:slug", { params: { slug: post.slug } })}
      >
        <div class="post-row-main">
          <div class="post-row-left">
            <span class="post-row-title">{post.title}</span>
            <span class="post-row-desc">{post.description}</span>
            <div class="post-row-tags">
              {#each post.tags as tag}
                <span class="tag">{tag}</span>
              {/each}
            </div>
          </div>
          <div class="post-row-right">
            <span class="post-date">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span class="post-read">{post.readingTime} min read</span>
            <svg
              class="post-arrow"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    {:else}
      <div class="no-posts">
        <p>no posts yet — check back soon.</p>
      </div>
    {/each}
  </div>
</div>

<style>
  .blog-wrap {
    padding: 2rem 0 3rem;
  }

  /* ── Header ── */
  .blog-header {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 0.5px solid var(--border);
  }

  .blog-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 0.4rem;
  }

  .blog-lead {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin: 0;
  }

  /* ── List ── */
  .post-list {
    display: flex;
    flex-direction: column;
  }

  .post-row {
    display: block;
    padding: 1.4rem 0;
    border-bottom: 0.5px solid var(--border);
    text-decoration: none;
    transition: padding-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .post-row:first-child {
    border-top: 0.5px solid var(--border);
  }

  .post-row:hover {
    padding-left: 8px;
  }
  .post-row:hover .post-row-title {
    color: var(--text-primary);
  }
  .post-row:hover .post-arrow {
    opacity: 1;
    transform: translateX(3px);
  }

  .post-row-main {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
  }

  /* ── Left ── */
  .post-row-left {
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-width: 0;
  }

  .post-row-title {
    font-size: 0.975rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.2s;
    line-height: 1.4;
  }

  .post-row-desc {
    font-size: 0.845rem;
    color: var(--text-muted);
    line-height: 1.5;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .post-row-tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .tag {
    font-size: 0.68rem;
    font-weight: 500;
    color: var(--text-muted);
    border: 0.5px solid var(--border);
    border-radius: 4px;
    padding: 1px 7px;
    background: var(--bg-outer);
    letter-spacing: 0.02em;
  }

  /* ── Right ── */
  .post-row-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  .post-date {
    font-size: 0.78rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .post-read {
    font-size: 0.72rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .post-arrow {
    color: var(--text-muted);
    opacity: 0;
    margin-top: 4px;
    transition:
      opacity 0.2s ease,
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Empty ── */
  .no-posts {
    padding: 3rem 0;
    color: var(--text-muted);
    font-size: 0.875rem;
  }

  /* ── Mobile ── */
  @media (max-width: 500px) {
    .post-row-main {
      flex-direction: column;
      gap: 0.6rem;
    }
    .post-row-right {
      flex-direction: row;
      align-items: center;
      gap: 8px;
    }
    .post-arrow {
      display: none;
    }
  }
</style>
