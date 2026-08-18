<script lang="ts">
  type Props = {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
    type?: 'website' | 'article';
    jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  };

  let {
    title = 'Shaharyar Shakir | Web Developer, DevOps, MLOps & Mobile Developer',
    description = 'Shaharyar Shakir is a Full-Stack Web Developer, DevOps Engineer, MLOps Specialist & React Native Mobile Developer based in Pakistan. Delivering scalable web apps, cloud pipelines, AI integrations, and mobile software.',
    keywords = 'Shaharyar Shakir, Web Developer Pakistan, DevOps Engineer Pakistan, MLOps Specialist, React Native Mobile Developer, Full Stack Web Development, Cloud Infrastructure, Docker, Kubernetes, SvelteKit, TypeScript, Python, Software Engineer Portfolio',
    ogImage = '/images/avatar.jpg',
    canonicalUrl = 'https://shaharyarshakir.dev',
    type = 'website',
    jsonLd
  }: Props = $props();

  const formattedTitle = $derived(
    title.includes('Shaharyar Shakir') ? title : `${title} | Shaharyar Shakir`
  );
</script>

<svelte:head>
  <title>{formattedTitle}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content="Shaharyar Shakir" />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Geo & Local SEO Meta Tags -->
  <meta name="geo.region" content="PK" />
  <meta name="geo.placename" content="Pakistan" />
  <meta name="address" content="Pakistan" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={formattedTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="Shaharyar Shakir — Web Dev, DevOps & MLOps Services" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={formattedTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- JSON-LD Structured Data -->
  {#if jsonLd}
    <script type="application/ld+json">
      {@html JSON.stringify(jsonLd)}
    </script>
  {/if}
</svelte:head>
