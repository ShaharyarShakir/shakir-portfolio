<script lang="ts">
  import { profileData } from '$lib/data/profile';
  import Timeline from '../../components/Timeline.svelte';
  import Currently from '../../components/Currently.svelte';
  import SEO from '../../components/SEO.svelte';

  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": "About Shaharyar Shakir",
    "description": profileData.lead,
    "mainEntity": {
      "@type": "Person",
      "name": "Shaharyar Shakir",
      "jobTitle": "Software Engineer & DevOps Specialist"
    }
  };
</script>

<SEO title="About" description={profileData.lead} jsonLd={aboutJsonLd} />

<div class="py-8 pb-12">
  <!-- Header -->
  <div class="mb-14 pb-10 border-b border-[var(--border)]">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
      About
    </h1>
    <p class="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-xl mb-5">
      {profileData.lead}
    </p>
    <div class="flex gap-5">
      <a href={profileData.github} target="_blank" rel="noopener" class="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors">
        github ↗
      </a>
      <a href={profileData.linkedin} target="_blank" rel="noopener" class="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] no-underline transition-colors">
        linkedin ↗
      </a>
    </div>
  </div>

  <!-- Timeline -->
  <div class="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-6">
    the journey
  </div>
  <Timeline timeline={profileData.timeline} />

  <!-- Currently -->
  <Currently items={profileData.currently} />
</div>
