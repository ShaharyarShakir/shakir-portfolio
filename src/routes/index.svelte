<script lang="ts">

  import Hero from "../components/Hero.svelte";
    import ProjectGrid from "../components/ProjectGrid.svelte";
    import {projects } from  "../lib/data/projects";
    import { p } from 'sv-router/generated';
 </script>

<Hero />
<section>
  <div class="section-header">
    <h2 class="section-title">selected work</h2>
    <a href={p('/project')} class="see-all">see all →</a>
  </div>
  <ProjectGrid {projects} limit={2} />
</section>

<style>
  .section-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }
  .section-title {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0;
  }
  .see-all {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.2s;
  }
  .see-all:hover { color: var(--text-primary); }
</style>