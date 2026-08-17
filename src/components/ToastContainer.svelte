<script lang="ts">
  import { toasts } from '$lib/stores/toast';
</script>

<div class="toast-container" aria-live="polite">
  {#each $toasts as toast (toast.id)}
    <div class={`toast-item toast-${toast.type ?? 'success'}`}>
      {#if toast.type === 'success'}
        <svg
          class="toast-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      {:else}
        <svg
          class="toast-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      {/if}
      <span class="toast-msg">{toast.message}</span>
      <button
        class="toast-close"
        onclick={() => toasts.remove(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
    max-width: 360px;
  }

  .toast-item {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 11px 16px;
    border-radius: 12px;
    border: 0.5px solid var(--border);
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(16px) saturate(1.8);
    -webkit-backdrop-filter: blur(16px) saturate(1.8);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.05);
    color: var(--text-primary);
    font-size: 0.85rem;
    font-weight: 500;
    animation: toast-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  :global(.dark) .toast-item {
    background: rgba(20, 20, 22, 0.85);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.5),
      0 1px 3px rgba(0, 0, 0, 0.3);
  }

  .toast-success .toast-icon {
    color: #22c55e;
  }

  .toast-info .toast-icon {
    color: #6366f1;
  }

  .toast-msg {
    flex: 1;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.1rem;
    cursor: pointer;
    line-height: 1;
    padding: 0 2px;
    transition: color 0.2s ease;
  }

  .toast-close:hover {
    color: var(--text-primary);
  }

  @keyframes toast-in {
    from {
      opacity: 0;
      transform: translateY(16px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
</style>
