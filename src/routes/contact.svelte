<script lang="ts">
  const socials = [
    {
      label: 'GitHub',
      handle: '@ShaharyarShakir',
      href: 'https://github.com/ShaharyarShakir',
      desc: 'code & projects',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
      </svg>`,
    },
    {
      label: 'LinkedIn',
      handle: 'shaharyar-shakir',
      href: 'https://linkedin.com/in/shaharyar-shakir-3674a027b',
      desc: 'professional profile',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>`,
    },
    {
      label: 'Twitter / X',
      handle: '@yourhandle',
      href: 'https://x.com/ShaharyarShakir',
      desc: 'thoughts & updates',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4l16 16M4 20L20 4"/>
      </svg>`,
    },
    {
      label: 'WhatsApp',
      handle: '+92 03326724511',
      href: 'https://wa.me/923326724511',
      desc: 'fastest way to reach me',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>`,
    },
    {
      label: 'Email',
      handle: 'shakirshaharyar125@email.com',
      href: 'mailto:your@email.com',
      desc: 'for detailed inquiries',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>`,
    },
  ];

  let form = $state({ name: '', email: '', subject: '', message: '' });
  let status: 'idle' | 'sending' | 'sent' | 'error' = $state('idle');

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    status = 'sending';
    try {
      const res = await fetch('https://formspree.io/f/xykaoknk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        status = 'sent';
        form = { name: '', email: '', subject: '', message: '' };
      } else {
        status = 'error';
      }
    } catch {
      status = 'error';
    }
  }
</script>

<div class="contact-wrap">

  <!-- Header -->
  <div class="contact-header">
    <h1 class="contact-title">Let's Talk</h1>
    <p class="contact-lead">
      Open to <span class="span-text">Remote Roles</span>,Freelance projects, and collabs.
      pick your preferred channel — i try to respond within 24 hours.
    </p>
  </div>

  <!-- Social cards -->
  <div class="social-grid">
    {#each socials as social}
      <a class="social-card" href={social.href} target="_blank" rel="noopener">
        <div class="social-top">
          <span class="social-icon">{@html social.icon}</span>
          <svg class="social-arrow" width="16" height="16" viewBox="0 0 16 16"
            fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
            <path d="M3 13L13 3M13 3H6M13 3v7"/>
          </svg>
        </div>
        <div class="social-body">
          <span class="social-label">{social.label}</span>
          <span class="social-handle">{social.handle}</span>
          <span class="social-desc">{social.desc}</span>
        </div>
      </a>
    {/each}
  </div>

  <!-- Contact form -->
  <div class="form-section">
    <p class="form-label">Send a message</p>

    {#if status === 'sent'}
      <div class="form-success">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        message sent — i'll get back to you soon.
      </div>
    {:else}
      <div class="form-wrap">
        <div class="form-row">
          <div class="form-field">
            <label for="name">name</label>
            <input
              id="name"
              type="text"
              placeholder="your name"
              bind:value={form.name}
              disabled={status === 'sending'}
            />
          </div>
          <div class="form-field">
            <label for="email">email</label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              bind:value={form.email}
              disabled={status === 'sending'}
            />
          </div>
        </div>

        <div class="form-field">
          <label for="subject">subject</label>
          <input
            id="subject"
            type="text"
            placeholder="what's this about?"
            bind:value={form.subject}
            disabled={status === 'sending'}
          />
        </div>

        <div class="form-field">
          <label for="message">message</label>
          <textarea
            id="message"
            rows="5"
            placeholder="tell me what you're working on..."
            bind:value={form.message}
            disabled={status === 'sending'}
          ></textarea>
        </div>

        {#if status === 'error'}
          <p class="form-error">something went wrong — try emailing directly instead.</p>
        {/if}

        <button
          class="form-submit"
          onclick={handleSubmit}
          disabled={status === 'sending' || !form.name || !form.email || !form.message}
        >
          {#if status === 'sending'}
            <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            sending...
          {:else}
            send message
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          {/if}
        </button>
      </div>
    {/if}
  </div>

  <!-- Availability -->
  <div class="availability">
    <span class="avail-dot"></span>
    <span>Available for work — Based in <span class="span-text">Pakistan</span>, open to remote worldwide</span>
  </div>

</div>

<style>
  .contact-wrap {
    padding: 2rem 0 3rem;
  }

  /* ── Header ── */
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

  /* ── Social grid ── */
  .social-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 3rem;
  }

  .social-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.4rem;
    padding: 1.25rem;
    border: 0.5px solid var(--border);
    border-radius: 12px;
    background: var(--bg-card);
    text-decoration: none;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .social-card:hover {
    transform: translateY(-4px);
    border-color: var(--text-muted);
    box-shadow: 0 10px 32px rgba(0, 0, 0, 0.07);
  }

  .social-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .social-icon { color: var(--text-primary); display: flex; }

  .social-arrow {
    color: var(--text-muted);
    flex-shrink: 0;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s;
  }

  .social-card:hover .social-arrow {
    transform: translate(2px, -2px);
    color: var(--text-primary);
  }

  .social-body { display: flex; flex-direction: column; gap: 3px; }
  .social-label { font-size: 0.95rem; font-weight: 600; color: var(--text-primary); }
  .social-handle { font-size: 0.82rem; color: var(--text-secondary); font-family: monospace; }
  .social-desc { font-size: 0.78rem; color: var(--text-muted); margin-top: 2px; }

  /* ── Form section ── */
  .form-section {
    padding-top: 2.5rem;
    border-top: 0.5px solid var(--border);
    margin-bottom: 2.5rem;
  }

  .form-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 1.5rem;
  }

  .form-wrap {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 560px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 500px) {
    .form-row { grid-template-columns: 1fr; }
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-field label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    text-transform: lowercase;
  }

  .form-field input,
  .form-field textarea {
    background: var(--bg-outer);
    border: 0.5px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 0.9rem;
    color: var(--text-primary);
    font-family: inherit;
    width: 100%;
    resize: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    outline: none;
  }

  .form-field input::placeholder,
  .form-field textarea::placeholder {
    color: var(--text-muted);
  }

  .form-field input:focus,
  .form-field textarea:focus {
    border-color: var(--text-secondary);
    box-shadow: 0 0 0 3px rgba(74, 71, 69, 0.08);
  }

  .form-field input:disabled,
  .form-field textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Submit button ── */
  .form-submit {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 10px 20px;
    border-radius: 8px;
    border: 0.5px solid var(--border);
    background: var(--text-primary);
    color: var(--bg-card);
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .form-submit:hover:not(:disabled) {
    opacity: 0.85;
    transform: translateY(-1px);
  }

  .form-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  /* ── States ── */
  .form-success {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    padding: 14px 16px;
    border: 0.5px solid var(--border);
    border-radius: 8px;
    background: var(--bg-outer);
    max-width: 560px;
  }

  .form-error {
    font-size: 0.82rem;
    color: #e05a5a;
    margin: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  /* ── Availability ── */
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
    0%   { box-shadow: 0 0 0 0   rgba(74, 222, 128, 0.4); }
    70%  { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0);   }
    100% { box-shadow: 0 0 0 0   rgba(74, 222, 128, 0);   }
  }
</style>