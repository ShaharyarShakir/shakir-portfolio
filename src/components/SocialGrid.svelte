<script lang="ts">
  import type { SocialLink } from '$lib/types';

  interface Props {
    socials: SocialLink[];
  }

  let { socials }: Props = $props();
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
  {#each socials as social}
    <a
      class="card card-compact relative flex flex-col justify-between gap-5 p-5 border border-sky-300/40 dark:border-amber-400/20 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl no-underline transition-all duration-300 group hover:-translate-y-1.5 hover:scale-102 hover:border-indigo-400 dark:hover:border-amber-400 shadow-md hover:shadow-xl"
      href={social.href}
      target="_blank"
      rel="noopener"
    >
      <div class="flex items-start justify-between">
        <span class="text-slate-900 dark:text-slate-100 flex transition-transform duration-350 group-hover:scale-118 group-hover:rotate-6">
          {@html social.icon}
        </span>
        <svg
          class="text-slate-400 dark:text-slate-500 shrink-0 transition-transform duration-350 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-slate-900 dark:group-hover:text-white"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        >
          <path d="M3 13L13 3M13 3H6M13 3v7" />
        </svg>
      </div>

      <div class="flex flex-col gap-0.5">
        <span class="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {social.label}
        </span>
        <span class="text-xs font-mono text-slate-600 dark:text-slate-300">
          {social.handle}
        </span>
        <span class="text-[0.78rem] text-slate-500 dark:text-slate-400 mt-0.5">
          {social.desc}
        </span>
      </div>
    </a>
  {/each}
</div>
