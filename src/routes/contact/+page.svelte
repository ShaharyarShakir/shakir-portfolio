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

<div class="contact-wrap">
  <!-- Header -->
  <div class="contact-header">
    <h1 class="contact-title">Let's Talk</h1>
    <p class="contact-lead">
      Open to <span class="span-text">Remote Roles</span>, Freelance projects,
      and collabs. Pick your preferred channel — I try to respond within 24
      hours.
    </p>
  </div>

  <!-- Social cards -->
  <SocialGrid socials={socialsData} />

  <!-- Contact form -->
  <ContactForm />

  <!-- Availability -->
  <div class="availability">
    <span class="avail-dot"></span>
    <span>
      Available for work — Based in <span class="span-text">Pakistan</span>,
      open to remote worldwide
    </span>
  </div>
</div>

<style>
  .contact-wrap {
    padding: 2rem 0 3rem;
  }

  .contact-header {
    margin-bottom: 3rem;
    padding-bottom: 2.5rem;
    border-bottom: 0.5px solid var(--border);
  }

  .contact-title {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: -0.02em;
    margin: 0 0 0.9rem;
  }

  .contact-lead {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--text-secondary);
    max-width: 460px;
    margin: 0;
  }

  .availability {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.85rem;
    color: var(--text-muted);
    padding-top: 2rem;
    border-top: 0.5px solid var(--border);
  }

  .avail-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    flex-shrink: 0;
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
    animation: pulse 2.2s ease infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
    }
    70% {
      box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
    }
  }
</style>
