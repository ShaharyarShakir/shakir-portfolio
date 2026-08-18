<script lang="ts">
  import { getAllPosts } from "$lib/utils/blog";
  import SEO from "../../components/SEO.svelte";

  const posts = getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Shaharyar Shakir Blog",
    "description": "Writing about DevOps, MLOps, software engineering, and building production applications.",
    "blogPost": posts.map(p => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "description": p.description,
      "datePublished": p.date,
      "url": `https://shaharyarshakir.dev/blog/${p.slug}`
    }))
  };
</script>

<SEO
  title="Blog"
  description="Technical articles, engineering insights, DevOps guides, and software architecture by Shaharyar Shakir."
  jsonLd={blogJsonLd}
/>

<div class="py-8 pb-12">
  <div class="mb-10 pb-8 border-b border-[var(--border)]">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
      Blog
    </h1>
    <p class="text-sm text-[var(--text-muted)] m-0">
      Writing about DevOps, MLOps, and building things.
    </p>
  </div>

  <div class="flex flex-col border-t border-[var(--border)]">
    {#each posts as post}
      <a
        class="block py-5 border-b border-[var(--border)] no-underline transition-all duration-300 hover:pl-2 group"
        href="/blog/{post.slug}"
      >
        <div class="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div class="flex flex-col gap-1.5 flex-1 min-w-0">
            <span class="text-base font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors leading-snug">
              {post.title}
            </span>
            <span class="text-xs leading-relaxed text-[var(--text-muted)] line-clamp-2">
              {post.description}
            </span>
            <div class="flex flex-wrap gap-1.5 mt-1">
              {#each post.tags as tag}
                <span class="badge badge-xs badge-outline text-[0.68rem] px-2 py-1 text-[var(--text-muted)] border-[var(--border)]">
                  {tag}
                </span>
              {/each}
            </div>
          </div>

          <div class="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1 shrink-0">
            <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span class="text-[0.72rem] text-[var(--text-muted)] opacity-80 whitespace-nowrap">
              {post.readingTime} min read
            </span>
            <svg
              class="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 hidden sm:block mt-1"
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
      <div class="py-12 text-[var(--text-muted)] text-sm">
        <p>no posts yet — check back soon.</p>
      </div>
    {/each}
  </div>
</div>
