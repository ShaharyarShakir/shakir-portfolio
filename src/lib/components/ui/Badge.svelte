<script lang="ts">
  import type { Tech } from '$lib/types';

  let {
    tech,
    text,
    variant = 'default'
  }: {
    tech?: Tech;
    text?: string;
    variant?: 'default' | 'subtle' | 'glow';
  } = $props();

  const label = $derived(tech ? tech.label : text ?? '');
  const icon = $derived(tech?.icon);

  const variantClasses = $derived(
    variant === 'subtle'
      ? 'badge-ghost border border-slate-300/40 dark:border-slate-800 text-slate-600 dark:text-slate-400'
      : variant === 'glow'
      ? 'badge-primary badge-outline shadow-md shadow-indigo-500/20 text-indigo-600 dark:text-amber-400 border-indigo-400/50 dark:border-amber-400/40'
      : 'badge-outline bg-white/40 dark:bg-slate-900/40 border-sky-300/40 dark:border-amber-400/20 text-slate-800 dark:text-slate-200'
  );
</script>

<span class={`badge badge-sm py-2 px-2.5 inline-flex items-center gap-1.5 font-medium tracking-wide transition-all duration-200 ${variantClasses}`}>
  {#if icon}
    <img src={icon} alt={label} class="w-3.5 h-3.5 object-contain" loading="lazy" />
  {/if}
  <span>{label}</span>
</span>
