<script lang="ts">
  import ProjectGrid from "../../components/ProjectGrid.svelte";
  import SEO from "../../components/SEO.svelte";
  import { projects } from "$lib/data/projects";

  const projectListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Shaharyar Shakir Projects",
    "itemListElement": projects.map((p, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "item": {
        "@type": "SoftwareSourceCode",
        "name": p.title,
        "description": p.description,
        "codeRepository": p.github,
        "url": p.href
      }
    }))
  };
</script>

<SEO
  title="Projects"
  description="Explore full-stack applications, AI chatbots, Docker platforms, and DevOps pipelines built by Shaharyar Shakir."
  jsonLd={projectListJsonLd}
/>

<h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-8">
  Projects
</h1>

<section class="mb-14 pb-12 border-b border-[var(--border)]">
  <p class="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-6">
    how i think about building
  </p>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-card)] backdrop-blur-xs border border-[var(--border)]">
      <span class="text-xs font-semibold font-mono text-[var(--text-muted)]">01</span>
      <h3 class="text-sm font-semibold text-[var(--text-primary)] m-0 leading-snug">solve a real problem</h3>
      <p class="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
        every project starts with a problem worth solving — not a stack worth showing off. the tech follows the need.
      </p>
    </div>

    <div class="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-card)] backdrop-blur-xs border border-[var(--border)]">
      <span class="text-xs font-semibold font-mono text-[var(--text-muted)]">02</span>
      <h3 class="text-sm font-semibold text-[var(--text-primary)] m-0 leading-snug">ship fast, iterate faster</h3>
      <p class="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
        a working v1 beats a perfect v0. i get something live early, then refine based on real feedback.
      </p>
    </div>

    <div class="flex flex-col gap-2 p-4 rounded-xl bg-[var(--bg-card)] backdrop-blur-xs border border-[var(--border)]">
      <span class="text-xs font-semibold font-mono text-[var(--text-muted)]">03</span>
      <h3 class="text-sm font-semibold text-[var(--text-primary)] m-0 leading-snug">own the full stack</h3>
      <p class="text-xs text-[var(--text-secondary)] leading-relaxed m-0">
        from infra to ui — i care about how it's deployed as much as how it looks. no black boxes.
      </p>
    </div>
  </div>
</section>

<ProjectGrid {projects} />
