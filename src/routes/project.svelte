<script lang="ts">
  import ProjectGrid from "../components/ProjectGrid.svelte";
  import { projects } from "../lib/data/projects";
</script>

<h1 class="page-title">Projects</h1>

<section class="philosophy">
  <p class="philosophy-intro">how i think about building</p>
  <div class="philosophy-grid">
    <div class="philosophy-item">
      <span class="philosophy-num">01</span>
      <h3>solve a real problem</h3>
      <p>every project starts with a problem worth solving — not a stack worth showing off. the tech follows the need.</p>
    </div>
    <div class="philosophy-item">
      <span class="philosophy-num">02</span>
      <h3>ship fast, iterate faster</h3>
      <p>a working v1 beats a perfect v0. i get something live early, then refine based on real feedback.</p>
    </div>
    <div class="philosophy-item">
      <span class="philosophy-num">03</span>
      <h3>own the full stack</h3>
      <p>from infra to ui — i care about how it's deployed as much as how it looks. no black boxes.</p>
    </div>
  </div>
</section>

<ProjectGrid {projects} />

<style>
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 2.5rem;
  }

  .philosophy {
    margin-bottom: 3.5rem;
    padding-bottom: 3rem;
    border-bottom: 0.5px solid var(--border);
  }

  .philosophy-intro {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 1.5rem;
  }

  .philosophy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }

  .philosophy-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .philosophy-num {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    font-variant-numeric: tabular-nums;
  }

  .philosophy-item h3 {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
    line-height: 1.3;
  }

  .philosophy-item p {
    font-size: 0.875rem;
    line-height: 1.7;
    color: var(--text-secondary);
    margin: 0;
  }
</style>