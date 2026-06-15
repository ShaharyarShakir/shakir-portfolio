<script lang="ts">
    import ProjectCard from './ProjectCard.svelte';
  
    type Project = {
      image: string;
      imageAlt: string;
      title: string;
      description: string;
      techs: { icon: string; label: string }[];
      href?: string;
      github?: string;
    };
  
    type Props = {
      projects: Project[];
      limit?: number;        // home page shows 3, projects page shows all
    };
  
    let { projects, limit }: Props = $props();
  
    const visible = $derived(limit ? projects.slice(0, limit) : projects);
  </script>
  
  <div class="project-grid">
    {#each visible as project}
      <ProjectCard {...project} />
    {/each}
  </div>
  
  <style>
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }
  </style>