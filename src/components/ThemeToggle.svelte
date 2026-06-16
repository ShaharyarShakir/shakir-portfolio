<script lang="ts">
  import { theme } from "../lib/stores/theme";

  function toggle() {
    theme.update((t) => (t === "light" ? "dark" : "light"));
  }
</script>

<button class="theme-toggle" onclick={toggle} aria-label="Toggle theme">
  {#if $theme === "dark"}
    <!-- sun -->
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  {:else}
    <!-- moon -->
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    background: none;
    border: 0.5px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
      background 0.2s ease;
  }

  .theme-toggle:hover {
    color: var(--text-primary);
    border-color: var(--text-muted);
    transform: scale(1.1) rotate(12deg);
    background: var(--bg-outer);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }

  .theme-toggle svg {
    display: block;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
