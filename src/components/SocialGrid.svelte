<script lang="ts">
  import type { SocialLink } from '$lib/data/socials';

  interface Props {
    socials: SocialLink[];
  }

  let { socials }: Props = $props();
</script>

<div class="social-grid">
  {#each socials as social}
    <a class="social-card group" href={social.href} target="_blank" rel="noopener">
      <div class="social-top">
        <span class="social-icon">{@html social.icon}</span>
        <svg
          class="social-arrow"
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
      <div class="social-body">
        <span class="social-label">{social.label}</span>
        <span class="social-handle">{social.handle}</span>
        <span class="social-desc">{social.desc}</span>
      </div>
    </a>
  {/each}
</div>

<style>
  .social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .social-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.4rem;
    padding: 1.25rem;
    border: 0.5px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    text-decoration: none;
    transition:
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 0.3s ease,
      box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .social-card:hover {
    transform: translateY(-6px) scale(1.02);
    border-color: var(--text-muted);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.09);
  }

  :global(.dark) .social-card:hover {
    box-shadow: 0 12px 36px rgba(99, 102, 241, 0.15);
  }

  .social-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .social-icon {
    color: var(--text-primary);
    display: flex;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .social-card:hover .social-icon {
    transform: scale(1.18) rotate(6deg);
  }

  .social-arrow {
    color: var(--text-muted);
    flex-shrink: 0;
    transition:
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      color 0.25s ease;
  }

  .social-card:hover .social-arrow {
    transform: translate(4px, -4px) scale(1.15);
    color: var(--text-primary);
  }

  .social-body {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .social-label {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    transition: color 0.2s ease;
  }

  .social-handle {
    font-size: 0.82rem;
    color: var(--text-secondary);
    font-family: monospace;
  }

  .social-desc {
    font-size: 0.78rem;
    color: var(--text-muted);
    margin-top: 2px;
  }
</style>
