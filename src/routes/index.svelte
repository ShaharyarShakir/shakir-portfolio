<script lang="ts">
  import Hero from "../components/Hero.svelte";
  import ProjectGrid from "../components/ProjectGrid.svelte";
  import TechScroll from "../components/TechScroll.svelte";
  import { projects } from "../lib/data/projects";
  import { p } from "sv-router/generated";
  import { getAllPosts } from "../lib/utils/blog";
  const latestPosts = getAllPosts().slice(0, 3);
</script>

<Hero />
<div class="relative">
  <div
    class="top-0 left-0 absolute bg-linear-to-r from-gray-100 via-gray-500 to-gray-100 w-full h-px"
  ></div>
  <section>
    <div class="section-header">
      <h2 class="section-title">Selected work</h2>
      <a href={p("/project")} class="see-all">see all →</a>
    </div>
    <ProjectGrid {projects} limit={5} />
  </section>
  <div class="relative">
    <div
      class="top-0 left-0 absolute bg-linear-to-r from-gray-100 via-gray-500 to-gray-100 w-full h-px"
    ></div>
    <TechScroll />
  </div>
  {#if latestPosts.length > 0}
    <section class="home-section">
      <div class="section-header">
        <h2 class="section-title">latest writing</h2>
        <a href={p("/blog")} class="see-all">see all →</a>
      </div>

      <div class="mini-post-list">
        {#each latestPosts as post}
          <a
            class="mini-post"
            href={p("/blog/:slug", { params: { slug: post.slug } })}
          >
            <div class="mini-post-left">
              <span class="mini-post-title">{post.title}</span>
              <span class="mini-post-desc">{post.description}</span>
            </div>
            <div class="mini-post-right">
              <span class="mini-post-date">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span class="mini-post-read">{post.readingTime} min</span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }
  .see-all {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }
  .see-all:hover {
    color: var(--text-primary);
  }
  /* ── Mini post list ── */
  .mini-post-list {
    display: flex;
    flex-direction: column;
    border-top: 0.5px solid var(--border);
  }

  .mini-post {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1rem 0;
    border-bottom: 0.5px solid var(--border);
    text-decoration: none;
    transition: padding-left 0.25s ease;
  }

  .mini-post:hover {
    padding-left: 6px;
  }
  .mini-post:hover .mini-post-title {
    color: var(--text-primary);
  }

  .mini-post-left {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    min-width: 0;
  }

  .mini-post-title {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
    transition: color 0.2s;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mini-post-desc {
    font-size: 0.8rem;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mini-post-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
    flex-shrink: 0;
  }

  .mini-post-date {
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .mini-post-read {
    font-size: 0.7rem;
    color: var(--text-muted);
    white-space: nowrap;
  }
</style>
