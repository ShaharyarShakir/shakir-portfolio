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
  </script>
  
  <article class="project-card">
    <!-- Image -->
    <a class="project-img-wrap" href={href ?? '#'} target="_blank" rel="noopener">
      <img src={image} alt={imageAlt} class="project-img" loading="lazy" />
      <div class="project-img-overlay">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        View Project
      </div>
    </a>
  
    <!-- Body -->
    <div class="project-body">
      <div class="project-title-row">
        <h3 class="project-title">{title}</h3>
        {#if github}
          <a class="project-gh-link" href={github} target="_blank" rel="noopener" aria-label="GitHub repo">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
        {/if}
      </div>
  
      <p class="project-desc">{description}</p>
  
      <!-- Tech icons -->
      <div class="project-techs">
        {#each techs as tech}
          <span class="tech-icon" title={tech.label}>
            <img src={tech.icon} alt={tech.label} width="22" height="22" />
          </span>
        {/each}
      </div>
    </div>
  </article>
  
  <style>
    .project-card {
      display: flex;
      flex-direction: column;
      border: 0.5px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      background: var(--bg-card);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                  border-color 0.3s ease;
    }
  
    .project-card:hover {
      transform: translateY(-4px);
      border-color: var(--text-muted);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }
  
    /* Image */
    .project-img-wrap {
      position: relative;
      overflow: hidden;
      aspect-ratio: 16 / 9;
      display: block;
      background: var(--bg-outer);
    }
  
    .project-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                  filter 0.4s ease;
    }
  
    .project-img-wrap:hover .project-img {
      transform: scale(1.04);
      filter: brightness(0.45);
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
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
  
    .project-img-wrap:hover .project-img-overlay {
      opacity: 1;
    }
  
    /* Body */
    .project-body {
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
    }
  
    .project-gh-link {
      color: var(--text-muted);
      display: flex;
      align-items: center;
      flex-shrink: 0;
      transition: color 0.2s ease, transform 0.2s ease;
    }
  
    .project-gh-link:hover {
      color: var(--text-primary);
      transform: translateY(-1px);
    }
  
    .project-desc {
      font-size: 0.9rem;
      line-height: 1.7;
      color: var(--text-secondary);
      margin: 0;
      flex: 1;
    }
  
    /* Tech icons */
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
      width: 30px;
      height: 30px;
      border-radius: 6px;
      border: 0.5px solid var(--border);
      background: var(--bg-outer);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
  
    .tech-icon:hover {
      transform: translateY(-2px);
      border-color: var(--text-muted);
    }
  
    .tech-icon img {
      border-radius: 3px;
    }
  </style>