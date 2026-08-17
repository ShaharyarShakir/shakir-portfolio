<script lang="ts">
  type Props = {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
    type?: 'website' | 'article';
    jsonLd?: Record<string, any> | Record<string, any>[];
  };

  let {
    title = 'Shaharyar Shakir | Software Engineer & DevOps',
    description = 'Full-stack software engineer & DevOps practitioner specializing in Docker, Kubernetes, Next.js, SvelteKit, and AI Agent integrations.',
    keywords = 'Shaharyar Shakir, Software Engineer, DevOps, Full-Stack, Docker, Kubernetes, SvelteKit, TypeScript, Python, Portfolio',
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

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content={type} />
  <meta property="og:title" content={formattedTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:site_name" content="Shaharyar Shakir Portfolio" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={formattedTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- JSON-LD Structured Data -->
  {#if jsonLd}
    {@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
  {/if}
</svelte:head>
