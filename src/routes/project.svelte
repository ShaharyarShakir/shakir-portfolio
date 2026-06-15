<script lang="ts">
  import ProjectGrid from "../components/ProjectGrid.svelte";
  import {projects } from  "../lib/data/projects";
</script>

<h1 class="page-title">Projects</h1>
<ProjectGrid {projects} />

<style>
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 2rem;
  }
</style>