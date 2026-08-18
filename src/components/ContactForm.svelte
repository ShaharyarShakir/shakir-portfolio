<script lang="ts">
  import { sendContactMessage } from '$lib/services/contactService';

  let form = $state({ name: '', email: '', subject: '', message: '' });
  let status: 'idle' | 'sending' | 'sent' | 'error' = $state('idle');

  async function handleSubmit() {
    if (!form.name || !form.email || !form.message) return;
    status = 'sending';
    const result = await sendContactMessage(form);
    if (result.success) {
      status = 'sent';
      form = { name: '', email: '', subject: '', message: '' };
    } else {
      status = 'error';
    }
  }
</script>

<div class="pt-10 border-t border-[var(--border)] mb-10">
  <p class="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)] mb-6">
    Send a message
  </p>

  {#if status === "sent"}
    <div class="alert alert-success shadow-lg max-w-xl text-[var(--text-primary)] flex items-center gap-3">
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
      <span>message sent — i'll get back to you soon.</span>
    </div>
  {:else}
    <div class="flex flex-col gap-4 max-w-xl">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="form-control w-full">
          <label for="name" class="label text-xs font-semibold tracking-wider text-[var(--text-secondary)] lowercase py-1">
            name
          </label>
          <input
            id="name"
            type="text"
            placeholder="your name"
            class="input input-bordered w-full rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 border-[var(--border)] focus:outline-hidden focus:border-indigo-500 transition-all"
            bind:value={form.name}
            disabled={status === "sending"}
          />
        </div>

        <div class="form-control w-full">
          <label for="email" class="label text-xs font-semibold tracking-wider text-[var(--text-secondary)] lowercase py-1">
            email
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            class="input input-bordered w-full rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 border-[var(--border)] focus:outline-hidden focus:border-indigo-500 transition-all"
            bind:value={form.email}
            disabled={status === "sending"}
          />
        </div>
      </div>

      <div class="form-control w-full">
        <label for="subject" class="label text-xs font-semibold tracking-wider text-[var(--text-secondary)] lowercase py-1">
          subject
        </label>
        <input
          id="subject"
          type="text"
          placeholder="what's this about?"
          class="input input-bordered w-full rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 border-[var(--border)] focus:outline-hidden focus:border-indigo-500 transition-all"
          bind:value={form.subject}
          disabled={status === "sending"}
        />
      </div>

      <div class="form-control w-full">
        <label for="message" class="label text-xs font-semibold tracking-wider text-[var(--text-secondary)] lowercase py-1">
          message
        </label>
        <textarea
          id="message"
          rows="5"
          placeholder="tell me what you're working on..."
          class="textarea textarea-bordered w-full rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] placeholder:text-slate-400 dark:placeholder:text-slate-500 border-[var(--border)] focus:outline-hidden focus:border-indigo-500 transition-all"
          bind:value={form.message}
          disabled={status === "sending"}
        ></textarea>
      </div>

      {#if status === "error"}
        <p class="text-xs text-rose-500 m-0">
          something went wrong — try emailing directly instead.
        </p>
      {/if}

      <button
        class="inline-flex items-center justify-center rounded-full self-start px-6 py-2.5 gap-2 text-sm font-semibold transition-all duration-200 bg-sky-900 dark:bg-amber-400 text-white dark:text-slate-950 hover:opacity-90 shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 dark:disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none"
        onclick={handleSubmit}
        disabled={status === "sending" || !form.name || !form.email || !form.message}
      >
        {#if status === "sending"}
          <span class="loading loading-spinner loading-xs"></span>
          sending...
        {:else}
          send message
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        {/if}
      </button>
    </div>
  {/if}
</div>
