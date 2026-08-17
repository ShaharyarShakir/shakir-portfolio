<script lang="ts">
  import type { TimelineEntry } from '$lib/data/profile';

  interface Props {
    timeline: TimelineEntry[];
  }

  let { timeline }: Props = $props();
</script>

<div class="timeline">
  {#each timeline as entry, i}
    <div class="timeline-item">
      <!-- Line + dot -->
      <div class="timeline-spine">
        <div class="timeline-dot"></div>
        {#if i < timeline.length - 1}
          <div class="timeline-line"></div>
        {/if}
      </div>

      <!-- Content -->
      <div class="timeline-content">
        <span class="timeline-year">{entry.year}</span>
        <h3 class="timeline-title">{entry.title}</h3>
        <p class="timeline-body">{entry.body}</p>
        <div class="timeline-tags">
          {#each entry.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .timeline {
    display: flex;
    flex-direction: column;
    margin-bottom: 3.5rem;
  }

  .timeline:hover .timeline-item {
    opacity: 0.45;
  }

  .timeline:hover .timeline-item:hover {
    opacity: 1;
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 0 1.25rem;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }

  .timeline-item:hover {
    transform: translateX(8px) scale(1.02);
  }

  .timeline-spine {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4px;
  }

  .timeline-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    border: 2px solid var(--text-primary);
    background: var(--bg-card);
    flex-shrink: 0;
    transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  }

  .timeline-item:hover .timeline-dot {
    background: var(--text-primary);
    transform: scale(1.5);
    box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.05), 0 0 18px rgba(255, 255, 255, 0.08);
  }

  .timeline-line {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin: 6px 0;
    min-height: 32px;
  }

  .timeline-content {
    padding: 0.9rem 1rem 2rem;
    margin-left: -1rem;
    border-radius: 12px;
    transition: background 0.25s ease, transform 0.25s ease;
  }

  .timeline-item:hover .timeline-content {
    background: var(--bg-card);
  }

  .timeline-year {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.35rem;
    transition: color 0.25s ease;
  }

  .timeline-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 0.5rem;
    line-height: 1.3;
    transition: color 0.25s ease, transform 0.25s ease;
  }

  .timeline-body {
    font-size: 0.9rem;
    line-height: 1.75;
    color: var(--text-secondary);
    margin: 0 0 0.8rem;
    transition: color 0.25s ease;
  }

  .timeline-item:hover .timeline-title {
    transform: translateX(2px);
  }

  .timeline-item:hover .timeline-body {
    color: var(--text-primary);
  }

  .timeline-item:hover .timeline-year {
    color: var(--text-secondary);
  }

  .timeline-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .tag {
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    border: 0.5px solid var(--border);
    border-radius: 4px;
    padding: 2px 8px;
    background: var(--bg-outer);
    transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
  }

  .timeline-item:hover .tag {
    transform: translateY(-2px);
    cursor: pointer;
    border-color: var(--text-muted);
    color: var(--text-secondary);
  }

  .tag:hover {
    transform: translateY(-3px);
    cursor: pointer;
  }
</style>
