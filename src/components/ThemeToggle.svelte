<script lang="ts">
  import { theme } from "../lib/stores/theme";

  let isToggling = $state(false);

  function toggle() {
    isToggling = true;
    theme.update((t) => (t === "light" ? "dark" : "light"));
    setTimeout(() => {
      isToggling = false;
    }, 450);
  }
</script>

<button
  class={`theme-toggle ${isToggling ? "toggling" : ""}`}
  onclick={toggle}
  aria-label="Toggle theme"
>
  <div class="theme-aura"></div>
  <div class="icon-wrap">
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
  </div>
</button>

<style>
  .theme-toggle {
    position: relative;
    background: none;
    border: 0.5px solid var(--border);
    border-radius: 9px;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition:
      color 0.25s ease,
      border-color 0.25s ease,
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      background 0.25s ease;
  }

  .theme-aura {
    position: absolute;
    inset: -4px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(245, 158, 11, 0.4) 0%,
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  :global(.dark) .theme-aura {
    background: radial-gradient(
      circle,
      rgba(99, 102, 241, 0.45) 0%,
      transparent 70%
    );
  }

  .theme-toggle:hover {
    color: var(--text-primary);
    border-color: var(--text-muted);
    transform: scale(1.1) rotate(12deg);
    background: var(--bg-outer);
  }

  .theme-toggle:hover .theme-aura {
    opacity: 1;
  }

  .theme-toggle:active {
    transform: scale(0.92);
  }

  .icon-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .theme-toggle.toggling .icon-wrap {
    transform: rotate(360deg) scale(1.25);
  }

  .theme-toggle svg {
    display: block;
  }
</style>
