<script lang="ts">
  import type { TimelineEntry } from '$lib/types';
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  interface Props {
    timeline: TimelineEntry[];
  }

  let { timeline }: Props = $props();
  let timelineContainer: HTMLElement | undefined = $state();

  onMount(() => {
    let ctx: gsap.Context | undefined;
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!prefersReducedMotion && timelineContainer) {
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          const items = timelineContainer?.querySelectorAll('.timeline-item');
          items?.forEach((item) => {
            gsap.fromTo(
              item,
              { opacity: 0, y: 32, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.75,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: item,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });

          const lines = timelineContainer?.querySelectorAll('.timeline-line');
          lines?.forEach((line) => {
            gsap.fromTo(
              line,
              { scaleY: 0, transformOrigin: 'top center' },
              {
                scaleY: 1,
                ease: 'none',
                scrollTrigger: {
                  trigger: line,
                  start: 'top 82%',
                  end: 'bottom 60%',
                  scrub: 0.5,
                },
              }
            );
          });
        }, timelineContainer);
      }
    }

    return () => {
      ctx?.revert();
    };
  });
</script>

<div class="flex flex-col mb-14 group/timeline" bind:this={timelineContainer}>
  {#each timeline as entry, i}
    <div
      class="timeline-item grid grid-cols-[28px_1fr] gap-x-5 transition-all duration-300 group/item hover:translate-x-2 group-hover/timeline:opacity-40 group-hover/item:!opacity-100"
    >
      <!-- Spine -->
      <div class="flex flex-col items-center pt-1">
        <div
          class="timeline-dot w-2.5 h-2.5 rounded-full border-2 border-slate-900 dark:border-amber-400 bg-white dark:bg-slate-900 shrink-0 transition-all duration-300 group-hover/item:scale-150 group-hover/item:bg-slate-900 dark:group-hover/item:bg-amber-400 group-hover/item:shadow-md"
        ></div>
        {#if i < timeline.length - 1}
          <div class="timeline-line w-px flex-1 bg-sky-300/40 dark:bg-amber-400/20 my-1.5 min-h-8"></div>
        {/if}
      </div>

      <!-- Content -->
      <div class="p-4 -ml-4 mb-4 rounded-2xl transition-all duration-300 group-hover/item:bg-white/70 dark:group-hover/item:bg-slate-900/60 backdrop-blur-md">
        <span class="text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5 transition-colors">
          {entry.year}
        </span>
        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100 m-0 mb-2 leading-snug transition-transform group-hover/item:translate-x-1">
          {entry.title}
        </h3>
        <p class="text-sm leading-relaxed text-slate-700 dark:text-slate-300 m-0 mb-3 transition-colors">
          {entry.body}
        </p>
        <div class="flex flex-wrap gap-1.5">
          {#each entry.tags as tag}
            <span
              class="badge badge-sm badge-outline font-semibold tracking-wider text-[0.7rem] bg-white/60 dark:bg-slate-800/60 border-sky-300/40 dark:border-amber-400/20 text-slate-800 dark:text-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400 dark:hover:border-amber-400"
            >
              {tag}
            </span>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>
