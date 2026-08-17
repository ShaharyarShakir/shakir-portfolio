<script lang="ts">
  import type { CurrentlyItem } from '$lib/data/profile';

  interface Props {
    items: CurrentlyItem[];
  }

  let { items }: Props = $props();
</script>

<div class="currently">
  <div class="currently-label flex items-center gap-2">
    <span class="live-dot"></span>
    Currently
  </div>
  <div class="currently-grid">
    {#each items as item}
      <div class="currently-item group">
        <span class="currently-key">{item.key}</span>
        <span class="currently-val">{item.val}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .currently {
    border-top: 0.5px solid var(--border);
    padding-top: 2.5rem;
  }

  .currently-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .live-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background-color: #22c55e;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    animation: radar-ping 2.2s ease-in-out infinite;
  }

  @keyframes radar-ping {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(34, 197, 94, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
    }
  }

  .currently-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem 1.5rem;
  }

  .currently-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 10px 14px;
    border-radius: 10px;
    border: 0.5px solid transparent;
    transition:
      transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 0.25s ease,
      background 0.25s ease,
      box-shadow 0.25s ease;
  }

  .currently-item:hover {
    transform: translateY(-2px);
    border-color: var(--border);
    background: var(--bg-outer);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  }

  .currently-key {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
    transition: color 0.2s ease;
  }

  .currently-item:hover .currently-key {
    color: var(--text-secondary);
  }

  .currently-val {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
  }
</style>
