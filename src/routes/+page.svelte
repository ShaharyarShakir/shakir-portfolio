<script lang="ts">
  import Hero from "../components/Hero.svelte";
  import ProjectGrid from "../components/ProjectGrid.svelte";
  import TechScroll from "../components/TechScroll.svelte";
  import SEO from "../components/SEO.svelte";
  import { projects } from "$lib/data/projects";
  import { getAllPosts } from "$lib/utils/blog";

  const latestPosts = getAllPosts().slice(0, 3);

  const homeJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Shaharyar Shakir",
      "jobTitle": "Full-Stack Web Developer, DevOps & MLOps Engineer",
      "url": "https://shaharyarshakir.dev",
      "image": "https://shaharyarshakir.dev/images/avatar.jpg",
      "sameAs": [
        "https://github.com/ShaharyarShakir",
        "https://linkedin.com/in/shaharyar-shakir-3674a027b"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK",
        "addressRegion": "Pakistan"
      },
      "knowsAbout": [
        "Web Development",
        "Full-Stack Web Engineering",
        "DevOps Engineering",
        "MLOps & Machine Learning Pipelines",
        "React Native Mobile App Development",
        "Docker & Kubernetes Infrastructure",
        "SvelteKit & Next.js",
        "FastAPI & Python"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Shaharyar Shakir — Web Dev, DevOps, MLOps & Mobile Development Services",
      "description": "Custom Web Development, Cloud DevOps Pipelines, MLOps Solutions, and React Native Mobile App Development.",
      "url": "https://shaharyarshakir.dev",
      "logo": "https://shaharyarshakir.dev/images/avatar.jpg",
      "image": "https://shaharyarshakir.dev/images/avatar.jpg",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "PK",
        "addressRegion": "Pakistan"
      },
      "areaServed": ["Pakistan", "Worldwide", "Remote"],
      "serviceType": [
        "Web Development Services",
        "DevOps Engineering Services",
        "MLOps & Data Pipelines",
        "Mobile App Development"
      ],
      "priceRange": "$$"
    }
  ];
</script>

<SEO jsonLd={homeJsonLd} />

<Hero />
<div class="relative">
  <div class="top-0 left-0 absolute bg-gradient-to-r from-sky-400/20 via-indigo-500/40 to-sky-400/20 w-full h-px"></div>
  <section class="py-6">
    <div class="flex items-baseline justify-between mb-6">
      <h2 class="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)] m-0">
        Selected work
      </h2>
      <a href="/project" class="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">
        see all →
      </a>
    </div>
    <ProjectGrid {projects} limit={3} />
  </section>

  <div class="relative">
    <div class="top-0 left-0 absolute bg-gradient-to-r from-sky-400/20 via-indigo-500/40 to-sky-400/20 w-full h-px"></div>
    <TechScroll />
  </div>

  {#if latestPosts.length > 0}
    <section class="py-6">
      <div class="flex items-baseline justify-between mb-6">
        <h2 class="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)] m-0">
          latest writing
        </h2>
        <a href="/blog" class="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] no-underline transition-colors">
          see all →
        </a>
      </div>

      <div class="flex flex-col border-t border-[var(--border)]">
        {#each latestPosts as post}
          <a
            class="flex items-start justify-between gap-6 py-4 border-b border-[var(--border)] no-underline transition-all duration-250 hover:pl-2 group"
            href="/blog/{post.slug}"
          >
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <span class="text-sm font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors truncate">
                {post.title}
              </span>
              <span class="text-xs text-[var(--text-muted)] truncate">
                {post.description}
              </span>
            </div>
            <div class="flex flex-col items-end gap-0.5 shrink-0">
              <span class="text-xs text-[var(--text-muted)] whitespace-nowrap">
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span class="text-[0.7rem] text-[var(--text-muted)] opacity-80 whitespace-nowrap">
                {post.readingTime} min
              </span>
            </div>
          </a>
        {/each}
      </div>
    </section>
  {/if}
</div>
