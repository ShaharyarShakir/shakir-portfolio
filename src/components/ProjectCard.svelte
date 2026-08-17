<script lang="ts">
  type Props = {
    image: string;
    imageAlt: string;
    title: string;
    description: string;
    techs: { icon: string; label: string }[];
    href?: string;
    github?: string;
  };

  let { image, imageAlt, title, description, techs, href, github }: Props = $props();

  let cardEl: HTMLElement | null = $state(null);
  let mouseX = $state(50);
  let mouseY = $state(50);
  let isHovered = $state(false);

  function handleMouseMove(e: MouseEvent) {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    mouseX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    mouseY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
  }

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
    mouseX = 50;
    mouseY = 50;
  }
</script>

<article
  bind:this={cardEl}
  class={`project-card ${isHovered ? "hovered" : ""}`}
  onmousemove={handleMouseMove}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  style="--mouse-x: {mouseX}%; --mouse-y: {mouseY}%;"
>
  <!-- Mouse Spotlight Glow -->
  <div class="spotlight-glow"></div>

  <!-- Image -->
  <a class="project-img-wrap" href={href ?? "#"} target="_blank" rel="noopener">
    <img src={image} alt={imageAlt} class="project-img" loading="lazy" />
    <div class="shimmer-sweep"></div>
    <div class="project-img-overlay">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
      View Project
    </div>
  </a>

  <!-- Body -->
  <div class="project-body">
    <div class="project-title-row">
      <h3 class="project-title">{title}</h3>
      {#if github}
        <a
          class="project-gh-link"
          href={github}
          target="_blank"
          rel="noopener"
          aria-label="GitHub repo"
        >
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
            <path
              d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
            />
          </svg>
        </a>
      {/if}
    </div>

    <p class="project-desc">{description}</p>

    <!-- Tech icons -->
    <div class="project-techs">
      {#each techs as tech}
        <span class="tech-icon group/icon" title={tech.label}>
          <img src={tech.icon} alt={tech.label} width="22" height="22" />
        </span>
      {/each}
    </div>
  </div>
</article>

<style>
  .project-card {
    position: relative;
    display: flex;
    flex-direction: column;
    border: 0.5px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    background: var(--bg-card);
    transition:
      transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-6px) scale(1.01);
    border-color: var(--text-muted);
    box-shadow:
      0 20px 40px -15px rgba(0, 0, 0, 0.12),
      0 0 0 1px rgba(99, 102, 241, 0.15);
  }

  :global(.dark) .project-card:hover {
    box-shadow:
      0 20px 40px -15px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(168, 85, 247, 0.2);
  }

  /* Spotlight Glow Effect */
  .spotlight-glow {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    background: radial-gradient(
      450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(99, 102, 241, 0.12),
      transparent 80%
    );
  }

  :global(.dark) .spotlight-glow {
    background: radial-gradient(
      450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(168, 85, 247, 0.14),
      transparent 80%
    );
  }

  .project-card.hovered .spotlight-glow {
    opacity: 1;
  }

  /* Image Wrap */
  .project-img-wrap {
    position: relative;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    display: block;
    background: var(--bg-outer);
    z-index: 2;
  }

  .project-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition:
      transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
      filter 0.4s ease;
  }

  .project-card:hover .project-img {
    transform: scale(1.06);
    filter: brightness(0.45);
  }

  /* Shimmer Light Sweep */
  .shimmer-sweep {
    position: absolute;
    top: 0;
    left: -150%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.25),
      transparent
    );
    transform: skewX(-25deg);
    transition: left 0.75s ease;
    pointer-events: none;
  }

  .project-card:hover .shimmer-sweep {
    left: 150%;
  }

  .project-img-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
    opacity: 0;
    transform: translateY(6px);
    transition:
      opacity 0.3s ease,
      transform 0.3s ease;
    pointer-events: none;
  }

  .project-card:hover .project-img-overlay {
    opacity: 1;
    transform: translateY(0);
  }

  /* Body */
  .project-body {
    position: relative;
    z-index: 2;
    padding: 1.1rem 1.2rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
  }

  .project-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .project-title {
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
    transition: color 0.25s ease;
  }

  .project-card:hover .project-title {
    color: var(--text-primary);
  }

  .project-gh-link {
    color: var(--text-muted);
    display: flex;
    align-items: center;
    flex-shrink: 0;
    padding: 4px;
    border-radius: 6px;
    transition:
      color 0.25s ease,
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      background 0.2s ease;
  }

  .project-gh-link:hover {
    color: var(--text-primary);
    transform: rotate(12deg) scale(1.15);
    background: var(--bg-outer);
  }

  .project-desc {
    font-size: 0.9rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
    flex: 1;
  }

  /* Tech icons micro-interactions */
  .project-techs {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  .tech-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 0.5px solid var(--border);
    background: var(--bg-outer);
    transition:
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      border-color 0.25s ease,
      box-shadow 0.25s ease;
  }

  .tech-icon:hover {
    transform: translateY(-4px) scale(1.18);
    border-color: var(--text-muted);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  :global(.dark) .tech-icon:hover {
    box-shadow: 0 6px 16px rgba(255, 255, 255, 0.1);
  }

  .tech-icon img {
    border-radius: 3px;
    transition: transform 0.2s ease;
  }

  .tech-icon:hover img {
    transform: scale(1.08);
  }
</style>