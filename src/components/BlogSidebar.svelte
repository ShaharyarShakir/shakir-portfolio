<script lang="ts">
  import type { TocItem } from '$lib/utils/parseMarkdown';

  interface Props {
    toc: TocItem[];
  }

  let { toc }: Props = $props();
  let activeId = $state<string>('');
  let isCollapsed = $state<boolean>(false);

  $effect(() => {
    if (typeof window === 'undefined' || toc.length === 0) return;
    if (!activeId && toc.length > 0) activeId = toc[0].id;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeId = entry.target.id;
          }
        });
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0.1 }
    );

    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  });

  function scrollToSection(id: string, e: MouseEvent) {
    e.preventDefault();
    activeId = id;

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -95;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
</script>

{#if toc.length > 0}
  <div class="sections-floating-wrapper" class:is-collapsed={isCollapsed}>
    {#if !isCollapsed}
      <div class="sections-card">
        <div class="sections-header">
          <div class="sections-title">
            <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
            <h2>Sections</h2>
          </div>
          <button 
            class="collapse-btn" 
            onclick={() => (isCollapsed = true)} 
            aria-label="Collapse sections"
            title="Collapse sections"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>
        </div>

        <nav class="sections-list">
          {#each toc as item, index}
            <a
              href={`#${item.id}`}
              class="section-item"
              class:active={activeId === item.id}
              onclick={(e) => scrollToSection(item.id, e)}
            >
              <span class="item-num">{index + 1}.</span>
              <span class="item-text">{item.text}</span>
            </a>
          {/each}
        </nav>
      </div>
    {:else}
      <button
        class="expand-toggle-btn"
        onclick={() => (isCollapsed = false)}
        aria-label="Expand sections"
        title="Expand sections"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="11 17 6 12 11 7" />
          <polyline points="18 17 13 12 18 7" />
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .sections-floating-wrapper {
    position: fixed;
    top: 140px;
    right: max(1.5rem, calc(50vw - 640px));
    z-index: 60;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @media (max-width: 1240px) {
    .sections-floating-wrapper {
      right: 1.25rem;
    }
  }

  @media (max-width: 768px) {
    .sections-floating-wrapper {
      bottom: 24px;
      top: auto;
      right: 18px;
    }
  }

  .sections-card {
    width: 260px;
    border-radius: 18px;
    background: rgba(22, 27, 34, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
    overflow: hidden;
    animation: fade-in 0.25s ease-out;
  }

  :global(:not(.dark)) .sections-card {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.08);
  }

  .sections-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 18px 12px;
  }

  .sections-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--text-primary);
  }

  .chevron-icon {
    color: var(--text-primary);
  }

  .sections-title h2 {
    font-family: Georgia, serif, sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    margin: 0;
    letter-spacing: -0.01em;
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .collapse-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  :global(:not(.dark)) .collapse-btn:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .sections-list {
    display: flex;
    flex-direction: column;
    max-height: 380px;
    overflow-y: auto;
  }

  .section-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 18px;
    font-size: 0.85rem;
    color: #94a3b8;
    text-decoration: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    transition: all 0.2s ease;
  }

  :global(:not(.dark)) .section-item {
    color: #64748b;
    border-top-color: rgba(0, 0, 0, 0.06);
  }

  .section-item:hover {
    color: var(--text-primary);
    background: rgba(255, 255, 255, 0.04);
  }

  :global(:not(.dark)) .section-item:hover {
    background: rgba(0, 0, 0, 0.03);
  }

  .section-item.active {
    color: #2dd4bf;
    font-weight: 600;
    background: rgba(45, 212, 191, 0.06);
  }

  :global(:not(.dark)) .section-item.active {
    color: #0d9488;
    background: rgba(13, 148, 136, 0.06);
  }

  .item-num {
    font-weight: 600;
    flex-shrink: 0;
  }

  .item-text {
    line-height: 1.4;
  }

  .expand-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    background: rgba(22, 27, 34, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(16px);
    color: var(--text-primary);
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    transition: all 0.2s ease;
  }

  :global(:not(.dark)) .expand-toggle-btn {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .expand-toggle-btn:hover {
    transform: scale(1.06);
  }

  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
</style>
