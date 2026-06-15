<script lang="ts">
    const techs = [
      { icon: 'https://cdn.simpleicons.org/docker', label: 'Docker' },
      { icon: 'https://cdn.simpleicons.org/kubernetes', label: 'Kubernetes' },
      { icon: 'https://cdn.simpleicons.org/cloudflareworkers', label: 'Cloudflare' },
      { icon: 'https://cdn.simpleicons.org/jenkins', label: 'Jenkins' },
      { icon: 'https://cdn.simpleicons.org/terraform', label: 'Terraform' },
      { icon: 'https://cdn.simpleicons.org/python', label: 'Python' },
      { icon: 'https://cdn.simpleicons.org/mlflow', label: 'MLflow' },
      { icon: 'https://cdn.simpleicons.org/dvc', label: 'DVC' },
      { icon: 'https://cdn.simpleicons.org/fastapi', label: 'FastAPI' },
      { icon: 'https://cdn.simpleicons.org/react', label: 'React' },
      { icon: 'https://cdn.simpleicons.org/typescript', label: 'TypeScript' },
      { icon: 'https://cdn.simpleicons.org/nextdotjs/000000', label: 'Next.js' },
      { icon: 'https://cdn.simpleicons.org/postgresql', label: 'PostgreSQL' },
      { icon: 'https://cdn.simpleicons.org/mongodb', label: 'MongoDB' },
      { icon: 'https://cdn.simpleicons.org/supabase', label: 'Supabase' },
      { icon: 'https://cdn.simpleicons.org/redis', label: 'Redis' },
      { icon: 'https://cdn.simpleicons.org/nginx', label: 'Nginx' },
      { icon: 'https://cdn.simpleicons.org/git', label: 'Git' },
    ];
  
    // duplicate for seamless loop
    const track = [...techs, ...techs];
  </script>
  
  <section class="tech-section">
    <p class="tech-label">stack</p>
  
    <div class="scroll-wrap">
      <!-- left + right blur masks -->
      <div class="fade fade-left"></div>
      <div class="fade fade-right"></div>
  
      <div class="scroll-track">
        {#each track as tech}
          <div class="tech-pill">
            <img src={tech.icon} alt={tech.label} width="20" height="20" />
            <span>{tech.label}</span>
          </div>
        {/each}
      </div>
    </div>
  </section>
  
  <style>
    .tech-section {
      margin: 3rem 0;
    }
  
    .tech-label {
      font-size: 0.72rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin: 0 0 1.25rem;
    }
  
    /* ── Outer wrapper: clips overflow + holds the fade masks ── */
    .scroll-wrap {
      position: relative;
      overflow: hidden;
    }
  
    /* ── Fade masks ── */
    .fade {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 120px;
      z-index: 2;
      pointer-events: none;
    }
  
    .fade-left {
      left: 0;
      background: linear-gradient(
        to right,
        var(--bg-card) 0%,
        transparent 100%
      );
    }
  
    .fade-right {
      right: 0;
      background: linear-gradient(
        to left,
        var(--bg-card) 0%,
        transparent 100%
      );
    }
  
    /* ── Scrolling track ── */
    .scroll-track {
      display: flex;
      gap: 10px;
      width: max-content;
      padding: 6px 0;
      animation: scroll-left 28s linear infinite;
    }
  
    .scroll-track:hover {
      animation-play-state: paused;
    }
  
    @keyframes scroll-left {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
  
    /* ── Individual pill ── */
    .tech-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 100px;
      border: 0.5px solid var(--border);
      background: var(--bg-outer);
      white-space: nowrap;
      transition: border-color 0.2s ease, transform 0.2s ease;
    }
  
    .tech-pill:hover {
      border-color: var(--text-muted);
      transform: translateY(-2px);
    }
  
    .tech-pill span {
      font-size: 0.82rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
  
    .tech-pill img {
      display: block;
      border-radius: 3px;
    }
  </style>