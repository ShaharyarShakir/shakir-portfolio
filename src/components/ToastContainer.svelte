<script lang="ts">
  import { toasts } from '$lib/stores/toast';
</script>

<div class="toast toast-end toast-bottom z-50 p-4 max-w-sm pointer-events-none" aria-live="polite">
  {#each $toasts as toast (toast.id)}
    <div
      class={`alert shadow-xl pointer-events-auto flex items-center gap-3 backdrop-blur-xl border border-sky-300/40 dark:border-amber-400/20 ${
        toast.type === 'info'
          ? 'alert-info bg-indigo-950/80 text-indigo-100'
          : 'alert-success bg-emerald-950/80 text-emerald-100'
      }`}
    >
      {#if toast.type === 'success'}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-400 shrink-0">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      {:else}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-400 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      {/if}
      <span class="text-sm font-medium flex-1">{toast.message}</span>
      <button
        class="btn btn-ghost btn-xs btn-circle text-slate-400 hover:text-white"
        onclick={() => toasts.remove(toast.id)}
        aria-label="Dismiss notification"
      >
        ✕
      </button>
    </div>
  {/each}
</div>
