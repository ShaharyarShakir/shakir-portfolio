<script lang="ts">
  let form = $state({ name: "", email: "", subject: "", message: "" });
  let status: "idle" | "sending" | "sent" | "error" = $state("idle");

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    status = "sending";
    try {
      const res = await fetch("https://formspree.io/f/xykaoknk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        status = "sent";
        form = { name: "", email: "", subject: "", message: "" };
      } else {
        status = "error";
      }
    } catch {
      status = "error";
    }
  }
</script>

<div class="form-section">
  <p class="form-label">Send a message</p>

  {#if status === "sent"}
    <div class="form-success">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
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
            disabled={status === "sending"}
          />
        </div>
        <div class="form-field">
          <label for="email">email</label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            bind:value={form.email}
            disabled={status === "sending"}
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
          disabled={status === "sending"}
        />
      </div>

      <div class="form-field">
        <label for="message">message</label>
        <textarea
          id="message"
          rows="5"
          placeholder="tell me what you're working on..."
          bind:value={form.message}
          disabled={status === "sending"}
        ></textarea>
      </div>

      {#if status === "error"}
        <p class="form-error">
          something went wrong — try emailing directly instead.
        </p>
      {/if}

      <button
        class="form-submit"
        onclick={handleSubmit}
        disabled={status === "sending" ||
          !form.name ||
          !form.email ||
          !form.message}
      >
        {#if status === "sending"}
          <svg
            class="spin"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          sending...
        {:else}
          send message
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
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
    .form-row {
      grid-template-columns: 1fr;
    }
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
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 0.9rem;
    color: var(--text-primary);
    font-family: inherit;
    width: 100%;
    resize: none;
    transition:
      border-color 0.25s ease,
      box-shadow 0.25s ease,
      background 0.25s ease;
    outline: none;
  }

  .form-field input::placeholder,
  .form-field textarea::placeholder {
    color: var(--text-muted);
  }

  .form-field input:focus,
  .form-field textarea:focus {
    border-color: #6366f1;
    background: var(--bg-card);
    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.15);
  }

  .form-field input:disabled,
  .form-field textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .form-submit {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    align-self: flex-start;
    padding: 10px 22px;
    border-radius: 9999px;
    border: 0.5px solid var(--border);
    background: var(--text-primary);
    color: var(--bg-card);
    font-size: 0.875rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition:
      opacity 0.2s ease,
      transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
      box-shadow 0.3s ease;
  }

  .form-submit:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.03);
    box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  }

  .form-submit:hover:not(:disabled) svg {
    transform: translateX(4px) translateY(-2px);
  }

  .form-submit svg {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .form-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .form-success {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: var(--text-secondary);
    padding: 14px 16px;
    border: 0.5px solid var(--border);
    border-radius: 10px;
    background: var(--bg-outer);
    max-width: 560px;
  }

  .form-error {
    font-size: 0.82rem;
    color: #e05a5a;
    margin: 0;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }
</style>
