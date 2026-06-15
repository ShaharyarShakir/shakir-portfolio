<script lang="ts">
  const timeline = [
    {
      year: '2026 — now',
      title: 'building in public',
      body: 'actively working across devops, mlops, full-stack, and react native. shipping the 200 projects repo, applying to remote roles, and sharpening skills daily.',
      tags: ['devops', 'mlops', 'react native', 'full stack'],
    },
    {
      year: '2025',
      title: 'went deep on cloud & infra',
      body: 'built vprofile — an end-to-end devops pipeline with jenkins, docker, kubernetes on aws eks, rds, and route 53. this is where infra clicked for me.',
      tags: ['aws', 'kubernetes', 'jenkins', 'docker'],
    },
    {
      year: '2026',
      title: 'discovered mlops',
      body: 'built a youtube sentiment analysis pipeline using dvc, mlflow, and lightgbm. shipped a chrome extension that surfaces scores on any video.',
      tags: ['dvc', 'mlflow', 'lightgbm', 'fastapi'],
    },
    {
      year: '2024',
      title: 'started CS',
      body: 'enrolled in bs computer science. started with the fundamentals and immediately started building things on the side.',
      tags: ['university',  'bs cs'],
    },
    {
      year: '2023',
      title: 'wrote my first line of code',
      body: 'started with webdev. realized quickly that building things was more interesting than studying theory. never looked back.',
      tags: ['js', 'svelte', 'react', 'beginnings'],
    },
  ];
</script>

<div class="about-wrap">

  <!-- Header -->
  <div class="about-header">
    <h1 class="about-title">About</h1>
    <p class="about-lead">
      I'm Shaharyar — a CS student and hands-on builder based in pakistan.
      I work across DevOps, MlOps, Full-Stack Web, and React Native.
      I care about shipping real things, not collecting certificates.
    </p>
    <div class="about-links">
      <a href="https://github.com/ShaharyarShakir" target="_blank" rel="noopener">
        github ↗
      </a>
      <a href="https://linkedin.com/in/shaharyar-shakir-3674a027b" target="_blank" rel="noopener">
        linkedin ↗
      </a>
    </div>
  </div>

  <!-- Timeline -->
  <div class="timeline-label">the journey</div>
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

  <!-- Currently -->
  <div class="currently">
    <div class="currently-label">Currently</div>
    <div class="currently-grid">
      <div class="currently-item">
        <span class="currently-key">Studying</span>
        <span class="currently-val">BS CS — 2028</span>
      </div>
      <div class="currently-item">
        <span class="currently-key">Building</span>
        <span class="currently-val">200 projects repo</span>
      </div>
      <div class="currently-item">
        <span class="currently-key">Targeting</span>
        <span class="currently-val">Remote roles & Internships</span>
      </div>
      <div class="currently-item">
        <span class="currently-key">Location</span>
        <span class="currently-val">Pakistan 🇵🇰</span>
      </div>
      
    </div>
  </div>

</div>

<style>
  .about-wrap {
    padding: 2rem 0 3rem;
  }

  /* ── Header ── */
  .about-header {
    margin-bottom: 3.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 0.5px solid var(--border);
  }

  .about-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 1rem;
  }

  .about-lead {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 540px;
    margin: 0 0 1.2rem;
  }

  .about-links {
    display: flex;
    gap: 1.2rem;
  }

  .about-links a {
    font-size: 0.875rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.2s;
  }

  .about-links a:hover {
    color: var(--text-primary);
  }

  /* ── Timeline label ── */
  /* ── Timeline ── */
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

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.timeline-item:hover {
  transform: translateX(8px) scale(1.02);
}

/* Spine */
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

  transition:
    background 0.25s ease,
    transform 0.25s ease,
    box-shadow 0.25s ease;
}

.timeline-item:hover .timeline-dot {
  background: var(--text-primary);
  transform: scale(1.5);

  box-shadow:
    0 0 0 6px rgba(255, 255, 255, 0.05),
    0 0 18px rgba(255, 255, 255, 0.08);
}

.timeline-line {
  width: 1px;
  flex: 1;
  background: var(--border);
  margin: 6px 0;
  min-height: 32px;
}

/* Content */
.timeline-content {
  padding: 0.9rem 1rem 2rem;
  margin-left: -1rem;
  border-radius: 12px;

  transition:
    background 0.25s ease,
    transform 0.25s ease;
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

  transition:
    color 0.25s ease,
    transform 0.25s ease;
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

/* Tags */
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

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease;
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

 

  /* ── Currently ── */
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
  }

  .currently-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem 1.5rem;
  }

  .currently-item {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .currently-key {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .currently-val {
    font-size: 0.9rem;
    color: var(--text-primary);
    font-weight: 500;
  }
</style>