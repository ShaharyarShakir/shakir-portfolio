<script lang="ts">
  import type { PageData } from './$types';
  import { toasts } from '$lib/stores/toast';
  import SEO from '../../../components/SEO.svelte';

  let { data }: { data: PageData } = $props();
  const post = $derived(data.post);

  const blogPostJsonLd = $derived(
    post
      ? {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.date,
          "author": {
            "@type": "Person",
            "name": "Shaharyar Shakir"
          }
        }
      : undefined
  );

  $effect(() => {
    if (!post) return;
    setTimeout(() => {
      document
        .querySelectorAll<HTMLButtonElement>(".copy-btn")
        .forEach((btn) => {
          btn.addEventListener("click", async () => {
            const code = decodeURIComponent(btn.dataset.code ?? "");
            await navigator.clipboard.writeText(code);

            toasts.add("Copied snippet to clipboard!", "success");

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
  <SEO
    title={post.title}
    description={post.description}
    type="article"
    jsonLd={blogPostJsonLd}
  />
  <div class="py-8 pb-16 max-w-2xl mx-auto relative">
    <a href="/blog" class="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline mb-8 hover:-translate-x-1 transition-all duration-200">
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

    <header class="mb-10 pb-8 border-b border-[var(--border)]">
      <div class="flex items-center gap-2 mb-3 text-xs text-[var(--text-muted)]">
        <span>
          {new Date(post.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span>·</span>
        <span>{post.readingTime} min read</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-snug mb-3">
        {post.title}
      </h1>
      <p class="text-base leading-relaxed text-[var(--text-secondary)] mb-4">
        {post.description}
      </p>
      <div class="flex flex-wrap gap-1.5">
        {#each post.tags as tag}
          <span class="badge badge-sm badge-outline text-xs px-2.5 py-1 text-[var(--text-muted)] border-[var(--border)]">
            {tag}
          </span>
        {/each}
      </div>
    </header>

    <article class="prose-article text-[var(--text-primary)]">
      {@html post.html}
    </article>
  </div>
{:else}
  <div class="py-12 text-[var(--text-muted)] text-sm">
    <p>post not found.</p>
    <a href="/blog" class="text-[var(--text-secondary)] underline">← back to blog</a>
  </div>
{/if}
