<script lang="ts">
  import type { CurrentlyItem } from '$lib/types';

  interface Props {
    items: CurrentlyItem[];
  }

  let { items }: Props = $props();
</script>

<div class="border-t border-sky-300/40 dark:border-amber-400/20 pt-10">
  <div class="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-400 mb-5 flex items-center gap-2">
    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse"></span>
    Currently
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {#each items as item}
      <div
        class="flex flex-col gap-1 p-3.5 rounded-xl border border-transparent hover:border-sky-300/40 dark:hover:border-amber-400/20 bg-transparent hover:bg-white/60 dark:hover:bg-slate-900/60 backdrop-blur-xs transition-all duration-250 hover:-translate-y-0.5 group"
      >
        <span class="text-[0.7rem] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
          {item.key}
        </span>
        <span class="text-sm font-medium text-slate-900 dark:text-slate-100">
          {item.val}
        </span>
      </div>
    {/each}
  </div>
</div>
