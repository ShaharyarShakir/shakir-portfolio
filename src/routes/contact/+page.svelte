<script lang="ts">
  import { socialsData } from '$lib/data/socials';
  import SocialGrid from '../../components/SocialGrid.svelte';
  import ContactForm from '../../components/ContactForm.svelte';
  import SEO from '../../components/SEO.svelte';

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Shaharyar Shakir",
    "description": "Get in touch with Shaharyar Shakir for freelance software development, DevOps engineering, or full-stack projects."
  };
</script>

<SEO
  title="Contact"
  description="Reach out to Shaharyar Shakir for remote software engineering roles, DevOps consulting, or project collaborations."
  jsonLd={contactJsonLd}
/>

<div class="py-8 pb-12">
  <!-- Header -->
  <div class="mb-12 pb-10 border-b border-[var(--border)]">
    <h1 class="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
      Let's Talk
    </h1>
    <p class="text-base leading-relaxed text-[var(--text-secondary)] max-w-lg m-0">
      Open to <span class="font-semibold text-[var(--text-primary)]">Remote Roles</span>, Freelance projects,
      and collabs. Pick your preferred channel — I try to respond within 24
      hours.
    </p>
  </div>

  <!-- Social cards -->
  <SocialGrid socials={socialsData} />

  <!-- Contact form -->
  <ContactForm />

  <!-- Availability -->
  <div class="flex items-center gap-2.5 text-sm text-[var(--text-muted)] pt-8 border-t border-[var(--border)]">
    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-status-pulse shrink-0"></span>
    <span>
      Available for work — Based in <span class="font-semibold text-[var(--text-primary)]">Pakistan</span>,
      open to remote worldwide
    </span>
  </div>
</div>
