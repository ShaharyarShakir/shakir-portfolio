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

<div class="about-wrap">
  <!-- Header -->
  <div class="about-header">
    <h1 class="about-title">About</h1>
    <p class="about-lead">
      {profileData.lead}
    </p>
    <div class="about-links">
      <a href={profileData.github} target="_blank" rel="noopener">
        github ↗
      </a>
      <a href={profileData.linkedin} target="_blank" rel="noopener">
        linkedin ↗
      </a>
    </div>
  </div>

  <!-- Timeline -->
  <div class="timeline-label">the journey</div>
  <Timeline timeline={profileData.timeline} />

  <!-- Currently -->
  <Currently items={profileData.currently} />
</div>

<style>
  .about-wrap {
    padding: 2rem 0 3rem;
  }

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

  .timeline-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1.5rem;
  }
</style>
