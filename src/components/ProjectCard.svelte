<script lang="ts">
  import type { Project } from '$lib/types';

  let { image, imageAlt, title, description, techs, href, github }: Project = $props();

  let cardEl: HTMLElement | null = $state(null);
  let mouseX = $state(50);
  let mouseY = $state(50);
  let tiltX = $state(0);
  let tiltY = $state(0);

  function handleMouseMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX = Math.round(px * 100);
    mouseY = Math.round(py * 100);
    tiltY = (px - 0.5) * 6;
    tiltX = -(py - 0.5) * 6;
  }

  function handleMouseLeave() {
    mouseX = 50;
    mouseY = 50;
    tiltX = 0;
    tiltY = 0;
  }
</script>

<article
  bind:this={cardEl}
  class="card card-compact relative flex flex-col overflow-hidden bg-white/85 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-300/40 dark:border-amber-400/20 shadow-xl shadow-slate-900/10 dark:shadow-black/60 rounded-2xl transition-all duration-300 group hover:-translate-y-1.5 hover:border-sky-400/70 dark:hover:border-amber-400/50 hover:shadow-2xl"
  onmousemove={handleMouseMove}
  onmouseleave={handleMouseLeave}
  style="transform: perspective(1000px) rotateX({tiltX}deg) rotateY({tiltY}deg);"
>
  <!-- Mouse Spotlight Glow -->
  <div
    class="absolute inset-0 z-10 pointer-events-none transition-opacity duration-400 opacity-0 group-hover:opacity-100"
    style="background: radial-gradient(450px circle at {mouseX}% {mouseY}%, rgba(158, 220, 255, 0.25), transparent 80%);"
  ></div>

  <!-- Image -->
  <a class="relative block overflow-hidden aspect-video z-20 bg-slate-900" href={href ?? "#"} target="_blank" rel="noopener">
    <img
      src={image}
      alt={imageAlt}
      class="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105 group-hover:brightness-50"
      loading="lazy"
    />
    <div
      class="absolute top-0 -left-[150%] w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-25 transition-all duration-750 pointer-events-none group-hover:left-[150%]"
    ></div>
    <div
      class="absolute inset-0 flex items-center justify-center gap-2 text-white font-medium text-sm opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 pointer-events-none"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      View Project
    </div>
  </a>

  <!-- Body -->
  <div class="card-body p-5 relative z-20 flex flex-col gap-2 flex-1">
    <div class="flex items-center justify-between gap-2">
      <h3 class="card-title text-base font-semibold text-slate-900 dark:text-slate-100 m-0 leading-tight">
        {title}
      </h3>
      {#if github}
        <a
          class="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded-md transition-all duration-200 hover:rotate-12 hover:scale-110"
          href={github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub repo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
      {/if}
    </div>

    <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed m-0 flex-1">
      {description}
    </p>

    <!-- Tech icons -->
    <div class="flex items-center gap-1.5 flex-wrap mt-2">
      {#each techs as tech}
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg border border-sky-300/40 dark:border-amber-400/20 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:scale-115 hover:border-indigo-400 dark:hover:border-amber-400"
          title={tech.label}
        >
          <img src={tech.icon} alt={tech.label} width="18" height="18" class="rounded dark:invert dark:brightness-200 transition-transform" />
        </span>
      {/each}
    </div>
  </div>
</article>