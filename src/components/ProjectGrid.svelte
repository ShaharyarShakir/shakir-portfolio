<script lang="ts">
  import ProjectCard from "./ProjectCard.svelte";

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
    limit?: number;
  };

  let { projects, limit }: Props = $props();

  const visible = $derived(limit ? projects.slice(0, limit) : projects);
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {#each visible as project}
    <ProjectCard {...project} />
  {/each}
</div>
